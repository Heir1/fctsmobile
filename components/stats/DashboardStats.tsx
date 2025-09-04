import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { OrphanageStats } from '../../types/orphanage';

const { width: screenWidth } = Dimensions.get('window');

interface Props {
  stats: OrphanageStats;
}

export default function DashboardStats({ stats }: Props) {
  return (
    <View style={styles.container}>
      {/* Header avec nom de l'orphelinat */}
      {/* <View style={styles.header}>
        <Text style={styles.orphanageName}>{stats.orphanage.name}</Text>
        <Text style={styles.location}>{stats.orphanage.city}, {stats.orphanage.province}</Text>
      </View> */}

      {/* Statistiques principales - Capacité */}
      <Text style={styles.sectionTitle}>Capacité</Text>
      <View style={styles.scrollContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          nestedScrollEnabled={true}
        >
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>👶</Text>
            </View>
            <Text style={styles.statNumber}>{stats.children.total}</Text>
            <Text style={styles.statLabel}>Enfants</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>🏠</Text>
            </View>
            <Text style={styles.statNumber}>{stats.capacity.utilizationRate.toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Occupation</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>🆕</Text>
            </View>
            <Text style={styles.statNumber}>{stats.children.newThisMonth}</Text>
            <Text style={styles.statLabel}>Nouveaux</Text>
          </View>
        </ScrollView>
      </View>

      {/* Métriques de santé */}
      <View style={styles.healthSection}>
        <Text style={styles.sectionTitle}>Santé & Bien-être</Text>
        <View style={styles.scrollContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            nestedScrollEnabled={true}
          >
            <View style={styles.healthMetric}>
              <View style={styles.healthIconContainer}>
                <Text style={styles.healthIcon}>💉</Text>
              </View>
              <Text style={styles.healthNumber}>{stats.health.vaccinationCoverage}%</Text>
              <Text style={styles.healthLabel}>Vaccination</Text>
            </View>
            <View style={styles.healthMetric}>
              <View style={styles.healthIconContainer}>
                <Text style={styles.healthIcon}>🥗</Text>
              </View>
              <Text style={styles.healthNumber}>{stats.nutrition.malnutritionRate}%</Text>
              <Text style={styles.healthLabel}>Malnutrition</Text>
            </View>
            <View style={styles.healthMetric}>
              <View style={styles.healthIconContainer}>
                <Text style={styles.healthIcon}>🏥</Text>
              </View>
              <Text style={styles.healthNumber}>{stats.health.chronicConditions}</Text>
              <Text style={styles.healthLabel}>Conditions</Text>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Répartition par genre */}
      <View style={styles.genderSection}>
        <Text style={styles.sectionTitle}>Répartition par Genre</Text>
        <View style={styles.genderStats}>
          <View style={styles.genderItem}>
            <Text style={styles.genderIcon}>👦</Text>
            <Text style={styles.genderNumber}>{stats.children.byGender.boys}</Text>
            <Text style={styles.genderLabel}>Garçons</Text>
          </View>
          <View style={styles.genderItem}>
            <Text style={styles.genderIcon}>👧</Text>
            <Text style={styles.genderNumber}>{stats.children.byGender.girls}</Text>
            <Text style={styles.genderLabel}>Filles</Text>
          </View>
        </View>
      </View>

      {/* Alertes importantes */}
      {(stats.nutrition.malnutritionRate > 20 || stats.health.vaccinationCoverage < 80) && (
        <View style={styles.alertSection}>
          <Text style={styles.alertTitle}>⚠️ Alertes</Text>
          {stats.nutrition.malnutritionRate > 20 && (
            <Text style={styles.alertText}>• Taux de malnutrition élevé ({stats.nutrition.malnutritionRate}%)</Text>
          )}
          {stats.health.vaccinationCoverage < 80 && (
            <Text style={styles.alertText}>• Couverture vaccinale faible ({stats.health.vaccinationCoverage}%)</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  orphanageName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    marginTop: 8,
  },
  scrollContainer: {
    marginBottom: 24,
    height: 140,
  },
  scrollContent: {
    paddingRight: 20,
  },
  mainStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: screenWidth * 0.75,
    height: 120,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  statSubtext: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  healthSection: {
    marginBottom: 24,
  },
  healthGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  healthMetric: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: screenWidth * 0.75,
    height: 120,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  healthIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  healthIcon: {
    fontSize: 20,
  },
  healthNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  healthLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  healthSubtext: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  genderSection: {
    marginBottom: 24,
  },
  genderStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  genderItem: {
    alignItems: 'center',
  },
  genderIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  genderNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 4,
  },
  genderLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  alertSection: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f59e0b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 12,
  },
  alertText: {
    fontSize: 14,
    color: '#b45309',
    marginBottom: 6,
    lineHeight: 20,
  },
});
