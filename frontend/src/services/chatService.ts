import { apiRequest } from './api';
import { LocationEnvironment } from './locationService';
import { ChatMessage } from '../types';

// Tamil crop/disease keyword mapping for local fallback
const TAMIL_KEYWORDS: Record<string, string[]> = {
  tomato: ['தக்காளி', 'tomato'],
  blight: ['கருகல்', 'blight', 'வாடல்'],
  fungus: ['பூஞ்சை', 'fungus', 'fungal', 'மாவு பூஞ்சை'],
  rice: ['நெல்', 'அரிசி', 'rice'],
  paddy: ['நெல்', 'paddy'],
  cotton: ['பருத்தி', 'cotton'],
  pest: ['பூச்சி', 'pest', 'கீட'],
  scheme: ['திட்டம்', 'மானியம்', 'scheme', 'subsidy', 'loan', 'கடன்'],
  healthy: ['ஆரோக்கியம்', 'நல்ல', 'healthy'],
  leaf: ['இலை', 'leaf'],
  spray: ['தெளிக்க', 'spray', 'ஸ்பிரே'],
  water: ['நீர்', 'தண்ணீர்', 'water', 'irrigation', 'நீர்ப்பாசனம்'],
  profit: ['லாபம்', 'profit', 'வருமானம்', 'income'],
  weather: ['வானிலை', 'weather', 'மழை', 'rain'],
};

function detectKeywords(message: string): Set<string> {
  const lower = message.toLowerCase();
  const found = new Set<string>();
  for (const [key, terms] of Object.entries(TAMIL_KEYWORDS)) {
    if (terms.some(t => lower.includes(t))) {
      found.add(key);
    }
  }
  return found;
}

// Build location context string for chat
function buildLocationContext(env?: LocationEnvironment): string {
  if (!env) return '';
  return `[Location Context: ${env.state}, ${env.zone}, ${env.season} season, ${env.humidity} humidity, Soil: ${env.soilType}]`;
}

