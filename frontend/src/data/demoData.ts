import { User, ScanRecord, ExpenseRecord, AppNotification } from '../types';

export const DEMO_USER: User = {
  id: 1,
  name: 'Arun Kumar',
  email: 'arun.farmer@agrisense.in',
  phone: '+91 98765 43210',
  location: 'Coimbatore, Tamil Nadu',
  language: 'en',
  main_crop: 'Tomato',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
  created_at: '2025-08-15T09:00:00Z'
};

export const INITIAL_DEMO_SCANS: ScanRecord[] = [
  {
    id: 1,
    user_id: 1,
    image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80',
    crop: 'Tomato',
    disease: 'Early Blight',
    confidence: 94.5,
    severity: 'Moderate',
    pathogen: 'Alternaria solani',
    symptoms: [
      'Dark brown concentric rings on mature lower leaves',
      'Yellow chlorotic halos surrounding target lesions',
      'Lower leaf withering and premature defoliation'
    ],
    causes: [
      'Fungal pathogen Alternaria solani',
      'High humidity (>80%) combined with warm temperatures (24-29°C)',
      'Rain splash transferring spores from infected soil'
    ],
    treatment: [
      'Prune and destroy infected lower leaves with clean shears.',
      'Apply bio-fungicide (Trichoderma viride spray) in early morning hours.',
      'Switch strictly to ground-level drip irrigation; avoid overhead watering.',
      'Mulch the base of tomato plants with clean organic straw.'
    ],
    prevention: [
      'Practice a 3-year crop rotation avoiding solanaceous crops.',
      'Maintain 60cm row spacing for vigorous air circulation.',
      'Use certified disease-resistant hybrid seed varieties.'
    ],
    monitoring: 'Inspect lower leaves every 3 days. Re-scan on AgriSense after 5 days to verify containment.',
    expert_warning: 'For severe crop damage, consult your local agricultural extension officer.',
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
    pathogen: 'None',
    symptoms: [
      'Vibrant emerald green leaves',
      'Consistent upright stem turgidity',
      'No noticeable lesions or discoloration'
    ],
    causes: [
      'Optimal soil nutrient balance',
      'Adequate water management and ponding depth',
      'Proper preventive organic schedule'
    ],
    treatment: [
      'Maintain 2-5cm standing water during critical tillering.',
      'Continue standard organic nutrient top-dressing.'
    ],
    prevention: [
      'Alternate wetting and drying (AWD) water management to aerate roots.',
      'Keep bunds weed-free.'
    ],
    monitoring: 'Perform routine weekly scans during panicle initiation.',
    expert_warning: 'Crop is in prime condition. No chemical intervention needed.',
    notes: 'Inspection of paddy field stage 2 tillering; excellent vegetative vigor.',
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
    pathogen: 'Phytophthora infestans',
    symptoms: [
      'Water-soaked irregularly shaped black lesions',
      'White fuzzy fungal growth under damp morning conditions',
      'Rapid collapse and browning of foliage'
    ],
    causes: [
      'Oomycete Phytophthora infestans',
      'Cool wet weather with prolonged leaf wetness',
      'Infected seed tubers or volunteer crops'
    ],
    treatment: [
      'Urgently isolate and remove heavily collapsed potato foliage. Do not compost.',
      'Apply protective systemic fungicide formulated for Phytophthora infestans.',
      'Halt overhead sprinkler watering immediately.'
    ],
    prevention: [
      'Plant certified certified disease-free seed tubers.',
      'Ensure tall hilling around potato beds to shield subterranean tubers.',
      'Destroy volunteer potato seedlings near field borders.'
    ],
    monitoring: 'Conduct daily morning field walks to inspect underside of leaves for white fungal mildew.',
    expert_warning: 'For severe crop damage, consult a qualified agricultural expert.',
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
    pathogen: 'Venturia inaequalis',
    symptoms: [
      'Olive-green to velvety brown spots on upper leaf surface',
      'Distorted fruit skin and dark corky lesions',
      'Yellowing leaves prone to early leaf drop'
    ],
    causes: [
      'Fungus Venturia inaequalis',
      'Spring rain cycles keeping foliage continuously damp',
      'Overwintered fungal spores on orchard floor debris'
    ],
    treatment: [
      'Prune dense branches in winter to allow light and wind penetration.',
      'Apply registered protective fungicide (Captan or Difenoconazole) at petal fall.',
      'Collect and shred fallen autumn leaves.'
    ],
    prevention: [
      'Plant scab-resistant cultivars.',
      'Apply 5% urea spray on leaf litter post-harvest to accelerate breakdown.'
    ],
    monitoring: 'Scout spur leaves weekly during early spring foliage flush.',
    expert_warning: 'Protect fruit early; once fruit scab forms, cosmetic quality cannot be reversed.',
    notes: 'Upper canopy showing isolated spot clusters.',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  }
];

export const INITIAL_DEMO_EXPENSES: ExpenseRecord[] = [
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
    created_at: '2025-10-15T10:00:00Z'
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
    created_at: '2025-11-20T11:00:00Z'
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
    created_at: '2026-02-10T12:00:00Z'
  }
];

export const INITIAL_DEMO_NOTIFICATIONS: AppNotification[] = [
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
];
