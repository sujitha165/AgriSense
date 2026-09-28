export type Language = 'en' | 'ta' | 'te' | 'hi';

export type Severity = 'Healthy' | 'Low' | 'Moderate' | 'Severe' | 'Not assessed';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  language: Language;
  main_crop: string;
  avatar_url?: string;
  created_at?: string;
}

export interface ScanRecord {
  id: number;
  user_id?: number;
  image_url: string;
  crop: string;
  disease: string;
  confidence: number;
  severity: Severity;
  pathogen?: string;
  symptoms: string[];
  causes: string[];
  treatment?: string[];
  prevention?: string[];
  monitoring?: string;
  expert_warning?: string;
  notes?: string;
  top_predictions?: { label: string; confidence: number }[];
  model?: string;
  confidence_note?: string;
  crop_mismatch?: boolean;
  created_at: string;
}

export interface TreatmentPlan {
  id?: number;
  scan_id: number;
  immediate_action: string;
  treatment_plan: string[];
  prevention: string[];
  monitoring: string;
  expert_warning?: string;
  saved_at?: string;
}

export interface ExpenseRecord {
  id: number;
  user_id?: number;
  crop: string;
  land_area: number;
  seed_cost: number;
  fertilizer_cost: number;
  labor_cost: number;
  pesticide_cost: number;
  other_cost: number;
  total_cost: number;
  revenue: number;
  profit: number;
  season?: string;
  notes?: string;
  created_at?: string;
}

export interface ExpenseSummary {
  totalExpenses: number;
  totalRevenue: number;
  totalProfit: number;
  overallMargin: number;
  activeCropsCount: number;
}

export interface GovernmentScheme {
  id: number;
  name: string;
  code: string;
  description: string;
  eligibility: string;
  benefits: string;
  category: 'Subsidy' | 'Insurance' | 'Loans' | 'Central Government' | 'State Government';
  official_url: string | null;
  application_process: string;
}

export interface AppNotification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'scan' | 'treatment' | 'scheme' | 'system';
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  image?: string;
  timestamp: string;
}
