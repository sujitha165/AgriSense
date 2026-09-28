/**
 * AgriSense AI Chatbot Service
 * Intelligent conversational assistant specialized in agricultural guidance,
 * crop diseases, organic solutions, soil health, and government subsidies.
 * Pluggable to Gemini / OpenAI API via environment variables.
 */

const env = require('../config/env');
const { CROP_DISEASE_KNOWLEDGE_BASE } = require('./diseaseKnowledgeBase');

const AGRICULTURAL_KNOWLEDGE_PROMPTS = [
  {
    triggers: ['tomato', 'early blight', 'late blight', 'leaf curl', 'wilting'],
    response: `**Tomato Health Guidance:**
* **Early Blight:** Characterized by brown concentric target rings on bottom leaves. Prune infected leaves immediately, apply copper oxychloride (2.5g/L), and switch to drip irrigation to prevent soil splash.
* **Late Blight:** Water-soaked lesions with white mold underneath during humid weather. Urgently destroy infected foliage and treat with systemic fungicide (Metalaxyl + Mancozeb).
* **Leaf Curl Virus:** Transmitted by whiteflies. Control whiteflies with yellow sticky traps and neem oil spray (5ml/L).

*Tip:* Always sanitize pruning shears with 70% alcohol between cuts to avoid cross-contamination.`
  },
  {
    triggers: ['prevent', 'prevention', 'fungus', 'disease prevention', 'healthy'],
    response: `**Top 5 Preventative Crop Protection Principles:**
1. **Crop Rotation:** Rotate nightshade crops (tomatoes, potatoes, eggplants) with legumes or cereals on a 3-year cycle.
2. **Canopy Airflow:** Maintain proper row and plant spacing so foliage dries rapidly in morning sunlight.
3. **Smart Irrigation:** Water directly at the root zone via drip lines; never use overhead sprinklers late in the evening.
4. **Organic Soil Barrier:** Apply 2–3 inches of straw or organic mulch to prevent rain from splashing soil-borne fungal spores onto lower leaves.
5. **Beneficial Biocontrols:** Periodic prophylactic sprays of *Trichoderma viride* or *Pseudomonas fluorescens* build natural resistance.`
  },
  {
    triggers: ['scheme', 'subsidy', 'government', 'pm kisan', 'pmfby', 'financial', 'loan'],
    response: `**Key Government Agricultural Support Programs:**
* **PM-KISAN:** ₹6,000/year direct cash transfer delivered in three 4-monthly installments of ₹2,000. Apply at [pmkisan.gov.in](https://pmkisan.gov.in).
* **PMFBY (Crop Insurance):** Comprehensive insurance covering weather, pest, and disease damage. Premium is only 2% for Kharif crops and 1.5% for Rabi crops.
* **SMAM (Mechanization Subsidy):** 40% to 50% subsidy for purchasing tractors, power sprayers, rotavators, and harvesters.
* **Kisan Credit Card (KCC):** Short-term crop loans up to ₹3 Lakh at an effective low interest rate of 4% per annum upon on-time repayment.

Check the **Government Schemes** tab in the sidebar for full eligibility criteria and application workflows!`
  },
  {
    triggers: ['potato', 'tuber', 'potato blight', 'scab'],
    response: `**Potato Disease & Management Guide:**
* **Late Blight in Potato:** Rapidly destroys leaves and causes dry brown rot in tubers. Hill high soil ridges over developing tubers to shield them from spores washed down by rain.
* **Early Blight:** Appears as brown target-board spots during tuber bulking. Ensure balanced nitrogen and potassium to avoid premature plant senescence.
* **Storage Advice:** Store harvested tubers in a cool, well-ventilated, dark area (10–12°C with 90% humidity) after curing for 10 days to heal skin abrasions.`
  },
  {
    triggers: ['rice', 'paddy', 'blast', 'brown spot', 'bacterial leaf blight'],
    response: `**Paddy (Rice) Health Advice:**
* **Bacterial Leaf Blight:** Yellowish-white wavy lesions starting at leaf tips. Drain the field for 2–3 days to aerate the soil and temporarily halt chemical nitrogen top-dressing.
* **Brown Spot:** Oval sesame-seed spots often indicate potassium or micronutrient deficiency in the soil. Top-dress with MOP (Muriate of Potash).
* **Blast Disease:** Spindle-shaped lesions with gray centers. Avoid excessive urea application and spray Tricyclazole (0.6g/L) during tillering.`
  },
  {
    triggers: ['fertilizer', 'npk', 'soil', 'nutrition', 'manure', 'urea'],
    response: `**Balanced Crop Nutrition Tips:**
* **Soil Testing First:** Avail the Government *Soil Health Card Scheme* to get your field soil tested free of charge before deciding on fertilizer dosages.
* **The 4:2:1 Ratio:** General recommendation for cereals is 4 parts Nitrogen (N), 2 parts Phosphorus (P), and 1 part Potassium (K), but tailored to soil test results.
* **Organic Matter:** Incorprate 5–10 tons of well-decomposed Farmyard Manure (FYM) or 2 tons of Vermicompost per acre before planting to boost microbial activity and moisture retention.`
  }
];

