import { Ionicons } from '@expo/vector-icons';
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
import UnifiedHeader from './UnifiedHeader';

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
        <UnifiedHeader
          title="Dashboard"
          subtitle="Welcome back, {user?.email || 'User'}"
          showRefresh={false}
          showMenu={false}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
          <Text style={styles.loadingText}>Chargement des statistiques...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <UnifiedHeader
        title="Dashboard"
        subtitle="Overview & Analytics"
        onMenuPress={openSidebar}
        onRefreshPress={onRefresh}
        refreshing={refreshing}
        showRefresh={true}
        showMenu={true}
      />
  
      {/* Content */}
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#3b82f6"
            colors={['#3b82f6']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <View style={styles.errorCard}>
            <View style={styles.errorIconContainer}>
              <Ionicons name="warning" size={24} color="#d97706" />
            </View>
            <View style={styles.errorTextContainer}>
              <Text style={styles.errorTitle}>Demo Data Active</Text>
              <Text style={styles.errorText}>
                {error}. Displaying sample demonstration data.
              </Text>
            </View>
          </View>
        )}
  
        {stats && <DashboardStats stats={stats} />}
  
        {/* Empty state illustration */}
        {!stats && !refreshing && (
          <View style={styles.emptyState}>
            <Ionicons name="stats-chart" size={64} color="#374151" />
            <Text style={styles.emptyStateTitle}>No Data Available</Text>
            <Text style={styles.emptyStateText}>
              Pull down to refresh or check your connection
            </Text>
          </View>
        )}
      </ScrollView>
  
      {/* Sidebar + Overlay avec animations améliorées */}
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
                      outputRange: [-300, 0],
                    }),
                  },
                ],
                opacity: sidebarAnim,
              },
            ]}
          >
            <Sidebar 
              onNavigateHome={navigateHome} 
              onNavigateChildren={navigateChildren} 
              onNavigateHealth={navigateHealth} 
              onNavigateNutrition={navigateNutrition} 
              onClose={closeSidebar} 
              onLogout={handleLogout} 
            />
          </Animated.View>
          <TouchableOpacity 
            style={styles.overlay} 
            activeOpacity={1} 
            onPress={closeSidebar}
          />
        </View>
      )}
  
      {/* Floating action button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={onRefresh}
        activeOpacity={0.9}
      >
        <Ionicons 
          name="refresh" 
          size={24} 
          color="#ffffff" 
          style={refreshing && styles.fabRefreshing}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  errorCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    alignItems: 'center',
  },
  errorIconContainer: {
    marginRight: 16,
  },
  errorTextContainer: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f59e0b',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  errorText: {
    fontSize: 14,
    color: '#fbbf24',
    lineHeight: 20,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 1000,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sidebarContainer: {
    width: 300,
    backgroundColor: '#111827',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    marginVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabRefreshing: {
    transform: [{ rotate: '360deg' }],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
});
