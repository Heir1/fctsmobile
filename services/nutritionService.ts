import { API_BASE_URL } from '../constants/api';
import { authService } from './authService';

export interface UpsertNutritionPayload {
  date: string; // ISO date string
  weight_kg: number;
  height_cm: number;
  nutrition_status: string;
}

class NutritionService {
  private async authHeaders() {
    const { accessToken } = await authService.getStoredTokens();
    if (!accessToken) throw new Error('Session expirée. Veuillez vous reconnecter.');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    } as const;
  }

  async listByChild(childId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/nutrition-records/${childId}`, {
      method: 'GET',
      headers: await this.authHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur lors du chargement des dossiers de nutrition (${response.status})`);
    }
    return response.json();
  }

  async getDetail(recordId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/nutrition-record/${recordId}`, {
      method: 'GET',
      headers: await this.authHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur lors du chargement du dossier de nutrition (${response.status})`);
    }
    return response.json();
  }

  async create(childId: string, payload: UpsertNutritionPayload): Promise<any> {
    console.log('=== CREATE NUTRITION RECORD ===');
    console.log('Child ID:', childId);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    const response = await fetch(`${API_BASE_URL}/create-nutrition-record/${childId}`, {
      method: 'POST',
      headers: await this.authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur lors de la création (${response.status})`);
    }
    return response.json();
  }

  async update(recordId: string, payload: UpsertNutritionPayload): Promise<any> {
    console.log('=== UPDATE NUTRITION RECORD ===');
    console.log('Record ID:', recordId);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    const response = await fetch(`${API_BASE_URL}/update-nutrition-record/${recordId}`, {
      method: 'PUT',
      headers: await this.authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur lors de la mise à jour (${response.status})`);
    }
    return response.json();
  }

  async delete(recordId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/delete-nutrition-record/${recordId}`, {
      method: 'DELETE',
      headers: await this.authHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur lors de la suppression (${response.status})`);
    }
    return response.json();
  }
}

export const nutritionService = new NutritionService();