const DEFAULT_RESPONSE = `Hello! I am your **AgriSense AI Assistant** 🌱.

I can help you with:
* **Diagnosing Crop Diseases:** Ask about blight, rust, leaf spot, or mildew on tomato, potato, rice, apple, cotton, and more.
* **Actionable Treatment Plans:** Get organic solutions, approved bio-fungicide suggestions, and preventive farming practices.
* **Government Subsidies & Schemes:** Inquire about PM-KISAN, PMFBY crop insurance, SMAM machinery subsidies, and KCC loans.
* **Crop Economics:** Guidance on minimizing input expenses and calculating harvest profit margins.

Try asking: *"What should I do after detecting early blight on tomato?"* or *"What government schemes are available for subsidies?"*`;

const FARMING_TERMS = [
  'farm', 'farmer', 'crop', 'plant', 'leaf', 'soil', 'seed', 'fertilizer', 'manure',
  'pest', 'disease', 'fungus', 'fungal', 'blight', 'mildew', 'virus', 'spray',
  'irrigation', 'water', 'weather', 'rain', 'harvest', 'yield', 'market', 'price',
  'profit', 'loan', 'subsidy', 'scheme', 'insurance', 'pm kisan', 'pmfby', 'kcc',
  'tractor', 'sprayer', 'tool', 'equipment', 'tomato', 'potato', 'rice', 'paddy',
  'cotton', 'maize', 'corn', 'apple', 'grape', 'pepper', 'organic', 'compost',
  'நெல்', 'தக்காளி', 'பயிர்', 'நோய்', 'மண்', 'உரம்', 'நீர்', 'திட்டம்', 'மானியம்',
  'धान', 'फसल', 'रोग', 'मिट्टी', 'खाद', 'सिंचाई', 'योजना', 'किसान',
  'పంట', 'వ్యాధి', 'నేల', 'ఎరువు', 'నీరు', 'పథకం'
];

const SCAN_FOLLOW_UP_TERMS = [
  'scan', 'report', 'diagnosis', 'result', 'treatment', 'what should', 'what now',
  'this', 'it', 'spray', 'medicine', 'current', 'latest', 'புகைப்படம்', 'ரிப்போர்ட்',
  'ரிப்போர்ட்', 'रिपोर्ट', 'इलाज', 'రిపోర్ట్', 'చికిత్స'
];

