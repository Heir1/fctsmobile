import { API_BASE_URL } from '../constants/api';
import { authService } from './authService';

export interface HealthRecordListResponse {
  success: boolean;
  data: {
    health_records: Array<{
      id: string;
      child_id: string;
      date: string;
      vaccination_status: string | null;
      chronic_conditions: string | null;
      medications: string | null;
      remarks: string | null;
      dhis2_event_id: string | null;
      synced: boolean;
      created_at: string;
      updated_at: string;
      vaccination_status_structured?: {
        status: string;
        vaccines: string[];
        last_updated: string;
      };
      diseases?: Array<{
        id: string;
        disease_id: string;
        diagnosed_date: string | null;
        severity: string | null;
        notes: string | null;
        disease_name: string;
        disease_description: string;
      }>;
    }>;
    metrics: {
      total_count: number;
      current_page: number;
      total_pages: number;
      has_next_page: boolean;
      has_prev_page: boolean;
      page_size: number;
    };
    child: { id: string; full_name: string };
    filters: { start_date: string | null; end_date: string | null };
  };
}

export interface HealthRecordDetailResponse {
  success: boolean;
  data: {
    id: string;
    child_id: string;
    date: string;
    vaccination_status: string | null;
    chronic_conditions: string | null;
    medications: string | null;
    remarks: string | null;
    dhis2_event_id: string | null;
    synced: boolean;
    created_at: string;
    updated_at: string;
    vaccination_status_structured?: {
      status: string;
      vaccines: string[];
      last_updated: string;
    };
    child: { id: string; full_name: string; orphanage_id: string };
    diseases?: Array<{
      id: string;
      disease_id: string;
      diagnosed_date: string | null;
      severity: string | null;
      notes: string | null;
      disease_name: string;
      disease_description: string;
    }>;
  };
}

export interface UpsertHealthRecordPayload {
  date: string;
  vaccination_status: string | null;
  vaccination_status_structured?: {
    status: string;
    vaccines: string[];
    last_updated: string;
  };
  chronic_conditions: string | null;
  medications: string | null;
  remarks: string | null;
  selectedDiseases?: Array<{
    disease_id: string;
    severity: string | null;
    notes: string | null;
  }>;
}

class HealthService {
  private async authHeaders() {
    const { accessToken } = await authService.getStoredTokens();
    if (!accessToken) throw new Error('Session expirée. Veuillez vous reconnecter.');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    } as const;
  }

  async listDiseases(): Promise<{ success: boolean; data: Array<{ id: string; name: string; description?: string }> }> {
    const response = await fetch(`${API_BASE_URL}/diseases`, {
      method: 'GET',
      headers: await this.authHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur lors du chargement des maladies (${response.status})`);
    }
    const raw = await response.json();
    // Extract diseases from data.diseases structure
    const diseasesArray = raw?.data?.diseases || [];
    return { success: true, data: diseasesArray } as any;
  }

  async listByChild(childId: string): Promise<HealthRecordListResponse> {
    const response = await fetch(`${API_BASE_URL}/get-health-records/${childId}`, {
      method: 'GET',
      headers: await this.authHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur lors du chargement des dossiers médicaux (${response.status})`);
    }
    return response.json();
  }

  async getDetail(recordId: string): Promise<HealthRecordDetailResponse> {
    const response = await fetch(`${API_BASE_URL}/get-health-record/${recordId}`, {
      method: 'GET',
      headers: await this.authHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur lors du chargement du dossier médical (${response.status})`);
    }
    return response.json();
  }

  async create(childId: string, payload: UpsertHealthRecordPayload): Promise<any> {
    console.log('=== CREATE HEALTH RECORD ===');
    console.log('Child ID:', childId);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/create-health-record/${childId}`, {
      method: 'POST',
      headers: await this.authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur lors de la création du dossier médical (${response.status})`);
    }
    return response.json();
  }

  async update(recordId: string, payload: UpsertHealthRecordPayload): Promise<any> {
    console.log('=== UPDATE HEALTH RECORD ===');
    console.log('Record ID:', recordId);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/update-health-record/${recordId}`, {
      method: 'PUT',
      headers: await this.authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur lors de la mise à jour du dossier médical (${response.status})`);
    }
    return response.json();
  }

  async delete(recordId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/delete-health-record/${recordId}`, {
      method: 'DELETE',
      headers: await this.authHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur lors de la suppression du dossier médical (${response.status})`);
    }
    return response.json();
  }
}

export const healthService = new HealthService();


