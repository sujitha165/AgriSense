-- AgriSense Seed Data
-- Initial realistic data for demonstration and testing

USE agrisense_db;

-- 1. Demo User: Arun Kumar (Password: "Farmer@123" hashed or demo)
-- bcrypt hash for 'Farmer@123': $2b$10$wB50zUvR8O9/c8U1m62rX.B0D72aYxHhBqHkW0kM4Xb2JpQ6Z/1bW
INSERT INTO users (id, name, email, phone, password_hash, location, language, main_crop, avatar_url)
VALUES (
    1,
    'Arun Kumar',
    'arun.farmer@agrisense.in',
    '+91 98765 43210',
    '$2b$10$wB50zUvR8O9/c8U1m62rX.B0D72aYxHhBqHkW0kM4Xb2JpQ6Z/1bW',
    'Coimbatore, Tamil Nadu',
    'en',
    'Tomato',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80'
) ON DUPLICATE KEY UPDATE id=id;

-- 2. Demo Crop Scans
INSERT INTO crop_scans (id, user_id, image_url, crop, disease, confidence, severity, symptoms, causes, notes, created_at)
VALUES 
(
    1,
    1,
    'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80',
    'Tomato',
    'Early Blight',
    94.50,
    'Moderate',
    JSON_ARRAY('Dark brown concentric spots on lower leaves', 'Yellow halo surrounding target-like lesions', 'Lower leaf withering and dropping prematurely'),
    JSON_ARRAY('Fungus Alternaria solani', 'High humidity (>80%) combined with warm temperatures (24-29°C)', 'Poor air circulation in dense canopy'),
    'Observed after continuous seasonal monsoon showers on block B plot.',
    NOW() - INTERVAL 2 DAY
),
(
    2,
    1,
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    'Rice',
    'Healthy',
    98.20,
    'Healthy',
    JSON_ARRAY('Vibrant emerald green leaves', 'Consistent upright stem turgidity', 'No noticeable lesions, discoloration, or rust spots'),
    JSON_ARRAY('Optimal soil nutrient balance', 'Adequate water management', 'Proper preventive organic spray schedule'),
    'Inspection of paddy field stage 2 tillering; excellent vegetative growth.',
    NOW() - INTERVAL 4 DAY
),
(
    3,
    1,
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    'Potato',
    'Late Blight',
    91.80,
    'Severe',
    JSON_ARRAY('Water-soaked irregularly shaped black lesions', 'White fuzzy fungal growth under damp morning conditions', 'Rapid collapse and browning of foliage'),
    JSON_ARRAY('Oomycete Phytophthora infestans', 'Cool wet weather with prolonged leaf wetness', 'Infected seed tubers or volunteer crops'),
    'Immediate containment required to protect adjoining plots.',
    NOW() - INTERVAL 6 DAY
),
(
    4,
    1,
    'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    'Apple',
    'Apple Scab',
    89.40,
    'Moderate',
    JSON_ARRAY('Olive-green to velvety brown spots on upper leaf surface', 'Distorted fruit skin and dark corky lesions', 'Yellowing leaves prone to early leaf drop'),
    JSON_ARRAY('Fungus Venturia inaequalis', 'Spring rain cycles keeping foliage continuously damp', 'Overwintered fungal spores on orchard floor debris'),
    'Upper canopy showing isolated spot clusters.',
    NOW() - INTERVAL 10 DAY
) ON DUPLICATE KEY UPDATE id=id;