// Rich Tamil language fallback responses
const TAMIL_RESPONSES = {
  blight: `**தக்காளி / உருளைக்கிழங்கு கருகல் நோய் (Blight) சிகிச்சை:**\n\n🌿 **உடனடி நடவடிக்கை:**\n* பாதிக்கப்பட்ட இலைகளை கத்தரித்து எரிக்கவும் அல்லது ஆழமாக புதைக்கவும்\n* மேல் நீர்ப்பாசனம் நிறுத்தி, தொட்டி நீர்ப்பாசனம் (Drip) பயன்படுத்தவும்\n\n💊 **பரிந்துரைக்கப்பட்ட மருந்துகள்:**\n* **காப்பர் ஆக்சி குளோரைடு** (2.5 கிராம்/லிட்டர்) - தெளிக்கவும்\n* **மேன்கோசெப் 75%** (2.5 கிராம்/லிட்டர்) - தடுப்பு முறையாக\n* **மெட்டாலாக்சில் + மேன்கோசெப்** - கடுமையான நோய்க்கு\n\n🌱 **இயற்கை முறை:**\n* **ட்ரைக்கோடெர்மா விரிடே** (5 கிராம்/லிட்டர்) - உயிரியல் கட்டுப்பாடு\n* வேப்பெண்ணெய் (5 மில்லி/லிட்டர்) + திரவ சோப்பு (0.5 மில்லி)\n\n⏰ **தெளிக்கும் நேரம்:** காலை 6-8 மணி மிகவும் சிறந்தது`,

  fungus: `**பூஞ்சை நோய் தடுப்பு மற்றும் சிகிச்சை:**\n\n🔬 **முக்கிய தடுப்பு முறைகள்:**\n1. **பயிர் சுழற்சி:** மூன்று ஆண்டுகளுக்கு ஒரு முறை வெவ்வேறு பயிர் பயிரிடவும்\n2. **காற்றோட்டம்:** வரிசைகளுக்கு இடையே 60 செ.மீ. இடைவெளி வைக்கவும்\n3. **மண் மூடாக்கு:** 2-3 அங்குல வைக்கோல் போடவும்\n4. **உயிரியல் கட்டுப்பாடு:** **ட்ரைக்கோடெர்மா விரிடே** தொடர்ந்து தெளிக்கவும்\n\n💡 **பரிந்துரை:** ஒவ்வொரு 14 நாளுக்கு ஒரு முறை வேப்பெண்ணெய் தெளிக்கவும்`,

  scheme: `**விவசாயிகளுக்கான அரசு திட்டங்கள்:**\n\n💰 **PM-KISAN:** ஆண்டுக்கு ₹6,000 நேரடியாக வங்கி கணக்கில் - மூன்று தவணைகளில்\n\n🌾 **PMFBY பயிர் காப்பீடு:**\n* பயிர் கட்டணம் 1.5% - 2% மட்டும்\n* வெள்ளம், வறட்சி, நோய் சேதம் காப்பீடு\n\n🚜 **SMAM திட்டம்:**\n* டிராக்டர், ஸ்பிரேயர் கொள்முதலில் 40-50% மானியம்\n\n💳 **கிசான் கிரெடிட் கார்டு (KCC):**\n* ₹3 லட்சம் வரை 4% வட்டியில் கடன்\n\n📞 **விண்ணப்பிக்க:** நேரில் CSC மையம் அல்லது உங்கள் வங்கியை தொடர்பு கொள்ளவும்`,

  rice: `**நெல் நோய் மேலாண்மை:**\n\n🌾 **பொதுவான நோய்கள்:**\n* **பழுப்பு புள்ளி நோய்** (Brown Spot) - பொட்டாஷ் உரம் + ட்ரைசைக்லஸோல் (0.6 கி/லி)\n* **பாக்டீரியா இலை கருகல்** - வயலில் நீரை 2-3 நாள் வெளியேற்றவும்\n* **கதிர் வெடிப்பு நோய்** (Blast) - ட்ரைசைக்லஸோல் (Tricyclazole) ஸ்பிரே\n\n💧 **நீர் மேலாண்மை:**\n* 2-5 செ.மீ. நிலை நீர் தில்லர் மற்றும் கதிர் தொடக்க நிலையில் அவசியம்\n* AWD (Alternate Wetting & Drying) முறை மிகவும் பயனுள்ளது`,

  water: `**நீர்ப்பாசன மேலாண்மை ஆலோசனை:**\n\n💧 **உகந்த நீர்ப்பாசன முறைகள்:**\n* **தொட்டி நீர்ப்பாசனம் (Drip):** மிகவும் சிறந்தது - 40-60% நீர் சேமிப்பு\n* **தெளிப்பு (Sprinkler):** காற்று இல்லாத காலை நேரத்தில் மட்டும்\n* **மேல் நீர்ப்பாசனம் தவிர்க்கவும்** - நோய் பரவும் ஆபத்து அதிகம்\n\n⏰ **நீர்ப்பாசன நேரம்:** காலை 6-9 மணி உகந்தது\n\n🌡️ **மண் ஈரப்பதம் சோதனை:** கட்டை விரலால் மண்ணை அழுத்தி சோதிக்கவும் - ஈரமாக ஒட்டினால் நீர்ப்பாசனம் தேவையில்லை`,

  profit: `**பயிர் லாப கணக்கீடு உதவி:**\n\n📊 **நிகர லாப சூத்திரம்:**\n* லாபம் = வருவாய் - (விதை + உரம் + கூலி + பூச்சிக்கொல்லி + இதர செலவுகள்)\n\n💡 **செலவு குறைக்க:**\n* சேமிக்கப்பட்ட விதை பயன்படுத்தவும் (அதிகரிக்க அல்ல)\n* சேகரிப்பு நுட்பம்: மொத்த விலையில் விற்க மண்டி கூட்டணி சேரவும்\n* **PM-KISAN** ₹6,000 + **KCC** கடன் செலவு குறைக்கும்\n\n📱 **AgriSense Profit Tracker** பயன்படுத்தி செலவை தினமும் பதிவு செய்யவும்`,

  generic: (msg: string) => `உங்கள் கேள்விக்கு நன்றி: "${msg}"\n\n🌱 **AgriSense AI உதவி:**\n\nதெளிவான விடை பெற:\n* **நோய் கண்டறிதல்:** "Detect Disease" பக்கத்தில் இலை புகைப்படம் பதிவேற்றவும்\n* **குரல் மூலம் கேளுங்கள்:** மைக் பொத்தானை அழுத்தி தமிழில் பேசவும்\n* **GPS சிகிச்சை:** உங்கள் இடம் அனுமதித்தால் உள்ளூர் தீர்வு பரிந்துரை செய்கிறோம்\n\n📞 **உடனடி உதவி:** உங்கள் அருகிலுள்ள KVK அல்லது உழவன் அப் (1551) தொடர்பு கொள்ளவும்`
};

