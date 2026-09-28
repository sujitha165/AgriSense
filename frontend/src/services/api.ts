import { User, ScanRecord, ExpenseRecord, GovernmentScheme, AppNotification } from '../types';
import { DEMO_USER, INITIAL_DEMO_SCANS, INITIAL_DEMO_EXPENSES, INITIAL_DEMO_NOTIFICATIONS } from '../data/demoData';
import { MOCK_GOVERNMENT_SCHEMES } from '../data/mockSchemes';
import { MOCK_DISEASE_CATALOG } from '../data/mockDiseases';

const API_BASE = '/api';

/**
 * Helper to initialize local persistent mock store
 */
function getLocalStore<T>(key: string, initial: T): T {
  try {
    const data = localStorage.getItem(`agrisense_${key}`);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
  }
  localStorage.setItem(`agrisense_${key}`, JSON.stringify(initial));
  return initial;
}

function setLocalStore<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`agrisense_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// Initialise local datasets
export const LocalDB = {
  getScans: (): ScanRecord[] => getLocalStore('scans', INITIAL_DEMO_SCANS),
  saveScans: (scans: ScanRecord[]) => setLocalStore('scans', scans),

  getExpenses: (): ExpenseRecord[] => getLocalStore('expenses', INITIAL_DEMO_EXPENSES),
  saveExpenses: (expenses: ExpenseRecord[]) => setLocalStore('expenses', expenses),

  getNotifications: (): AppNotification[] => getLocalStore('notifications', INITIAL_DEMO_NOTIFICATIONS),
  saveNotifications: (notifs: AppNotification[]) => setLocalStore('notifications', notifs),

  getUser: (): User => getLocalStore('user', DEMO_USER),
  saveUser: (user: User) => setLocalStore('user', user),

  getSchemes: (): GovernmentScheme[] => getLocalStore('schemes', MOCK_GOVERNMENT_SCHEMES)
};

/**
 * Unified API Request Client
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data: T; message?: string }> {
  const token = localStorage.getItem('agrisense_token') || 'demo-farmer-token';

  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(options.headers || {})
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(json?.message || `Request failed with status ${res.status}.`);
    }

    return json;
  } catch (err) {
    if (err instanceof TypeError) {
      return handleLocalFallback<T>(endpoint, options);
    }
    throw err;
  }
}

/**
 * Offline / Standalone Mock Handler
 */
function handleLocalFallback<T>(endpoint: string, options: RequestInit): { success: boolean; data: T; message?: string } {
  const method = (options.method || 'GET').toUpperCase();

  // Auth: Login / Register / Profile
  if (endpoint === '/auth/login' && method === 'POST') {
    const user = LocalDB.getUser();
    return { success: true, data: { user, token: 'demo-farmer-token' } as unknown as T };
  }

  if (endpoint === '/auth/profile') {
    if (method === 'GET') {
      return { success: true, data: LocalDB.getUser() as unknown as T };
    }
    if (method === 'PUT') {
      const body = JSON.parse(options.body as string);
      const updated = { ...LocalDB.getUser(), ...body };
      LocalDB.saveUser(updated);
      return { success: true, data: updated as unknown as T };
    }
  }

  // Disease Scans: List / Single / Analyze
  if (endpoint.startsWith('/disease/history')) {
    const scans = LocalDB.getScans();
    return { success: true, data: scans as unknown as T };
  }

  if (endpoint.startsWith('/disease/') && method === 'GET') {
    const id = parseInt(endpoint.replace('/disease/', ''), 10);
    const scans = LocalDB.getScans();
    const scan = scans.find(s => s.id === id) || scans[0];
    return { success: true, data: scan as unknown as T };
  }

  // Schemes
  if (endpoint.startsWith('/schemes')) {
    return { success: true, data: LocalDB.getSchemes() as unknown as T };
  }

  // Profit / Expenses
  if (endpoint === '/profit' && method === 'GET') {
    const records = LocalDB.getExpenses();
    let totalExpenses = 0, totalRevenue = 0, totalProfit = 0;
    records.forEach(r => {
      totalExpenses += r.total_cost || 0;
      totalRevenue += r.revenue || 0;
      totalProfit += r.profit || 0;
    });
    const overallMargin = totalRevenue > 0 ? parseFloat(((totalProfit / totalRevenue) * 100).toFixed(1)) : 0;
    return {
      success: true,
      data: {
        records,
        summary: { totalExpenses, totalRevenue, totalProfit, overallMargin, activeCropsCount: records.length }
      } as unknown as T
    };
  }

  if (endpoint === '/profit' && method === 'POST') {
    const body = JSON.parse(options.body as string);
    const records = LocalDB.getExpenses();
    const seed = parseFloat(body.seed_cost) || 0;
    const fert = parseFloat(body.fertilizer_cost) || 0;
    const labor = parseFloat(body.labor_cost) || 0;
    const pest = parseFloat(body.pesticide_cost) || 0;
    const other = parseFloat(body.other_cost) || 0;
    const rev = parseFloat(body.revenue) || 0;
    const total_cost = seed + fert + labor + pest + other;
    const profit = rev - total_cost;

    const newRec: ExpenseRecord = {
      id: records.length + 1,
      user_id: 1,
      crop: body.crop,
      land_area: parseFloat(body.land_area) || 1,
      seed_cost: seed,
      fertilizer_cost: fert,
      labor_cost: labor,
      pesticide_cost: pest,
      other_cost: other,
      total_cost,
      revenue: rev,
      profit,
      season: body.season || 'Kharif',
      notes: body.notes || ''
    };
    records.unshift(newRec);
    LocalDB.saveExpenses(records);
    return { success: true, data: newRec as unknown as T };
  }

  // Notifications
  if (endpoint === '/notifications') {
    const notifs = LocalDB.getNotifications();
    const unreadCount = notifs.filter(n => !n.is_read).length;
    return { success: true, data: { notifications: notifs, unreadCount } as unknown as T };
  }

  // Fallback default
  return { success: true, data: [] as unknown as T };
}
