import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { orphanageService } from '../services/orphanageService';
import { OrphanageStats } from '../types/orphanage';
import Sidebar from './Sidebar';
import DashboardStats from './stats/DashboardStats';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<OrphanageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(0)).current; // 0 closed, 1 open
  const sidebarWidth = Dimensions.get('window').width * 0.75;

  const loadStats = async (useDemoData = false) => {
    try {
      setError(null);
      let data: OrphanageStats;
      
      if (useDemoData) {
        data = orphanageService.getDemoStats();
      } else {
        data = await orphanageService.getOrphanageStats();
      }
      
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
      
      // Si l'API échoue, utiliser les données de démonstration
      if (!useDemoData) {
        console.log('Using demo data as fallback');
        const demoData = orphanageService.getDemoStats();
        setStats(demoData);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
    Animated.timing(sidebarAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setIsSidebarOpen(false));
  };

  const navigateHome = () => {
    closeSidebar();
    router.replace('/dashboard');
  };

  const navigateChildren = () => {
    closeSidebar();
    router.push('/children');
  };

  const navigateHealth = () => {
    closeSidebar();
    router.push('/health');
  };

  const navigateNutrition = () => {
    closeSidebar();
    router.push('/nutrition');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Dashboard</Text>
              <Text style={styles.headerSubtitle}>
                Welcome back, {user?.email || 'User'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
          <Text style={styles.loadingText}>Chargement des statistiques...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={openSidebar} style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>
              Welcome back, {user?.email || 'User'}
            </Text>
          </View>

        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>⚠️ Données de démonstration</Text>
            <Text style={styles.errorText}>
              {error}. Affichage des données de démonstration.
            </Text>
          </View>
        )}

        {stats && <DashboardStats stats={stats} />}

        {/* <View style={styles.successCard}>
          <Text style={styles.successTitle}>
            Étape 3 Complete! ✅
          </Text>
          <Text style={styles.successText}>
            Dashboard optimisé avec statistiques focalisées :
          </Text>
          <View style={styles.successList}>
            <Text style={styles.successItem}>• Statistiques principales (enfants, occupation, nouveaux)</Text>
            <Text style={styles.successItem}>• Métriques de santé et bien-être</Text>
            <Text style={styles.successItem}>• Répartition par genre avec icônes</Text>
            <Text style={styles.successItem}>• Alertes automatiques pour problèmes critiques</Text>
            <Text style={styles.successItem}>• Interface épurée et professionnelle</Text>
          </View>
        </View> */}

      </ScrollView>

      {/* Sidebar + Overlay */}
      {isSidebarOpen && (
        <View style={styles.overlayContainer}>
          <Animated.View
            style={[
              styles.sidebarContainer,
              {
                transform: [
                  {
                    translateX: sidebarAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-sidebarWidth, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Sidebar onNavigateHome={navigateHome} onNavigateChildren={navigateChildren} onNavigateHealth={navigateHealth} onNavigateNutrition={navigateNutrition} onClose={closeSidebar} onLogout={handleLogout} />
          </Animated.View>
          <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeSidebar} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    marginRight: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  menuIcon: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    color: '#6b7280',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  overlay: {
    width: '25%',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sidebarContainer: {
    width: '75%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#b45309',
  },
  successCard: {
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 24,
    margin: 20,
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  successText: {
    color: '#1d4ed8',
    marginBottom: 8,
  },
  successList: {
    marginTop: 8,
  },
  successItem: {
    color: '#1e40af',
    marginBottom: 2,
  },
});
