export interface OrphanageInfo {
  id: string;
  name: string;
  province: string;
  city: string;
  province_id: string;
  city_id: string;
  address: string;
  location_gps: string | null;
  contact_person: string;
  phone: string;
  email: string;
  description: string;
  legal_status: string;
  documents: {
    legal_document: {
      url: string;
      path: string;
      file_name: string;
      file_size: number;
      file_type: string;
      uploaded_at: string;
    };
  };
  photo_url: string | null;
  dhis2_orgunit_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  child_capacity: number;
  children_total: number;
  boys_count: number;
  girls_count: number;
  schooling_rate: number | null;
  annual_disease_rate: number | null;
  meals_per_day: number | null;
}

export interface ChildrenStats {
  total: number;
  byGender: {
    boys: number;
    girls: number;
  };
  byAgeGroup: {
    '0-2': number;
    '3-5': number;
    '6-12': number;
    '13-17': number;
    '18+': number;
  };
  newThisMonth: number;
}

export interface NutritionStats {
  malnutritionRate: number;
  byStatus: {
    malnourished: number;
  };
  averageBMI: number;
}

export interface HealthStats {
  vaccinationCoverage: number;
  commonDiseases: Array<{
    name: string;
    count: number;
  }>;
  chronicConditions: number;
}

export interface CapacityInfo {
  current: number;
  max: number;
  utilizationRate: number;
}

export interface TrendData {
  month: string;
  count?: number;
  rate?: number;
}

export interface TrendsData {
  monthlyGrowth: TrendData[];
  nutritionTrend: TrendData[];
}

export interface OrphanageStats {
  orphanage: OrphanageInfo;
  children: ChildrenStats;
  nutrition: NutritionStats;
  health: HealthStats;
  capacity: CapacityInfo;
  trends: TrendsData;
}