export const chatService = {
  async sendMessage(
    message: string,
    language: string = 'en',
    locationEnv?: LocationEnvironment,
    history: Pick<ChatMessage, 'sender' | 'text'>[] = []
  ): Promise<string> {
    const locationCtx = buildLocationContext(locationEnv);

    // Try real backend first
    try {
      const res = await apiRequest<{ reply: string }>('/chat', {
        method: 'POST',
        body: JSON.stringify({ message, language, locationContext: locationCtx, history })
      });
      if (res.data && res.data.reply) {
        return res.data.reply;
      }
    } catch (e) {
      // ignore - use local fallback
    }

    // Detect keywords in message (works in Tamil and English)
    const keywords = detectKeywords(message);
    const q = message.toLowerCase();

    // Tamil language responses with richer content
    if (language === 'ta') {
      if (keywords.has('blight') || keywords.has('tomato') || q.includes('நோய்')) {
        let response = TAMIL_RESPONSES.blight;
        if (locationEnv) {
          response += `\n\n📍 **உங்கள் பகுதி (${locationEnv.state}) சிறப்பு ஆலோசனை:**\n`;
          if (locationEnv.humidity === 'humid') response += '* அதிக ஈரப்பதம் - 5 நாளுக்கு ஒரு முறை ஸ்பிரே செய்யவும்\n';
          if (locationEnv.season.includes('Kharif')) response += `* ${locationEnv.season} பருவம் - வாராந்திர கண்காணிப்பு அவசியம்\n`;
          if ((locationEnv as any).nearestKVK) response += `* **உள்ளூர் உதவி:** ${(locationEnv as any).nearestKVK}`;
        }
        return response;
      }
      if (keywords.has('fungus')) return TAMIL_RESPONSES.fungus;
      if (keywords.has('scheme')) return TAMIL_RESPONSES.scheme;
      if (keywords.has('rice') || keywords.has('paddy')) return TAMIL_RESPONSES.rice;
      if (keywords.has('water')) return TAMIL_RESPONSES.water;
      if (keywords.has('profit')) return TAMIL_RESPONSES.profit;
      return TAMIL_RESPONSES.generic(message);
    }

    // English responses with location enrichment
    if (keywords.has('tomato') || keywords.has('blight')) {
      let base = `**Tomato Health Guidance:**\n* **Early Blight:** Concentric target rings on lower leaves. Apply Copper Oxychloride (2.5g/L), switch to drip irrigation.\n* **Late Blight:** Water-soaked lesions with white mold. Remove affected plants, apply Metalaxyl + Mancozeb (2g/L).\n\n*Organic Alternative:* Trichoderma viride (5g/L) biocontrol spray.\n\n💡 *Pro-tip:* Sanitize pruning shears with 70% alcohol between cuts.`;
      if (locationEnv) {
        base += `\n\n📍 **${locationEnv.state} Region Advice:**\n`;
        if (locationEnv.humidity === 'humid') base += `* High humidity zone → spray every 5 days during ${locationEnv.season}\n`;
        if ((locationEnv as any).nearestKVK) base += `* Local Expert: ${(locationEnv as any).nearestKVK}`;
      }
      return base;
    }

    if (keywords.has('fungus')) {
      return `**Top Disease Prevention Principles:**\n1. **Crop Rotation:** Rotate with non-solanaceous crops on a 3-year cycle.\n2. **Air Circulation:** Maintain 60cm row spacing.\n3. **Soil Mulching:** Apply 2-3 inches of straw mulch.\n4. **Bio-agents:** Spray *Trichoderma viride* preventively to build plant resistance.\n5. **Neem Oil:** 5ml/L + liquid soap (0.5ml/L) every 14 days.`;
    }

    if (keywords.has('scheme')) {
      let response = `**Key Government Schemes Available:**\n* **PM-KISAN:** ₹6,000/year direct bank transfer in 3 installments.\n* **PMFBY:** Crop insurance with premium rates as low as 1.5%-2%.\n* **SMAM:** 40%-50% subsidy for sprayers and farm machinery.\n* **KCC:** Short-term credit limit up to ₹3 Lakh at 4% interest rate.`;
      if (locationEnv) response += `\n\n📍 In **${locationEnv.state}**: Visit your nearest Common Service Center (CSC) or bank branch to apply. ${(locationEnv as any).nearestKVK ? `\nLocal KVK: ${(locationEnv as any).nearestKVK}` : ''}`;
      response += `\n\nVisit the **Govt Schemes** page in the sidebar for complete details!`;
      return response;
    }

    if (keywords.has('rice') || keywords.has('paddy')) {
      return `**Rice/Paddy Disease Management:**\n* **Brown Spot:** Apply Tricyclazole (0.6g/L) at tillering. Top-dress with Potash (MOP).\n* **Bacterial Leaf Blight:** Drain field water 2-3 days. Apply Copper Hydroxide + Streptocycline.\n* **Blast:** Tricyclazole 75% WP (0.6g/L) preventive spray.\n\n💧 **Water Management:** Maintain 2-5cm standing water during tillering and panicle development.`;
    }

    if (keywords.has('profit')) {
      return `**Crop Profit Optimization Tips:**\n* Track all expenses in AgriSense Profit Tracker for accurate P&L.\n* **PM-KISAN** ₹6,000/year + **KCC** low-interest credit = reduced input costs.\n* Join a Farmer Producer Organization (FPO) to get bulk buying discounts (15-20% savings).\n* Sell at APMC mandi after checking e-NAM prices for best rates.`;
    }

    if (keywords.has('water')) {
      return `**Optimal Irrigation Advisory:**\n* **Drip Irrigation:** Best method — saves 40-60% water, keeps foliage dry (prevents disease).\n* **Timing:** Early morning (6-9 AM) is optimal — foliage dries before peak humidity.\n* **Avoid overhead sprinklers** for disease-prone crops like tomato, potato.\n* Check soil moisture by hand: soil should clump but not drip when pressed.`;
    }

    // Generic fallback with GPS context
    let generic = `Thank you for asking about: **"${message}"**\n\nFor optimal crop vitality:\n* **Detect Disease:** Upload a leaf photo for instant AI diagnosis\n* **Voice Input:** Tap the mic icon and ask in Tamil or English\n* **GPS Treatment:** Enable location for region-specific advice\n\n📞 *National Agriculture Helpline:* 1551 (Toll-Free)`;
    if (locationEnv) {
      generic += `\n\n📍 **Your Location:** ${locationEnv.locationLabel} | ${locationEnv.season} | ${locationEnv.humidity} zone`;
    }
    return generic;
  }
};
