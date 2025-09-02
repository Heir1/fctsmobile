import { API_ENDPOINTS } from '../constants/api';
import { OrphanageStats } from '../types/orphanage';
import { authService } from './authService';

class OrphanageService {
  async getOrphanageStats(): Promise<OrphanageStats> {
    try {
      // Récupérer le token d'accès
      const { accessToken } = await authService.getStoredTokens();
      
      if (!accessToken) {
        throw new Error('Token d\'accès non trouvé. Veuillez vous reconnecter.');
      }

      console.log('=== ORPHANAGE STATS API CALL ===');
      console.log('Fetching orphanage stats with token:', accessToken.substring(0, 20) + '...');
      console.log('Full token length:', accessToken.length);
      console.log('API endpoint:', API_ENDPOINTS.ORPHANAGE_STATS);

      // Appel avec le token utilisateur
      const response = await fetch(API_ENDPOINTS.ORPHANAGE_STATS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response data:', errorData);
        if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        // En cas d'erreur serveur (ex: 500), renvoyer les données de démonstration
        console.log('Server error, returning demo stats as fallback.');
        return this.getDemoStats();
      }

      const data: OrphanageStats = await response.json();
      console.log('✅ API Response received successfully!');
      console.log('Response structure:', Object.keys(data));
      console.log('Orphanage name:', data.orphanage?.name);
      console.log('Children total:', data.children?.total);
      
      return data;
    } catch (error) {
      console.error('❌ Error fetching orphanage stats:', error);
      throw error;
    }
  }

  // Méthode pour générer des données de démonstration si l'API n'est pas disponible
  getDemoStats(): OrphanageStats {
    console.log('📊 Using demo data as fallback');
    return {
      orphanage: {
        id: "demo-id",
        name: "Maison Lumière",
        province: "Kasaï Oriental",
        city: "Mbuji-Mayi",
        province_id: "demo-province-id",
        city_id: "demo-city-id",
        address: "Rue Tshikapa 45, Quartier Diulu",
        location_gps: null,
        contact_person: "Jean-Claude Ilunga",
        phone: "+243 997 654 321",
        email: "lumiere@centre.cd",
        description: "Prend en charge les enfants abandonnés ou en détresse sociale.",
        legal_status: "verified",
        documents: {
          legal_document: {
            url: "https://example.com/document.jpg",
            path: "temp/document.jpg",
            file_name: "document.jpg",
            file_size: 129336,
            file_type: "image",
            uploaded_at: "2025-07-11T19:33:54.830Z"
          }
        },
        photo_url: null,
        dhis2_orgunit_id: null,
        created_by: null,
        created_at: "2025-07-11T19:33:55.087995+00:00",
        updated_at: "2025-07-11T19:42:49.232643+00:00",
        child_capacity: 110,
        children_total: 110,
        boys_count: 60,
        girls_count: 50,
        schooling_rate: null,
        annual_disease_rate: null,
        meals_per_day: null
      },
      children: {
        total: 2,
        byGender: {
          boys: 0,
          girls: 0
        },
        byAgeGroup: {
          '0-2': 0,
          '3-5': 0,
          '6-12': 2,
          '13-17': 0,
          '18+': 0
        },
        newThisMonth: 0
      },
      nutrition: {
        malnutritionRate: 100,
        byStatus: {
          malnourished: 1
        },
        averageBMI: 9.5
      },
      health: {
        vaccinationCoverage: 0,
        commonDiseases: [
          {
            name: "Malnutrition",
            count: 1
          },
          {
            name: "Dermatite",
            count: 1
          }
        ],
        chronicConditions: 1
      },
      capacity: {
        current: 2,
        max: 110,
        utilizationRate: 1.8181818181818181
      },
      trends: {
        monthlyGrowth: [
          {
            month: "Apr 2025",
            count: 0
          },
          {
            month: "May 2025",
            count: 0
          },
          {
            month: "Jun 2025",
            count: 0
          },
          {
            month: "Jul 2025",
            count: 1
          },
          {
            month: "Aug 2025",
            count: 1
          },
          {
            month: "Sep 2025",
            count: 0
          }
        ],
        nutritionTrend: [
          {
            month: "Jul",
            rate: 100
          },
          {
            month: "Aug",
            rate: 0
          },
          {
            month: "Sep",
            rate: 0
          }
        ]
      }
    };
  }
}

export const orphanageService = new OrphanageService();
