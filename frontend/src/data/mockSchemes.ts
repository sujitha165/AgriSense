import { GovernmentScheme } from '../types';

export const MOCK_GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: 1,
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    code: 'PMKISAN',
    description: 'Central sector scheme providing income support to all landholding farmers’ families across India to supplement their agricultural financial inputs and domestic needs.',
    eligibility: 'All small and marginal farmer families who hold cultivable land in their names. Excludes institutional landholders, tax payers, and high-income holders.',
    benefits: 'Direct annual financial benefit of ₹6,000 paid into registered bank accounts in three equal 4-monthly installments of ₹2,000 each.',
    category: 'Central Government',
    official_url: 'https://pmkisan.gov.in',
    application_process: 'Apply through the PM-KISAN web portal or Common Service Centres (CSC) with Aadhaar card, land ownership record (7/12 or Patta), and active bank passbook.'
  },
  {
    id: 2,
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    code: 'PMFBY',
    description: 'A comprehensive national crop insurance scheme protecting farmers against production risks like unseasonal rains, drought, and crop disease epidemics.',
    eligibility: 'All farmers cultivating notified crops in notified areas including tenant farmers and sharecroppers.',
    benefits: 'Extremely subsidized premium rates: 2% for Kharif food and oilseed crops, 1.5% for Rabi crops, and 5% for annual commercial/horticultural crops. Balance subsidized by Govt.',
    category: 'Insurance',
    official_url: 'https://pmfby.gov.in',
    application_process: 'Enroll through local commercial bank, Cooperative societies, CSC centers, or directly via National Crop Insurance Portal prior to the season cutoff date.'
  },
  {
    id: 3,
    name: 'Agriculture Infrastructure Fund (AIF)',
    code: 'AIF',
    description: 'Medium to long-term debt financing facility for post-harvest management infrastructure, cold stores, sorting/grading units, and modern community farming assets.',
    eligibility: 'Primary Agricultural Credit Societies (PACS), FPOs, SHGs, Agri-entrepreneurs, and individual farmers.',
    benefits: 'Interest subvention of 3% per annum on loans up to ₹2 Crore for a maximum tenure of 7 years, alongside credit guarantee coverage under CGTMSE.',
    category: 'Loans',
    official_url: 'https://agriinfra.dac.gov.in',
    application_process: 'Submit an online Detailed Project Report (DPR) on the Agri Infra Portal. Sanctioning managed by designated commercial and cooperative banks.'
  },
  {
    id: 4,
    name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    code: 'SMAM',
    description: 'Promotes modern mechanized farm equipment (tractors, power weeders, precision sprayers) to increase productivity and reduce labor drudgery.',
    eligibility: 'Individual farmers, women farmers, SC/ST farmers, and Farmer Producer Organizations (FPOs).',
    benefits: 'Direct financial subsidy of 40% to 50% on approved agricultural machinery and up to 80% for setting up Custom Hiring Centres (CHCs).',
    category: 'Subsidy',
    official_url: 'https://agrimachinery.nic.in',
    application_process: 'Register on the Agrimachinery portal, choose machinery and authorized dealer, and submit land records, Aadhaar, and bank details for online subsidy voucher.'
  },
  {
    id: 5,
    name: 'Kisan Credit Card (KCC) Scheme',
    code: 'KCC',
    description: 'Simplified institutional credit window providing affordable and timely working capital for seeds, fertilizers, pesticides, and harvest expenses.',
    eligibility: 'All farmers, owner cultivators, tenant farmers, oral lessees, and sharecroppers.',
    benefits: 'Short-term credit limit up to ₹3 Lakh at an effective interest rate of 4% per annum upon prompt repayment (3% prompt repayment incentive).',
    category: 'Loans',
    official_url: 'https://www.myscheme.gov.in/schemes/kcc',
    application_process: 'Submit standard one-page KCC form to local bank branch or PACS with land revenue receipt, crop cultivation details, and Aadhaar card.'
  },
  {
    id: 6,
    name: 'Soil Health Card Scheme',
    code: 'SHC',
    description: 'Issues comprehensive soil health report cards to farmers every 3 years with scientific nutrient status and customized fertilizer application guides.',
    eligibility: 'All farmers owning or leasing agricultural land across India.',
    benefits: 'Free laboratory testing of 12 critical chemical and physical soil parameters, preventing unnecessary expenditure on excess fertilizer purchases.',
    category: 'Central Government',
    official_url: 'https://soilhealth.dac.gov.in',
    application_process: 'State agriculture department field officers collect representative geo-tagged soil samples. Cards distributed through Village Panchayats.'
  },
  {
    id: 7,
    name: 'Tamil Nadu Chief Minister Solar Powered Pump Sets Scheme',
    code: 'TNSOLAR',
    description: 'State government initiative in Tamil Nadu assisting farmers to install energy-efficient off-grid solar agricultural water pumping systems.',
    eligibility: 'Farmers in Tamil Nadu with assured groundwater sources not utilizing free grid power connections.',
    benefits: '70% capital subsidy (40% State Govt + 30% Central MNRE) for solar motor pump sets ranging from 5 HP to 10 HP capacity.',
    category: 'State Government',
    official_url: 'https://www.tnhorticulture.tn.gov.in',
    application_process: 'Register on the Tamil Nadu Agricultural Engineering Department online portal with Chitta/Adangal and groundwater certificate.'
  },
  {
    id: 8,
    name: 'Micro Irrigation Scheme (PMKSY - Per Drop More Crop)',
    code: 'PMKSY-MI',
    description: 'Encourages water-use efficiency through precision Drip and Sprinkler irrigation systems to conserve groundwater and enhance crop yield.',
    eligibility: 'All landholding farmers cultivating horticultural or field crops.',
    benefits: 'Subsidy of up to 55% for small and marginal farmers and 45% for other farmers for drip irrigation and sprinkler installation.',
    category: 'Subsidy',
    official_url: 'https://pmksy.gov.in',
    application_process: 'Apply through your district Horticulture or Agriculture office with water source proof, land title, and field layout blueprint.'
  }
];
