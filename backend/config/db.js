const mysql = require('mysql2/promise');
const env = require('./env');

let pool = null;
let isConnected = false;

// Initial demonstration data for offline/fallback mode
const fallbackStore = {
  users: [
    {
      id: 1,
      name: 'Arun Kumar',
      email: 'arun.farmer@agrisense.in',
      phone: '+91 98765 43210',
      password_hash: '$2b$10$wB50zUvR8O9/c8U1m62rX.B0D72aYxHhBqHkW0kM4Xb2JpQ6Z/1bW', // 'Farmer@123'
      location: 'Coimbatore, Tamil Nadu',
      language: 'en',
      main_crop: 'Tomato',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      created_at: new Date(Date.now() - 15 * 86400000).toISOString()
    }
  ],
  scans: [
    {
      id: 1,
      user_id: 1,
      image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80',
      crop: 'Tomato',
      disease: 'Early Blight',
      confidence: 94.5,
      severity: 'Moderate',
      symptoms: ['Dark brown concentric spots on lower leaves', 'Yellow halo surrounding target-like lesions', 'Lower leaf withering and dropping prematurely'],
      causes: ['Fungus Alternaria solani', 'High humidity (>80%) combined with warm temperatures (24-29°C)', 'Poor air circulation in dense canopy'],
      notes: 'Observed after continuous seasonal monsoon showers on block B plot.',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 2,
      user_id: 1,
      image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      crop: 'Rice',
      disease: 'Healthy',
      confidence: 98.2,
      severity: 'Healthy',
      symptoms: ['Vibrant emerald green leaves', 'Consistent upright stem turgidity', 'No noticeable lesions, discoloration, or rust spots'],
      causes: ['Optimal soil nutrient balance', 'Adequate water management', 'Proper preventive organic spray schedule'],
      notes: 'Inspection of paddy field stage 2 tillering; excellent vegetative growth.',
      created_at: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 3,
      user_id: 1,
      image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
      crop: 'Potato',
      disease: 'Late Blight',
      confidence: 91.8,
      severity: 'Severe',
      symptoms: ['Water-soaked irregularly shaped black lesions', 'White fuzzy fungal growth under damp morning conditions', 'Rapid collapse and browning of foliage'],
      causes: ['Oomycete Phytophthora infestans', 'Cool wet weather with prolonged leaf wetness', 'Infected seed tubers or volunteer crops'],
      notes: 'Immediate containment required to protect adjoining plots.',
      created_at: new Date(Date.now() - 6 * 86400000).toISOString()
    },
    {
      id: 4,
      user_id: 1,
      image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
      crop: 'Apple',
      disease: 'Apple Scab',
      confidence: 89.4,
      severity: 'Moderate',
      symptoms: ['Olive-green to velvety brown spots on upper leaf surface', 'Distorted fruit skin and dark corky lesions', 'Yellowing leaves prone to early leaf drop'],
      causes: ['Fungus Venturia inaequalis', 'Spring rain cycles keeping foliage continuously damp', 'Overwintered fungal spores on orchard floor debris'],
      notes: 'Upper canopy showing isolated spot clusters.',
      created_at: new Date(Date.now() - 10 * 86400000).toISOString()
    }
  ],
  treatments: [
    {
      id: 1,
      scan_id: 1,
      user_id: 1,
      immediate_action: 'Prune and safely destroy lower infected leaves with clean shears. Avoid working during wet foliage hours.',
      treatment_plan: [
        'Apply copper-based or approved bio-fungicide (Trichoderma viride spray) in the cool morning hours.',
        'Ensure gentle drip irrigation at soil level rather than overhead sprinkler splashing.',
        'Mulch the base of tomato plants with clean straw to prevent spore splashing from soil.'
      ],
      prevention: [
        'Practice a 3-year crop rotation away from solanaceous plants (potatoes, eggplants).',
        'Maintain 60cm row spacing to facilitate vigorous air movement.',
        'Use certified disease-resistant hybrid seed varieties.'
      ],
      monitoring: 'Inspect lower leaves every 3 days. Re-scan leaves on AgriSense after 5 days to verify containment.',
      expert_warning: 'For severe crop damage, consult a qualified agricultural expert.',
      saved_at: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 2,
      scan_id: 3,
      user_id: 1,
      immediate_action: 'Urgently isolate and remove heavily collapsed potato foliage. Do not compost infected leaves; burn or deeply bury.',
      treatment_plan: [
        'Apply protective systemic fungicide formulated specifically for Phytophthora infestans under expert direction.',
        'Halt overhead sprinkler watering immediately.',
        'Ensure trench drainage is completely free of stagnant standing water.'
      ],
      prevention: [
        'Plant certified certified disease-free seed tubers.',
        'Ensure tall hilling around potato beds to shield subterranean tubers from wash-in spores.',
        'Destroy any cull piles or volunteer potato seedlings near field borders.'
      ],
      monitoring: 'Conduct daily morning field walks to inspect underside of leaves for white fungal mildew.',
      expert_warning: 'For severe crop damage, consult a qualified agricultural expert.',
      saved_at: new Date(Date.now() - 6 * 86400000).toISOString()
    }
  ],
  expenses: [
    {
      id: 1,
      user_id: 1,
      crop: 'Tomato',
      land_area: 2.5,
      seed_cost: 8500,
      fertilizer_cost: 14200,
      labor_cost: 22000,
      pesticide_cost: 7800,
      other_cost: 4500,
      total_cost: 57000,
      revenue: 98500,
      profit: 41500,
      season: 'Kharif 2025',
      notes: 'Yield was high following early intervention for blight.',
      created_at: new Date(Date.now() - 20 * 86400000).toISOString()
    },
    {
      id: 2,
      user_id: 1,
      crop: 'Rice (Paddy)',
      land_area: 4.0,
      seed_cost: 12000,
      fertilizer_cost: 19500,
      labor_cost: 31000,
      pesticide_cost: 6200,
      other_cost: 6800,
      total_cost: 75500,
      revenue: 145000,
      profit: 69500,
      season: 'Rabi 2025',
      notes: 'Clean harvest with zero major disease loss.',
      created_at: new Date(Date.now() - 40 * 86400000).toISOString()
    },
    {
      id: 3,
      user_id: 1,
      crop: 'Potato',
      land_area: 1.5,
      seed_cost: 18000,
      fertilizer_cost: 11000,
      labor_cost: 16500,
      pesticide_cost: 9200,
      other_cost: 3500,
      total_cost: 58200,
      revenue: 72000,
      profit: 13800,
      season: 'Zaid 2026',
      notes: 'Late blight required targeted fungicide application.',
      created_at: new Date(Date.now() - 60 * 86400000).toISOString()
    }
  ],
  schemes: [
    {
      id: 1,
      name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      code: 'PMKISAN',
      description: 'Central sector scheme providing income support to all landholding farmers families across India to supplement their agricultural financial needs.',
      eligibility: 'Small and marginal farmer families with cultivable landholding in their names. Institutional landholders and high-income tax payers are excluded.',
      benefits: 'Direct financial benefit of ₹6,000 per year transferred into bank accounts in three equal 4-monthly installments of ₹2,000 each.',
      category: 'Central Government',
      official_url: 'https://pmkisan.gov.in',
      application_process: 'Apply online via PM-KISAN web portal or through local Common Service Centre (CSC) with Aadhaar card, land ownership documents, and bank passbook.'
    },
    {
      id: 2,
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      code: 'PMFBY',
      description: 'Comprehensive crop insurance scheme providing insurance coverage and financial support to farmers in the event of failure of any of the notified crops as a result of natural calamities, pests & diseases.',
      eligibility: 'All farmers growing notified crops in notified areas including sharecroppers and tenant farmers are eligible.',
      benefits: 'Uniform maximum premium of only 2% for Kharif crops, 1.5% for Rabi crops, and 5% for annual commercial/horticultural crops. Balance premium paid by Government.',
      category: 'Insurance',
      official_url: 'https://pmfby.gov.in',
      application_process: 'Enroll through bank branch where crop loan is sanctioned, CSC centers, or directly via National Crop Insurance Portal within the notified cutoff date.'
    },
    {
      id: 3,
      name: 'Agriculture Infrastructure Fund (AIF)',
      code: 'AIF',
      description: 'Medium - long term debt financing facility for investment in viable projects for post-harvest management infrastructure and community farming assets.',
      eligibility: 'Primary Agricultural Credit Societies (PACS), Marketing Cooperative Societies, FPOs, SHGs, Farmers, Joint Liability Groups, and Agri-entrepreneurs.',
      benefits: 'Interest subvention of 3% per annum up to a loan limit of ₹2 Crore for a maximum period of 7 years, along with CGTMSE credit guarantee coverage.',
      category: 'Loans',
      official_url: 'https://agriinfra.dac.gov.in',
      application_process: 'Register and submit DPR (Detailed Project Report) on the Agri Infra Portal. Loan sanctioning done by designated participating banks.'
    },
    {
      id: 4,
      name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
      code: 'SMAM',
      description: 'Promotes the use of modern agricultural machinery and equipment among small and marginal farmers to improve productivity and timeliness of operations.',
      eligibility: 'Individual farmers, SHGs, User Groups, Cooperative Societies, and Farmer Producer Organizations.',
      benefits: 'Subsidy ranging from 40% to 50% for purchase of tractors, rotavators, power tillers, sprayers, and establishment of Custom Hiring Centres (CHC).',
      category: 'Subsidy',
      official_url: 'https://agrimachinery.nic.in',
      application_process: 'Submit online application on the Agrimachinery portal selecting the desired implement, dealer, and upload Aadhaar, Land Record, and bank details.'
    },
    {
      id: 5,
      name: 'Kisan Credit Card (KCC) Scheme',
      code: 'KCC',
      description: 'Aims at providing adequate and timely credit support from the banking system under a single window with flexible and simplified procedure to farmers for their cultivation and other needs.',
      eligibility: 'All farmers, individuals or joint borrowers, tenant farmers, oral lessees, and sharecroppers.',
      benefits: 'Short-term credit limit up to ₹3 Lakh at an effective interest rate of 4% per annum upon prompt repayment. Built-in crop and personal insurance coverage.',
      category: 'Loans',
      official_url: 'https://www.myscheme.gov.in/schemes/kcc',
      application_process: 'Obtain one-page KCC application form from local commercial bank, RRB, or Cooperative Bank, attach Aadhaar, photo, and land revenue receipt.'
    },
    {
      id: 6,
      name: 'Soil Health Card Scheme',
      code: 'SHC',
      description: 'Provides soil health cards to all farmers detailing nutrient status (N, P, K, micro-nutrients) and customized fertilizer recommendations to optimize input costs.',
      eligibility: 'All farmers possessing agricultural land across all states in India.',
      benefits: 'Free soil sample testing with a personalized 3-year Soil Health Card recommending precise chemical and organic dosages for maximum yield.',
      category: 'Central Government',
      official_url: 'https://soilhealth.dac.gov.in',
      application_process: 'Local agriculture department collects representative soil samples from farm plots. Card delivered at Village Panchayat or accessible on web portal.'
    }
  ],
  notifications: [
    {
      id: 1,
      user_id: 1,
      title: 'Disease Analysis Complete',
      message: 'Your Tomato crop scan on Plot B shows Early Blight with 94% confidence. View treatment suggestions now.',
      type: 'scan',
      link: '/results/1',
      is_read: false,
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 2,
      user_id: 1,
      title: 'Treatment Plan Saved',
      message: 'Action plan for Tomato Early Blight has been securely saved to your treatment records.',
      type: 'treatment',
      link: '/history',
      is_read: false,
      created_at: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 3,
      user_id: 1,
      title: 'New Subsidy Scheme Available',
      message: 'SMAM Sub-Mission on Agricultural Mechanization opened applications with up to 50% subsidy on sprayers.',
      type: 'scheme',
      link: '/schemes',
      is_read: true,
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ]
};

async function initDb() {
  try {
    pool = mysql.createPool(env.DB);
    // Test connection with a quick query
    const connection = await pool.getConnection();
    connection.release();
    isConnected = true;
    console.log(`[Database] Connected successfully to MySQL database "${env.DB.database}" at ${env.DB.host}:${env.DB.port}`);
  } catch (err) {
    isConnected = false;
    console.warn(`[Database] MySQL not reachable (${err.message}). Activating built-in resilient in-memory database.`);
    console.warn(`[Database] Preloaded demonstration data for farmer Arun Kumar is active.`);
  }
}

// Initialise DB connection asynchronously
initDb();

module.exports = {
  getPool: () => pool,
  isDbConnected: () => isConnected,
  fallbackStore
};
