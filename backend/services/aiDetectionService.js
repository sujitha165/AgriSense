/**
 * AgriSense real AI bridge.
 * The image itself is sent to the Python AI service. This file no longer
 * chooses a disease from a hard-coded first entry or randomises confidence.
 */
const fs = require('fs/promises');
const env = require('../config/env');
const { CROP_DISEASE_KNOWLEDGE_BASE } = require('./diseaseKnowledgeBase');

function titleCase(value = '') {
  return value.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
    .replace(/\b\w/g, c => c.toUpperCase());
}

function normalise(value = '') {
  return value.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function findKnowledge(crop, disease) {
  const cropKey = normalise(crop);
  const diseaseKey = normalise(disease);
  const aliases = {
    corn: 'maize',
    'bell pepper': 'pepper'
  };
  const key = aliases[cropKey] || cropKey;
  const entries = CROP_DISEASE_KNOWLEDGE_BASE[key] || [];
  return entries.find(item => normalise(item.disease) === diseaseKey) || null;
}

function diseaseCategory(disease = '') {
  const d = normalise(disease);
  if (d === 'healthy') return 'healthy';
  if (d.includes('virus') || d.includes('mosaic') || d.includes('tungro')) return 'viral';
  if (d.includes('bacterial')) return 'bacterial';
  if (d.includes('spider') || d.includes('hispa') || d.includes('mite') || d.includes('armyworm')) return 'insect';
  if (d.includes('rust') || d.includes('blight') || d.includes('mold') || d.includes('mildew') || d.includes('scab') || d.includes('rot') || d.includes('spot') || d.includes('blast') || d.includes('esca') || d.includes('scorch')) return 'fungal';
  return 'other';
}

function genericTreatment(crop, disease) {
  const category = diseaseCategory(disease);
  const cropName = titleCase(crop);

  if (category === 'healthy') {
    return {
      pathogen: 'None detected',
      severity: 'Healthy',
      symptoms: ['No disease class was predicted by the image classifier.'],
      causes: ['No disease pattern was detected within the model classes.'],
      treatment: [
        'No disease treatment is indicated from this image.',
        'Continue balanced irrigation, nutrition, field sanitation and routine scouting.'
      ],
      prevention: ['Use clean planting material, maintain crop hygiene and scout regularly.'],
      monitoring: 'Re-scan if new lesions, discoloration, wilting or abnormal growth appears.',
      expert_warning: 'A healthy prediction does not rule out nutrient disorders, pests or diseases outside the model classes.'
    };
  }

  const common = {
    pathogen: 'See disease label / local plant pathology reference',
    severity: 'Not assessed',
    symptoms: [`Image classifier prediction: ${disease}. Confirm characteristic symptoms in the field.`],
    causes: [`The classifier associates the image with ${disease}; environmental and agronomic causes require field confirmation.`],
    prevention: [
      'Remove crop debris and volunteer hosts that can maintain inoculum.',
      'Improve canopy airflow and avoid unnecessary leaf wetness.',
      'Use clean planting material and resistant/tolerant varieties where available.'
    ],
    monitoring: 'Inspect the crop regularly and re-scan representative leaves. Escalate to an agricultural extension officer if symptoms spread rapidly.',
    expert_warning: 'Image classification is an assistive diagnosis. Confirm severe or unusual cases before applying pesticides.'
  };

  if (category === 'viral') {
    common.treatment = [
      'There is generally no curative foliar spray for a plant virus once tissue is infected.',
      'Remove and safely destroy strongly symptomatic plants where recommended for the crop.',
      'Control known insect vectors and weeds using integrated pest management (IPM).',
      'Use certified, virus-free planting material and resistant varieties where available.'
    ];
  } else if (category === 'bacterial') {
    common.treatment = [
      'Remove badly infected leaves or plants and sanitize tools between plants.',
      'Avoid overhead irrigation and working the crop while foliage is wet.',
      'Use resistant varieties and clean seed/planting material where available.',
      'If a bactericide is considered, use only a product registered for this crop and disease in your area and follow its current label.'
    ];
  } else if (category === 'insect') {
    common.treatment = [
      'Inspect the underside of leaves and growing points to confirm the insect or mite.',
      'Use physical removal and biological control where practical.',
      'Use an insecticide/miticide only when monitoring shows treatment is justified and only according to the locally registered label.'
    ];
  } else {
    common.treatment = [
      'Remove heavily infected tissue and dispose of it away from the crop where appropriate.',
      'Reduce prolonged leaf wetness and improve canopy ventilation.',
      'Use sanitation, crop rotation and resistant varieties where available.',
      `If a fungicide is needed for ${cropName}, use only a product currently registered for ${cropName} and ${disease} in your jurisdiction and follow the label exactly.`
    ];
  }

  return common;
}

async function analyzeCropImage({ imageBuffer, imageUrl, imageFilename, imageMimeType, cropType, cropHint, filePath }) {
  if (!env.AI_API_URL) {
    throw new Error('AI_API_URL is not configured. Start the Python AI service first.');
  }

  let buffer = imageBuffer;
  if (!buffer && filePath) buffer = await fs.readFile(filePath);
  if (!buffer) throw new Error('No image bytes were supplied to the AI service.');

  const form = new FormData();
  form.append(
    'file',
    new Blob([buffer], { type: imageMimeType || 'image/jpeg' }),
    imageFilename || 'leaf.jpg'
  );
  form.append('crop', cropType || 'Auto Detect');
  form.append('crop_hint', cropHint || '');

  let response;
  try {
    response = await fetch(`${env.AI_API_URL.replace(/\/$/, '')}/predict`, {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(90000)
    });
  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new Error('The AI service took too long to respond. Please try again.');
    }
    throw new Error('The AI service is unavailable. Start it on http://127.0.0.1:8000 and try again.');
  }

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.detail || `AI service returned HTTP ${response.status}`);
  }

  const crop = body.crop || titleCase(cropType || 'Unknown');
  const disease = body.disease || 'Unknown';
  const knowledge = findKnowledge(crop, disease);
  const advice = knowledge || genericTreatment(crop, disease);

  return {
    crop,
    disease,
    pathogen: knowledge?.pathogen || advice.pathogen,
    confidence: Number(body.model_confidence),
    severity: advice.severity,
    symptoms: knowledge?.symptoms || advice.symptoms,
    causes: knowledge?.causes || advice.causes,
    treatment: knowledge?.treatment || advice.treatment,
    prevention: knowledge?.prevention || advice.prevention,
    monitoring: knowledge?.monitoring || advice.monitoring,
    expert_warning: knowledge?.expert_warning || advice.expert_warning,
    top_predictions: body.top_predictions || [],
    crop_mismatch: Boolean(body.crop_mismatch),
    model: body.model,
    confidence_note: body.note,
    analyzed_at: new Date().toISOString()
  };
}

function getTreatmentForDiagnosis(crop, disease) {
  const knowledge = findKnowledge(crop, disease);
  return knowledge || genericTreatment(crop, disease);
}

module.exports = {
  analyzeCropImage,
  getTreatmentForDiagnosis,
  CROP_DISEASE_KNOWLEDGE_BASE
};