function normalise(value = '') {
  return value.toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/[.,!?;:()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasTerm(query, term) {
  // Whole-word matching prevents a scan follow-up like "it" from matching
  // inside unrelated words such as "write".
  if (/^[a-z0-9 ]+$/i.test(term)) return ` ${query} `.includes(` ${term} `);
  return query.includes(term);
}

function findKnowledge(crop, disease) {
  const aliases = { corn: 'maize', 'bell pepper': 'pepper' };
  const cropKey = aliases[normalise(crop)] || normalise(crop);
  return (CROP_DISEASE_KNOWLEDGE_BASE[cropKey] || []).find(
    item => normalise(item.disease) === normalise(disease)
  ) || null;
}

function isFarmerQuestion(message, currentScan) {
  const query = normalise(message);
  if (/^(hi|hello|vanakkam|namaste|help)\b/.test(query)) return true;
  if (FARMING_TERMS.some(term => hasTerm(query, term))) return true;
  return Boolean(currentScan && SCAN_FOLLOW_UP_TERMS.some(term => hasTerm(query, term)));
}

function formatScanContext(scan) {
  if (!scan) return 'No recent crop scan is available for this farmer.';
  return [
    `Latest scan ID: ${scan.id}`,
    `Crop: ${scan.crop}`,
    `Predicted issue: ${scan.disease}`,
    `Model confidence: ${scan.confidence}%`,
    `Severity: ${scan.severity}`,
    `Observed symptoms: ${(scan.symptoms || []).join('; ') || 'Not recorded'}`,
    `Notes: ${scan.notes || 'None'}`
  ].join('\n');
}

function farmOnlyMessage(language) {
  if (language === 'ta') return 'நான் விவசாய உதவியாளர். பயிர்கள், நோய்கள், மண், நீர்ப்பாசனம், பண்ணை கருவிகள், சந்தை மற்றும் அரசு திட்டங்கள் பற்றியே உதவ முடியும்.';
  if (language === 'hi') return 'मैं केवल खेती से जुड़े सवालों में मदद कर सकता हूँ: फसल, रोग, मिट्टी, सिंचाई, औजार, बाजार और सरकारी योजनाएं।';
  return 'I am a farmer-focused assistant. I can help with crops, diseases, soil, irrigation, farm tools, markets, and government schemes.';
}

function buildSystemPrompt({ language, farmer, currentScan, locationContext }) {
  return `You are AgriSense, a practical assistant for Indian farmers. Answer only agricultural questions: crops, plant health, pest and disease management, soil, irrigation, weather preparedness, farm tools, farm economics, and government schemes. Politely refuse unrelated requests.

Reply in ${language === 'ta' ? 'Tamil' : language === 'hi' ? 'Hindi' : language === 'te' ? 'Telugu' : 'English'}. Be concise, practical, and use headings plus short bullets when helpful. Use the farmer's latest scan when the question relates to it. The scan is assistive, not a laboratory confirmation; ask the farmer to verify serious or unusual symptoms. Do not invent eligibility, product registration, pesticide labels, or real-time prices. For pesticide use, emphasize locally registered labels, PPE, and local agricultural-extension advice. Never claim to have carried out a real-world action.

Farmer profile: ${farmer.name}, location: ${farmer.location}, main crop: ${farmer.main_crop}.
${locationContext ? `Browser location context: ${locationContext}` : ''}
Current scan:\n${formatScanContext(currentScan)}`;
}

function sanitiseHistory(history) {
  return (Array.isArray(history) ? history : [])
    .slice(-8)
    .filter(item => item && typeof item.text === 'string' && ['user', 'assistant'].includes(item.sender))
    .map(item => ({ role: item.sender === 'assistant' ? 'assistant' : 'user', content: item.text.slice(0, 2000) }));
}

async function callLiveModel(context, message, history) {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.AI_CHAT_TIMEOUT_MS);
  try {
    const response = await fetch(`${env.AI_CHAT_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL,
        temperature: 0.35,
        max_tokens: 700,
        messages: [
          { role: 'system', content: context },
          ...sanitiseHistory(history),
          { role: 'user', content: message }
        ]
      }),
      signal: controller.signal
    });
    if (!response.ok) {
      console.warn(`[Chatbot] Live model returned ${response.status}. Using guided response.`);
      return null;
    }
    const body = await response.json();
    return body?.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.warn(`[Chatbot] Live model unavailable: ${error.name}. Using guided response.`);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function reportAwareResponse(message, currentScan, language) {
  const query = normalise(message);
  if (currentScan && SCAN_FOLLOW_UP_TERMS.some(term => hasTerm(query, term))) {
    const knowledge = findKnowledge(currentScan.crop, currentScan.disease);
    const action = knowledge?.treatment?.slice(0, 3) || [
      'Inspect several plants and confirm that the visible symptoms match the scan.',
      'Remove badly affected leaves only when field conditions and the crop stage allow it.',
      'Use only a product registered locally for this crop and confirmed diagnosis.'
    ];
    return `**Latest scan: ${currentScan.crop} - ${currentScan.disease}**\n* Model confidence: ${currentScan.confidence}%\n* Severity: ${currentScan.severity}\n\n**Next steps**\n${action.map(item => `* ${item}`).join('\n')}\n\nBefore spraying, verify the symptom pattern in the field and follow the current local product label.`;
  }

  for (const item of AGRICULTURAL_KNOWLEDGE_PROMPTS) {
    if (item.triggers.some(trigger => hasTerm(query, trigger))) return item.response;
  }

  return `${farmOnlyMessage(language)}\n\nFor a precise recommendation, tell me the crop, growth stage, visible symptom, and whether the problem is spreading. ${currentScan ? `Your latest ${currentScan.crop} scan is already available for follow-up questions.` : ''}`;
}

async function getChatResponse({ message, history = [], language = 'en', farmer, currentScan, locationContext = '' }) {
  if (!message || message.trim() === '') {
    return { reply: DEFAULT_RESPONSE, source: 'guided' };
  }

  if (!isFarmerQuestion(message, currentScan)) {
    return { reply: farmOnlyMessage(language), source: 'guarded' };
  }

  const liveReply = await callLiveModel(
    buildSystemPrompt({ language, farmer, currentScan, locationContext }),
    message.trim(),
    history
  );
  if (liveReply) return { reply: liveReply, source: 'live' };

  return { reply: reportAwareResponse(message, currentScan, language), source: 'guided' };
}

module.exports = {
  getChatResponse
};
