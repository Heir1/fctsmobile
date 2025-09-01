import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HealthStats, NutritionStats } from '../../types/orphanage';

interface Props {
  nutritionStats: NutritionStats;
  healthStats: HealthStats;
}

export default function HealthNutritionCard({ nutritionStats, healthStats }: Props) {
  const getNutritionStatus = (rate: number) => {
    if (rate < 10) return { status: 'Bon', color: '#10b981' };
    if (rate < 20) return { status: 'Modéré', color: '#f59e0b' };
    return { status: 'Élevé', color: '#ef4444' };
  };

  const nutritionStatus = getNutritionStatus(nutritionStats.malnutritionRate);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Santé & Nutrition</Text>
      
      {/* Nutrition */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nutrition</Text>
        <View style={styles.nutritionGrid}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionNumber}>{nutritionStats.malnutritionRate}%</Text>
            <Text style={styles.nutritionLabel}>Taux de malnutrition</Text>
            <Text style={[styles.nutritionStatus, { color: nutritionStatus.color }]}>
              {nutritionStatus.status}
            </Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionNumber}>{nutritionStats.byStatus.malnourished}</Text>
            <Text style={styles.nutritionLabel}>Enfants malnutris</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionNumber}>{nutritionStats.averageBMI}</Text>
            <Text style={styles.nutritionLabel}>IMC moyen</Text>
          </View>
        </View>
      </View>

      {/* Santé */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Santé</Text>
        <View style={styles.healthRow}>
          <View style={styles.healthItem}>
            <Text style={styles.healthNumber}>{healthStats.vaccinationCoverage}%</Text>
            <Text style={styles.healthLabel}>Couverture vaccinale</Text>
          </View>
          <View style={styles.healthItem}>
            <Text style={styles.healthNumber}>{healthStats.chronicConditions}</Text>
            <Text style={styles.healthLabel}>Conditions chroniques</Text>
          </View>
        </View>
      </View>

      {/* Maladies communes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Maladies Communes</Text>
        {healthStats.commonDiseases.map((disease, index) => (
          <View key={index} style={styles.diseaseRow}>
            <Text style={styles.diseaseName}>{disease.name}</Text>
            <View style={styles.diseaseCountContainer}>
              <Text style={styles.diseaseCount}>{disease.count}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  section: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  nutritionLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  nutritionStatus: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  healthItem: {
    alignItems: 'center',
  },
  healthNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
  },
  healthLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  diseaseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  diseaseName: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  diseaseCountContainer: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  diseaseCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400e',
  },
});
