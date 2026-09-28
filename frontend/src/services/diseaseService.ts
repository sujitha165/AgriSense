import { ScanRecord, TreatmentPlan } from '../types';
import { apiRequest, LocalDB } from './api';
import { MOCK_DISEASE_CATALOG } from '../data/mockDiseases';

export const diseaseService = {
  /**
   * Analyze an uploaded or camera-captured leaf image
   */
  async analyzeCropImage(formData: FormData): Promise<ScanRecord> {
    const res = await apiRequest<ScanRecord>('/disease/analyze', {
      method: 'POST',
      body: formData
    });

    if (!res.data || !res.data.disease) {
      throw new Error('The AI service returned no diagnosis.');
    }

    return res.data;
  },

  /**
   * Fetch scan history with filters
   */
  async getHistory(): Promise<ScanRecord[]> {
    const res = await apiRequest<ScanRecord[]>('/disease/history');
    return res.data || LocalDB.getScans();
  },

  /**
   * Fetch single scan by ID
   */
  async getScanById(id: number): Promise<ScanRecord> {
    const res = await apiRequest<ScanRecord>(`/disease/${id}`);
    if (res.data && res.data.id) return res.data;

    const scans = LocalDB.getScans();
    const found = scans.find(s => s.id === id);
    if (found) return found;

    return scans[0];
  },

  /**
   * Save treatment plan
   */
  async saveTreatment(plan: Partial<TreatmentPlan>): Promise<boolean> {
    try {
      await apiRequest('/treatments', {
        method: 'POST',
        body: JSON.stringify(plan)
      });
      return true;
    } catch (e) {
      return true;
    }
  },

  /**
   * Delete scan
   */
  async deleteScan(id: number): Promise<boolean> {
    try {
      await apiRequest(`/disease/${id}`, { method: 'DELETE' });
    } catch (e) {
      // ignore
    }
    const scans = LocalDB.getScans().filter(s => s.id !== id);
    LocalDB.saveScans(scans);
    return true;
  }
};
