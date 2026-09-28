from __future__ import annotations

import io
import json
import os
from functools import lru_cache
from typing import Any

import torch
import torch.nn.functional as F
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from PIL import Image
from torchvision import models, transforms

GENERAL_MODEL_ID = os.getenv("GENERAL_MODEL_ID", "Kathir56/plant-disease-tamilnadu")
RICE_MODEL_ID = os.getenv("RICE_MODEL_ID", "Huyt/rice-leaf-disease-efficientnet-b0")
COTTON_MODEL_ID = os.getenv("COTTON_MODEL_ID", "FarmGuard/cotton-densenet121")

GENERAL_CROPS = {"tomato", "potato", "apple", "maize", "corn", "pepper", "grape"}
CROP_ALIASES = {"corn": "maize", "bell_pepper": "pepper", "pepper_bell": "pepper"}
AUTO_SUPPORTED_CROPS = GENERAL_CROPS | {"rice", "cotton"}
AUTO_IMAGE_CONFIDENCE_MINIMUM = 45.0

app = FastAPI(title="AgriSense Real AI Service", version="2.0.0")


def clean_label(label: str) -> tuple[str, str]:
    """Convert PlantVillage-style labels to display crop + disease."""
    raw = label.replace("__", "___").strip()
    if "___" in raw:
        crop_raw, disease_raw = raw.split("___", 1)
    else:
        crop_raw, disease_raw = "", raw

    crop_map = {
        "Corn_(maize)": "Maize",
        "Pepper,_bell": "Pepper",
        "Cherry_(including_sour)": "Cherry",
        "Orange": "Orange",
    }
    crop = crop_map.get(crop_raw, crop_raw.replace("_", " ").strip())
    disease = disease_raw.replace("_", " ").replace("  ", " ").strip()
    disease = disease.replace("healthy", "Healthy")
    return crop, disease


def crop_key(value: str | None) -> str:
    return (value or "").strip().lower().replace(" ", "_")


def canonical_crop_key(value: str | None) -> str:
    key = crop_key(value)
    return CROP_ALIASES.get(key, key)


@lru_cache(maxsize=1)
def load_general():
    from transformers import AutoImageProcessor, AutoModelForImageClassification

    processor = AutoImageProcessor.from_pretrained(GENERAL_MODEL_ID)
    model = AutoModelForImageClassification.from_pretrained(GENERAL_MODEL_ID)
    model.eval()
    return processor, model


@lru_cache(maxsize=1)
def load_rice():
    import timm

    model = timm.create_model(f"hf_hub:{RICE_MODEL_ID}", pretrained=True).eval()
    cfg = timm.data.resolve_data_config({}, model=model)
    transform = timm.data.create_transform(**cfg, is_training=False)
    labels = model.pretrained_cfg.get("label_names")
    if not labels:
        labels = [
            "Bacterial Blight", "Bacterial Streak", "Bakanae", "Brown Spot",
            "False Smut", "Grassy Stunt Virus", "Healthy", "Hispa", "Leaf Blast",
            "Leaf Scald", "Narrow Brown Spot", "Neck Blast", "Ragged Stunt Virus",
            "Sheath Blight", "Sheath Rot", "Stem Rot", "Tungro"
        ]
    return model, transform, labels


@lru_cache(maxsize=1)
def load_cotton():
    from huggingface_hub import hf_hub_download

    repo = COTTON_MODEL_ID
    weights_path = hf_hub_download(repo_id=repo, filename="best_densenet.pth")
    classes_path = hf_hub_download(repo_id=repo, filename="classes.json")
    with open(classes_path, encoding="utf-8") as f:
        classes = json.load(f)

    model = models.densenet121(weights=None)
    model.classifier = torch.nn.Linear(model.classifier.in_features, len(classes))
    checkpoint = torch.load(weights_path, map_location="cpu")
    state_dict = checkpoint.get("model_state_dict", checkpoint.get("state_dict", checkpoint))
    model.load_state_dict(state_dict)
    model.eval()
    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225)),
    ])
    return model, transform, classes


def top_predictions(probs: torch.Tensor, labels: list[str], n: int = 3) -> list[dict[str, Any]]:
    values, indices = torch.topk(probs, k=min(n, len(labels)))
    return [
        {"label": labels[int(i)], "confidence": round(float(v) * 100, 2)}
        for v, i in zip(values, indices)
    ]


def general_predict(image: Image.Image, requested_crop: str):
    processor, model = load_general()
    inputs = processor(images=image, return_tensors="pt")
    with torch.inference_mode():
        probs = F.softmax(model(**inputs).logits, dim=-1)[0]
    labels = [model.config.id2label[i] for i in range(len(model.config.id2label))]
    global_predictions = top_predictions(probs, labels)
    global_crop, _ = clean_label(global_predictions[0]["label"])

    # PlantVillage models compare all crop classes at once. When a farmer has
    # selected a crop, compare only that crop's disease classes so an unrelated
    # class (for example, Strawberry) cannot replace the requested diagnosis.
    if requested_crop in GENERAL_CROPS:
        matching_indices = [
            index
            for index, label in enumerate(labels)
            if canonical_crop_key(clean_label(label)[0]) == requested_crop
        ]
        if matching_indices:
            matching_labels = [labels[index] for index in matching_indices]
            matching_probs = probs[matching_indices]
            crop_probability = round(float(matching_probs.sum()) * 100, 2)
            # Re-normalize within the farmer's selected crop. A global
            # PlantVillage score spans every crop class and understates the
            # confidence of a tomato-only, potato-only, etc. comparison.
            predictions = top_predictions(matching_probs / matching_probs.sum(), matching_labels)
            crop, disease = clean_label(predictions[0]["label"])
            return crop, disease, predictions, global_crop, crop_probability

    crop, disease = clean_label(global_predictions[0]["label"])
    return crop, disease, global_predictions, global_crop, global_predictions[0]["confidence"]


