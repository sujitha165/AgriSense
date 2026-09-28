export interface CropDiseaseInfo {
  crop: string;
  disease: string;
  pathogen: string;
  defaultConfidence: number;
  severity: 'Healthy' | 'Low' | 'Moderate' | 'Severe';
  sampleImage: string;
  symptoms: string[];
  causes: string[];
  treatment: string[];
  prevention: string[];
  monitoring: string;
  expert_warning: string;
}

export const CROPS_LIST = [
  'Auto Detect',
  'Tomato',
  'Potato',
  'Rice',
  'Apple',
  'Cotton',
  'Maize',
  'Pepper',
  'Grape'
];

export const MOCK_DISEASE_CATALOG: Record<string, CropDiseaseInfo[]> = {
  tomato: [
    {
      crop: 'Tomato',
      disease: 'Early Blight',
      pathogen: 'Alternaria solani',
      defaultConfidence: 94.5,
      severity: 'Moderate',
      sampleImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80',
      symptoms: [
        'Dark brown concentric "target-board" rings on lower leaves',
        'Yellow chlorotic halo surrounding lesions',
        'Lower leaf withering and premature defoliation',
        'Dark sunken lesions on stems near soil line'
      ],
      causes: [
        'Fungal pathogen Alternaria solani',
        'High ambient humidity (>80%) combined with temperatures between 24-29°C',
        'Rain splashing transferring spores from infected soil debris',
        'Dense planting limiting canopy ventilation'
      ],
      treatment: [
        'Prune and safely destroy lower infected leaves with sanitized shears.',
        'Apply bio-fungicide (Trichoderma viride or Bacillus subtilis spray).',
        'Spray Copper Oxychloride (2.5g/L) during early morning hours.',
        'Switch completely to soil-level drip irrigation; stop overhead sprinklers.',
        'Mulch plant bases with 2-3 inches of clean organic straw to prevent soil splash.'
      ],
      prevention: [
        'Practice a 3-year crop rotation avoiding solanaceous crops (tomatoes, potatoes, brinjals).',
        'Maintain 60cm row spacing for optimal airflow and sunlight.',
        'Use certified disease-resistant varieties (e.g. Arka Rakshak).',
        'Disinfect all stakes, cages, and tools between seasons.'
      ],
      monitoring: 'Inspect lower leaves every 3 days. Re-scan on AgriSense after 5 days to ensure containment.',
      expert_warning: 'For severe stem girdling or fruit rot, consult your local Krishi Vigyan Kendra (KVK) officer.'
    },
    {
      crop: 'Tomato',
      disease: 'Late Blight',
      pathogen: 'Phytophthora infestans',
      defaultConfidence: 92.0,
      severity: 'Severe',
      sampleImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80',
      symptoms: [
        'Large, irregular water-soaked dark olive lesions',
        'Delicate white fuzzy fungal down on leaf undersides in morning dampness',
        'Rapid collapse and browning of entire foliage branches',
        'Firm, dark greasy brown rot on developing fruits'
      ],
      causes: [
        'Water mold pathogen Phytophthora infestans',
        'Cool, wet weather with sustained high relative humidity (>90%)',
        'Windborne spores travelling from nearby infected crops'
      ],
      treatment: [
        'Urgently bag and remove heavily collapsed plants to halt airborne spore showers.',
        'Never compost late-blight debris; deeply bury or safely burn.',
        'Apply systemic protective fungicide (Metalaxyl + Mancozeb @ 2g/L) under agricultural advice.',
        'Ensure proper furrow drainage so field does not hold standing water.'
      ],
      prevention: [
        'Source certified disease-free transplants.',
        'Avoid planting adjacent to potato fields.',
        'Grow on raised beds with mulched drip lines.'
      ],
      monitoring: 'Walk rows daily during cloudy or rainy weather.',
      expert_warning: 'Late Blight can destroy entire fields within a week if not halted promptly.'
    },
    {
      crop: 'Tomato',
      disease: 'Healthy',
      pathogen: 'None',
      defaultConfidence: 98.4,
      severity: 'Healthy',
      sampleImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80',
      symptoms: [
        'Lush emerald green leaf coloration',
        'Erect, firm stem turgor and balanced vegetative growth',
        'Absence of spots, lesions, or chlorotic margins'
      ],
      causes: [
        'Optimum soil nutrient balance and micro-flora',
        'Well-regulated moisture and adequate sunlight hours',
        'Regular proactive scouting'
      ],
      treatment: [
        'Maintain current watering schedule (early mornings).',
        'Apply well-rotted vermicompost or organic neem cake as top dressing.',
        'Avoid wetting foliage during irrigation.'
      ],
      prevention: [
        'Apply preventive neem oil foliar spray (5ml/L) every 14 days.',
        'Keep surrounding borders free of weeds.'
      ],
      monitoring: 'Perform regular weekly scans to detect any pathogen arrival early.',
      expert_warning: 'Crop is in prime condition. No chemical intervention needed.'
    }
  ],

  potato: [
    {
      crop: 'Potato',
      disease: 'Early Blight',
      pathogen: 'Alternaria solani',
      defaultConfidence: 91.0,
      severity: 'Moderate',
      sampleImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
      symptoms: [
        'Brown, angular target-patterned spots on older lower leaves',
        'Yellow chlorotic halos expanding outward',
        'Premature defoliation reducing tuber size'
      ],
      causes: ['Alternaria solani fungus', 'Alternating wet and dry cycles', 'Heavy tuber bulking stress'],
      treatment: [
        'Remove severely spotted foliage.',
        'Apply protective Mancozeb or Chlorothalonil fungicide as directed.',
        'Maintain balanced nitrogen fertilization.'
      ],
      prevention: ['Use certified seed tubers', 'Maintain wide row spacing', 'Strict crop rotation.'],
      monitoring: 'Check bottom foliage weekly.',
      expert_warning: 'Follow recommended safety waiting periods between spray and tuber harvest.'
    },
    {
      crop: 'Potato',
      disease: 'Late Blight',
      pathogen: 'Phytophthora infestans',
      defaultConfidence: 93.8,
      severity: 'Severe',
      sampleImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
      symptoms: [
        'Water-soaked dark lesions with pale green borders',
        'White fungal bloom on leaf undersides in high humidity',
        'Brown dry rot developing in tubers beneath soil surface'
      ],
      causes: ['Phytophthora infestans', 'Cool humid microclimate', 'Infected volunteer potatoes from last season'],
      treatment: [
        'Spray Cymoxanil + Mancozeb immediately upon first symptom.',
        'Cut haulms (vines) 10 days before harvest if late blight is active to protect tubers.',
        'Stop overhead irrigation.'
      ],
      prevention: ['Hill soil high over tubers', 'Plant certified resistant varieties like Kufri Girdhari.'],
      monitoring: 'Daily field walk if cool foggy conditions persist.',
      expert_warning: 'Late Blight spreads rapidly across entire regions. Prompt reporting to agriculture department recommended.'
    },
    {
      crop: 'Potato',
      disease: 'Healthy',
      pathogen: 'None',
      defaultConfidence: 97.9,
      severity: 'Healthy',
      sampleImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
      symptoms: ['Deep green canopy', 'Robust stolon and tuber development', 'Clean stems without blights'],
      causes: ['Good field drainage, certified seed, optimum nutrient supply'],
      treatment: ['Keep soil hilled around stem bases', 'Maintain steady moisture levels.'],
      prevention: ['Routine preventive biocontrol sprays', 'Sanitize machinery between fields.'],
      monitoring: 'Weekly routine checks.',
      expert_warning: 'Crop is thriving.'
    }
  ],

  rice: [
    {
      crop: 'Rice',
      disease: 'Brown Spot',
      pathogen: 'Bipolaris oryzae',
      defaultConfidence: 92.5,
      severity: 'Moderate',
      sampleImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      symptoms: [
        'Oval or circular sesame-seed shaped brown spots with gray centers',
        'Yellow halos surrounding spots on leaf blades and sheaths',
        'Grain discoloration and unfilled grains'
      ],
      causes: ['Bipolaris oryzae', 'Soil potassium and silicon deficiency', 'Moisture stress followed by showers'],
      treatment: [
        'Top-dress with Muriate of Potash (MOP) to enhance plant silica uptake.',
        'Spray Tricyclazole (0.6g/L) or Propiconazole (1ml/L) at tillering.',
        'Seed treatment with Carbendazim (2g/kg seed) for future batches.'
      ],
      prevention: ['Balanced NPK fertilization (avoid excess urea)', 'Maintain proper water ponding in paddy.'],
      monitoring: 'Inspect top 3 leaves at maximum tillering stage every 5 days.',
      expert_warning: 'Ensure adequate potash supply to strengthen cell walls against fungal penetration.'
    },
    {
      crop: 'Rice',
      disease: 'Bacterial Leaf Blight',
      pathogen: 'Xanthomonas oryzae',
      defaultConfidence: 95.0,
      severity: 'Severe',
      sampleImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      symptoms: [
        'Water-soaked to yellowish-white wavy stripes starting from leaf margins',
        'Milky bacterial ooze droplets on young lesions during early morning',
        'Straw-colored withering and rolling of leaves ("Kresek" stage)'
      ],
      causes: ['Xanthomonas oryzae', 'Warm humid weather (25-34°C) with rainstorms', 'Excessive chemical nitrogen application'],
      treatment: [
        'Drain field water for 2-3 days to aerate roots.',
        'Halt chemical nitrogen top-dressing until disease halts.',
        'Spray Copper Hydroxide (2g/L) with Streptocycline (0.1g/L) under expert direction.'
      ],
      prevention: ['Use resistant varieties (e.g., IR64, Improved Samba Mahsuri)', 'Avoid clipping seedling tips before transplanting.'],
      monitoring: 'Inspect fields every 2 days during overcast wet weather.',
      expert_warning: 'Bacterial blight spreads through moving irrigation water. Avoid draining into adjoining plots.'
    },
    {
      crop: 'Rice',
      disease: 'Healthy',
      pathogen: 'None',
      defaultConfidence: 98.6,
      severity: 'Healthy',
      sampleImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      symptoms: ['Uniform emerald green canopy', 'Clean leaf sheaths without spots', 'Strong tillering activity'],
      causes: ['Balanced fertility management', 'Adequate water ponding and organic enrichment'],
      treatment: ['Maintain 2-5cm standing water during critical tillering and panicle development.'],
      prevention: ['Alternate wetting and drying (AWD) water management to aerate roots.'],
      monitoring: 'Regular scouting during panicle initiation.',
      expert_warning: 'Crop is in prime condition.'
    }
  ],

  apple: [
    {
      crop: 'Apple',
      disease: 'Apple Scab',
      pathogen: 'Venturia inaequalis',
      defaultConfidence: 93.2,
      severity: 'Moderate',
      sampleImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
      symptoms: [
        'Dull olive-green velvety spots on upper leaf surfaces',
        'Dark, corky scabs developing on fruit skin',
        'Curled leaves that drop prematurely'
      ],
      causes: ['Venturia inaequalis fungus', 'Spring rains keeping leaves wet for over 9 hours'],
      treatment: [
        'Prune dense canopy branches in winter for light and air penetration.',
        'Apply registered protective fungicide (Captan or Difenoconazole) at petal fall.',
        'Collect and shred fallen autumn leaves to eliminate overwintering spores.'
      ],
      prevention: ['Plant scab-resistant cultivars', 'Apply 5% urea spray on leaf litter post-harvest.'],
      monitoring: 'Scout spur leaves weekly during early spring foliage flush.',
      expert_warning: 'Protect fruit early; once fruit scab forms, cosmetic quality cannot be reversed.'
    },
    {
      crop: 'Apple',
      disease: 'Black Rot',
      pathogen: 'Botryosphaeria obtusa',
      defaultConfidence: 90.5,
      severity: 'Severe',
      sampleImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
      symptoms: [
        '"Frog-eye" leaf spots with purple margins and tan centers',
        'Dark sunken cankers on tree limbs with cracked bark',
        'Firm brown fruit rot with concentric rings, mummifying on branch'
      ],
      causes: ['Botryosphaeria obtusa fungus', 'Wounds from pruning or hail', 'Dead wood and mummified fruit left on trees'],
      treatment: [
        'Prune out cankered limbs at least 15cm below visible damage with sterile shears.',
        'Remove and burn all mummified apples remaining on branches.',
        'Apply copper spray before bud break.'
      ],
      prevention: ['Keep trees vigorous with balanced fertilization', 'Avoid pruning in wet weather.'],
      monitoring: 'Inspect trunk and main scaffold branches for sunken bark lesions.',
      expert_warning: 'Extensive trunk cankers may threaten the entire tree structure.'
    },
    {
      crop: 'Apple',
      disease: 'Healthy',
      pathogen: 'None',
      defaultConfidence: 99.1,
      severity: 'Healthy',
      sampleImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
      symptoms: ['Glossy deep green leaves', 'Clean fruit skin free of blemishes', 'Firm smooth branch bark'],
      causes: ['Optimal orchard pruning, adequate chill hours, timely protective sprays'],
      treatment: ['Continue standard orchard nutritional maintenance and balanced irrigation.'],
      prevention: ['Dormant horticultural oil spray to keep mites and overwintering pests low.'],
      monitoring: 'Bi-weekly orchard walks.',
      expert_warning: 'Excellent orchard health.'
    }
  ],

  cotton: [
    {
      crop: 'Cotton',
      disease: 'Bacterial Blight',
      pathogen: 'Xanthomonas citri pv. malvacearum',
      defaultConfidence: 91.5,
      severity: 'Severe',
      sampleImage: 'https://images.unsplash.com/photo-1594488518063-2391696515e0?auto=format&fit=crop&w=800&q=80',
      symptoms: [
        'Angular water-soaked spots bounded by leaf veins',
        'Black arm lesions girdling the stems and branches',
        'Boll rot with sunken dark brown greasy spots'
      ],
      causes: ['Xanthomonas pathogen', 'Warm humid weather (30-35°C) with driving winds'],
      treatment: [
        'Spray Copper Oxychloride (2.5g/L) mixed with Streptocycline (100mg/L).',
        'Remove and destroy infected plant debris.'
      ],
      prevention: ['Delint seed with concentrated sulfuric acid before sowing', 'Plant certified resistant Bt varieties.'],
      monitoring: 'Check underside of leaves for angular water soaking after wind-driven rains.',
      expert_warning: 'Black arm lesions can cause breakage of main fruiting branches.'
    },
    {
      crop: 'Cotton',
      disease: 'Healthy',
      pathogen: 'None',
      defaultConfidence: 97.4,
      severity: 'Healthy',
      sampleImage: 'https://images.unsplash.com/photo-1594488518063-2391696515e0?auto=format&fit=crop&w=800&q=80',
      symptoms: ['Deep green broad leaves', 'Robust square and boll formation', 'Strong sturdy main stem'],
      causes: ['Adequate micronutrient spray (boron/zinc), proper pest control'],
      treatment: ['Maintain soil moisture during square and boll development.'],
      prevention: ['Pheromone traps to monitor bollworms.'],
      monitoring: 'Weekly crop inspection.',
      expert_warning: 'Crop is healthy.'
    }
  ],

  maize: [
    {
      crop: 'Maize',
      disease: 'Common Rust',
      pathogen: 'Puccinia sorghi',
      defaultConfidence: 93.0,
      severity: 'Moderate',
      sampleImage: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
      symptoms: [
        'Small powdery golden-brown to cinnamon pustules scattered on both leaf surfaces',
        'Pustules rupture epidermal tissue releasing powdery spores',
        'Severe cases cause leaf chlorosis and premature drying'
      ],
      causes: ['Puccinia sorghi fungus', 'Cool temperatures (16-25°C) with high relative humidity'],
      treatment: [
        'Apply foliar fungicide (Azoxystrobin or Mancozeb) if rust appears prior to silking.',
        'Ensure proper plant spacing for sunlight penetration.'
      ],
      prevention: ['Plant rust-resistant maize hybrids', 'Early planting to avoid peak rust spore season.'],
      monitoring: 'Inspect lower and mid-canopy leaves before tasseling.',
      expert_warning: 'Infections after grain filling usually do not require chemical intervention.'
    },
    {
      crop: 'Maize',
      disease: 'Healthy',
      pathogen: 'None',
      defaultConfidence: 98.0,
      severity: 'Healthy',
      sampleImage: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
      symptoms: ['Broad emerald green leaves', 'Strong stalk girth', 'Uniform tassel and silk emergence'],
      causes: ['Optimum soil organic matter and timely nitrogen top dressing'],
      treatment: ['Provide adequate irrigation at critical tasseling and silking stages.'],
      prevention: ['Maintain balanced soil fertility.'],
      monitoring: 'Routine checks.',
      expert_warning: 'Excellent crop vigor.'
    }
  ]
};
