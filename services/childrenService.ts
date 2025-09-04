import { API_BASE_URL } from '../constants/api';
import { ChildDetail, ChildrenListResponse } from '../types/child';
import { authService } from './authService';

class ChildrenService {
  async getAllChildren(): Promise<ChildrenListResponse> {
    const { accessToken } = await authService.getStoredTokens();
    if (!accessToken) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    const response = await fetch(`${API_BASE_URL}/children`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur lors du chargement des enfants (${response.status})`);
    }
    return response.json();
  }

  async getChildById(id: string): Promise<ChildDetail> {
    const { accessToken } = await authService.getStoredTokens();
    if (!accessToken) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    const response = await fetch(`${API_BASE_URL}/child/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur lors du chargement de l'enfant (${response.status})`);
    }
    return response.json();
  }

  async createChild(payload: {
    full_name: string;
    gender: 'M' | 'F';
    birth_date: string | null;
    estimated_age: number | null;
    entry_date: string | null;
    parent_status: string | null;
    internal_code?: string | null;
  }): Promise<any> {
    const { accessToken } = await authService.getStoredTokens();
    if (!accessToken) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    const response = await fetch(`${API_BASE_URL}/children-create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur lors de la création (${response.status})`);
    }
    return response.json();
  }

  async updateChild(id: string, payload: {
    full_name: string;
    gender: 'M' | 'F';
    birth_date: string | null;
    estimated_age: number | null;
    entry_date: string | null;
    parent_status: string | null;
    internal_code?: string | null;
  }): Promise<any> {
    const { accessToken } = await authService.getStoredTokens();
    if (!accessToken) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    const response = await fetch(`${API_BASE_URL}/update-child/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur lors de la modification (${response.status})`);
    }
    return response.json();
  }

  async deleteChild(id: string): Promise<any> {
    const { accessToken } = await authService.getStoredTokens();
    if (!accessToken) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    const response = await fetch(`${API_BASE_URL}/delete-child/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur lors de la suppression (${response.status})`);
    }
    return response.json();
  }
}

export const childrenService = new ChildrenService();