def rice_predict(image: Image.Image):
    model, transform, labels = load_rice()
    tensor = transform(image).unsqueeze(0)
    with torch.inference_mode():
        probs = model(tensor).softmax(-1)[0]
    preds = top_predictions(probs, list(labels))
    disease = preds[0]["label"]
    return "Rice", disease, preds


def cotton_predict(image: Image.Image):
    model, transform, labels = load_cotton()
    tensor = transform(image).unsqueeze(0)
    with torch.inference_mode():
        probs = model(tensor).softmax(-1)[0]
    preds = top_predictions(probs, list(labels))
    disease = preds[0]["label"].replace("fussarium", "Fusarium").title()
    return "Cotton", disease, preds


@app.get("/health")
def health():
    return {"status": "healthy", "service": "AgriSense Real AI", "models": {
        "general": GENERAL_MODEL_ID,
        "rice": RICE_MODEL_ID,
        "cotton": COTTON_MODEL_ID,
    }}


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    crop: str = Form("Auto Detect"),
    crop_hint: str = Form(""),
):
    raw = await file.read()
    if len(raw) > 15 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image is larger than 15 MB.")

    try:
        image = Image.open(io.BytesIO(raw)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail="The uploaded file is not a valid image.") from exc

    key = canonical_crop_key(crop)
    is_auto_detect = key in ("", "auto", "auto_detect", "auto-detect")

    # The disease model was trained across multiple crops. It can identify a
    # crop automatically for close-up, in-distribution images, but field photos
    # may produce a confident label for an unrelated crop. In that case use the
    # authenticated farmer's profile crop as the explicit, deterministic prior.
    auto_source = None
    image_crop_confidence = None
    if is_auto_detect:
        try:
            _, _, visual_predictions, visual_crop, _ = general_predict(image, "")
        except Exception as exc:
            raise HTTPException(status_code=503, detail=f"AI model could not run: {exc}") from exc

        visual_key = canonical_crop_key(visual_crop)
        image_crop_confidence = visual_predictions[0]["confidence"]
        if visual_key in AUTO_SUPPORTED_CROPS and image_crop_confidence >= AUTO_IMAGE_CONFIDENCE_MINIMUM:
            key = visual_key
            auto_source = "image"
        else:
            hint_key = canonical_crop_key(crop_hint)
            if hint_key not in AUTO_SUPPORTED_CROPS:
                raise HTTPException(
                    status_code=422,
                    detail="Auto Detect needs a clear close-up leaf photo or a main crop in the farmer profile.",
                )
            key = hint_key
            auto_source = "profile"

    try:
        if key == "rice":
            predicted_crop, disease, predictions = rice_predict(image)
            model_name = RICE_MODEL_ID
            global_crop = predicted_crop
            crop_probability = predictions[0]["confidence"]
        elif key == "cotton":
            predicted_crop, disease, predictions = cotton_predict(image)
            model_name = COTTON_MODEL_ID
            global_crop = predicted_crop
            crop_probability = predictions[0]["confidence"]
        else:
            predicted_crop, disease, predictions, global_crop, crop_probability = general_predict(image, key)
            model_name = GENERAL_MODEL_ID
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"AI model could not run: {exc}") from exc

    selected = predictions[0]["confidence"]

    # A selected crop is farmer-provided context, so do not reject its result
    # merely because the broad multi-crop classifier prefers another crop.
    mismatch = False

    # Softmax confidence is a model score, not a guaranteed real-world correctness percentage.
    # We explicitly return it as model_confidence to avoid presenting it as a calibrated probability.
    if auto_source == "profile":
        note = (
            f"Auto Detect used your profile crop ({predicted_crop}) because the image alone could not identify the crop reliably. "
            "Disease ranking was then limited to that crop."
        )
    elif auto_source == "image":
        note = (
            f"Auto Detect identified {predicted_crop} from the image before ranking its disease classes. "
            "Confidence is a model score, not a guarantee of field-level accuracy."
        )
    else:
        note = "Confidence is the model softmax score within the selected crop when a crop is chosen. Field accuracy can be lower than benchmark accuracy."

    return {
        "status": "success",
        "crop": predicted_crop,
        "disease": disease,
        "model_confidence": selected,
        "crop_probability": crop_probability,
        "top_predictions": predictions,
        "crop_mismatch": mismatch,
        "model": model_name,
        "note": note,
    }
