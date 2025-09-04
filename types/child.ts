export interface ChildSummary {
  id: string;
  orphanage_id: string;
  full_name: string;
  gender: 'M' | 'F';
  birth_date: string | null;
  estimated_age: number | null;
  entry_date: string | null;
  photo_url: string | null;
  parent_status: string | null;
  internal_code: string | null;
  dhis2_tracked_entity_id: string | null;
  created_at: string;
  updated_at: string;
  orphanage?: { name: string };
}

export interface ChildrenListResponse {
  success: boolean;
  data: {
    children: ChildSummary[];
    metrics: {
      total_count: number;
      current_page: number;
      total_pages: number;
      has_next_page: boolean;
      has_prev_page: boolean;
      page_size: number;
    };
    filters: {
      search: string | null;
      gender: 'M' | 'F' | null;
      parent_status: string | null;
    };
  };
}

export interface NutritionRecord {
  id: string;
  bmi: number;
  date: string;
  synced: boolean;
  child_id: string;
  height_cm: number;
  weight_kg: number;
  created_at: string;
  updated_at: string;
  dhis2_event_id: string | null;
  nutrition_status: string | null;
}

export interface HealthRecord {
  id: string;
  date: string;
  synced: boolean;
  remarks: string | null;
  child_id: string;
  created_at: string;
  updated_at: string;
  medications: string | null;
  dhis2_event_id: string | null;
  chronic_conditions: string | null;
  vaccination_status: string | null;
  vaccination_status_structured?: {
    status: string;
    vaccines: any[];
    last_updated: string;
  };
}

export interface ChildDetail extends Omit<ChildSummary, 'orphanage'> {
  nutrition_records: NutritionRecord[];
  health_records: HealthRecord[];
  child_diseases: Array<{
    notes: string | null;
    diseases: { name: string };
    severity: string | null;
    diagnosed_date: string | null;
  }>;
}