-- 3. Demo Treatment Plans
INSERT INTO treatments (id, scan_id, user_id, immediate_action, treatment_plan, prevention, monitoring, saved_at)
VALUES 
(
    1,
    1,
    1,
    'Prune and safely destroy lower infected leaves with clean shears. Avoid working during wet foliage hours.',
    JSON_ARRAY(
        'Apply copper-based or approved bio-fungicide (Trichoderma viride spray) in the cool morning hours.',
        'Ensure gentle drip irrigation at soil level rather than overhead sprinkler splashing.',
        'Mulch the base of tomato plants with clean straw to prevent spore splashing from soil.'
    ),
    JSON_ARRAY(
        'Practice a 3-year crop rotation away from solanaceous plants (potatoes, eggplants).',
        'Maintain 60cm row spacing to facilitate vigorous air movement.',
        'Use certified disease-resistant hybrid seed varieties.'
    ),
    'Inspect lower leaves every 3 days. Re-scan leaves on AgriSense after 5 days to verify containment.',
    NOW() - INTERVAL 2 DAY
),
(
    2,
    3,
    1,
    'Urgently isolate and remove heavily collapsed potato foliage. Do not compost infected leaves; burn or deeply bury.',
    JSON_ARRAY(
        'Apply protective systemic fungicide formulated specifically for Phytophthora infestans under expert direction.',
        'Halt overhead sprinkler watering immediately.',
        'Ensure trench drainage is completely free of stagnant standing water.'
    ),
    JSON_ARRAY(
        'Plant certified certified disease-free seed tubers.',
        'Ensure tall hilling around potato beds to shield subterranean tubers from wash-in spores.',
        'Destroy any cull piles or volunteer potato seedlings near field borders.'
    ),
    'Conduct daily morning field walks to inspect underside of leaves for white fungal mildew.',
    NOW() - INTERVAL 6 DAY
) ON DUPLICATE KEY UPDATE id=id;

-- 4. Demo Crop Expenses & Profit Tracker Data
INSERT INTO expenses (id, user_id, crop, land_area, seed_cost, fertilizer_cost, labor_cost, pesticide_cost, other_cost, revenue, season, notes)
VALUES 
(
    1,
    1,
    'Tomato',
    2.50,
    8500.00,
    14200.00,
    22000.00,
    7800.00,
    4500.00,
    98500.00,
    'Kharif 2025',
    'Yield was high following early intervention for blight.'
),
(
    2,
    1,
    'Rice (Paddy)',
    4.00,
    12000.00,
    19500.00,
    31000.00,
    6200.00,
    6800.00,
    145000.00,
    'Rabi 2025',
    'Clean harvest with zero major disease loss.'
),
(
    3,
    1,
    'Potato',
    1.50,
    18000.00,
    11000.00,
    16500.00,
    9200.00,
    3500.00,
    72000.00,
    'Zaid 2026',
    'Late blight required targeted fungicide application.'
) ON DUPLICATE KEY UPDATE id=id;

-- 5. Government Agricultural Schemes
INSERT INTO government_schemes (id, name, code, description, eligibility, benefits, category, official_url, application_process)
VALUES 
(
    1,
    'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    'PMKISAN',
    'Central sector scheme providing income support to all landholding farmers’ families across India to supplement their agricultural financial needs.',
    'Small and marginal farmer families with cultivable landholding in their names. Institutional landholders and high-income tax payers are excluded.',
    'Direct financial benefit of ₹6,000 per year transferred into bank accounts in three equal 4-monthly installments of ₹2,000 each.',
    'Central Government',
    'https://pmkisan.gov.in',
    'Apply online via PM-KISAN web portal or through local Common Service Centre (CSC) with Aadhaar card, land ownership documents, and bank passbook.'
),
(
    2,
    'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    'PMFBY',
    'Comprehensive crop insurance scheme providing insurance coverage and financial support to farmers in the event of failure of any of the notified crops as a result of natural calamities, pests & diseases.',
    'All farmers growing notified crops in notified areas including sharecroppers and tenant farmers are eligible.',
    'Uniform maximum premium of only 2% for Kharif crops, 1.5% for Rabi crops, and 5% for annual commercial/horticultural crops. Balance premium paid by Government.',
    'Insurance',
    'https://pmfby.gov.in',
    'Enroll through bank branch where crop loan is sanctioned, CSC centers, or directly via National Crop Insurance Portal within the notified cutoff date.'
),
(
    3,
    'Agriculture Infrastructure Fund (AIF)',
    'AIF',
    'Medium - long term debt financing facility for investment in viable projects for post-harvest management infrastructure and community farming assets.',
    'Primary Agricultural Credit Societies (PACS), Marketing Cooperative Societies, FPOs, SHGs, Farmers, Joint Liability Groups, and Agri-entrepreneurs.',
    'Interest subvention of 3% per annum up to a loan limit of ₹2 Crore for a maximum period of 7 years, along with CGTMSE credit guarantee coverage.',
    'Loans',
    'https://agriinfra.dac.gov.in',
    'Register and submit DPR (Detailed Project Report) on the Agri Infra Portal. Loan sanctioning done by designated participating banks.'
),
(
    4,
    'Sub-Mission on Agricultural Mechanization (SMAM)',
    'SMAM',
    'Promotes the use of modern agricultural machinery and equipment among small and marginal farmers to improve productivity and timeliness of operations.',
    'Individual farmers, SHGs, User Groups, Cooperative Societies, and Farmer Producer Organizations.',
    'Subsidy ranging from 40% to 50% for purchase of tractors, rotavators, power tillers, sprayers, and establishment of Custom Hiring Centres (CHC).',
    'Subsidy',
    'https://agrimachinery.nic.in',
    'Submit online application on the Agrimachinery portal selecting the desired implement, dealer, and upload Aadhaar, Land Record (7/12 or Patta), and bank details.'
),
(
    5,
    'Kisan Credit Card (KCC) Scheme',
    'KCC',
    'Aims at providing adequate and timely credit support from the banking system under a single window with flexible and simplified procedure to farmers for their cultivation and other needs.',
    'All farmers, individuals or joint borrowers, tenant farmers, oral lessees, and sharecroppers.',
    'Short-term credit limit up to ₹3 Lakh at an effective interest rate of 4% per annum upon prompt repayment. Built-in crop and personal insurance coverage.',
    'Loans',
    'https://www.myscheme.gov.in/schemes/kcc',
    'Obtain one-page KCC application form from local commercial bank, RRB, or Cooperative Bank, attach Aadhaar, photo, and land revenue receipt.'
),
(
    6,
    'Soil Health Card Scheme',
    'SHC',
    'Provides soil health cards to all farmers detailing nutrient status (N, P, K, micro-nutrients) and customized fertilizer recommendations to optimize input costs.',
    'All farmers possessing agricultural land across all states in India.',
    'Free soil sample testing with a personalized 3-year Soil Health Card recommending precise chemical and organic dosages for maximum yield.',
    'Central Government',
    'https://soilhealth.dac.gov.in',
    'Local agriculture department collects representative soil samples from farm plots. Card delivered at Village Panchayat or accessible on web portal.'
) ON DUPLICATE KEY UPDATE id=id;

-- 6. Initial Notifications
INSERT INTO notifications (id, user_id, title, message, type, link, is_read, created_at)
VALUES 
(
    1,
    1,
    'Disease Analysis Complete',
    'Your Tomato crop scan on Plot B shows Early Blight with 94% confidence. View treatment suggestions now.',
    'scan',
    '/results/1',
    0,
    NOW() - INTERVAL 1 HOUR
),
(
    2,
    1,
    'Treatment Plan Saved',
    'Action plan for Tomato Early Blight has been securely saved to your treatment records.',
    'treatment',
    '/history',
    0,
    NOW() - INTERVAL 2 HOUR
),
(
    3,
    1,
    'New Subsidy Scheme Available',
    'SMAM Sub-Mission on Agricultural Mechanization opened applications with up to 50% subsidy on sprayers.',
    'scheme',
    '/schemes',
    1,
    NOW() - INTERVAL 1 DAY
) ON DUPLICATE KEY UPDATE id=id;
