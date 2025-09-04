import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChildrenStats } from '../../types/orphanage';

interface Props {
  childrenStats: ChildrenStats;
}

export default function ChildrenStatsCard({ childrenStats }: Props) {
  const totalChildren = childrenStats.total;
  const malePercentage = totalChildren > 0 ? ((childrenStats.byGender.boys / totalChildren) * 100).toFixed(1) : '0';
  const femalePercentage = totalChildren > 0 ? ((childrenStats.byGender.girls / totalChildren) * 100).toFixed(1) : '0';

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Statistiques des Enfants</Text>
      
      {/* Total et nouveaux */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{totalChildren}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{childrenStats.newThisMonth}</Text>
          <Text style={styles.summaryLabel}>Nouveaux ce mois</Text>
        </View>
      </View>

      {/* Répartition par genre */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Répartition par Genre</Text>
        <View style={styles.genderRow}>
          <View style={styles.genderItem}>
            <View style={styles.genderBar}>
              <View 
                style={[
                  styles.genderBarFill, 
                  { 
                    width: `${malePercentage}%`,
                    backgroundColor: '#3b82f6'
                  }
                ]} 
              />
            </View>
            <View style={styles.genderInfo}>
              <Text style={styles.genderLabel}>Garçons</Text>
              <Text style={styles.genderCount}>{childrenStats.byGender.boys} ({malePercentage}%)</Text>
            </View>
          </View>
          <View style={styles.genderItem}>
            <View style={styles.genderBar}>
              <View 
                style={[
                  styles.genderBarFill, 
                  { 
                    width: `${femalePercentage}%`,
                    backgroundColor: '#ec4899'
                  }
                ]} 
              />
            </View>
            <View style={styles.genderInfo}>
              <Text style={styles.genderLabel}>Filles</Text>
              <Text style={styles.genderCount}>{childrenStats.byGender.girls} ({femalePercentage}%)</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Répartition par âge */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Répartition par Âge</Text>
        <View style={styles.ageGrid}>
          <View style={styles.ageItem}>
            <Text style={styles.ageNumber}>{childrenStats.byAgeGroup['0-2']}</Text>
            <Text style={styles.ageLabel}>0-2 ans</Text>
          </View>
          <View style={styles.ageItem}>
            <Text style={styles.ageNumber}>{childrenStats.byAgeGroup['3-5']}</Text>
            <Text style={styles.ageLabel}>3-5 ans</Text>
          </View>
          <View style={styles.ageItem}>
            <Text style={styles.ageNumber}>{childrenStats.byAgeGroup['6-12']}</Text>
            <Text style={styles.ageLabel}>6-12 ans</Text>
          </View>
          <View style={styles.ageItem}>
            <Text style={styles.ageNumber}>{childrenStats.byAgeGroup['13-17']}</Text>
            <Text style={styles.ageLabel}>13-17 ans</Text>
          </View>
          <View style={styles.ageItem}>
            <Text style={styles.ageNumber}>{childrenStats.byAgeGroup['18+']}</Text>
            <Text style={styles.ageLabel}>18+ ans</Text>
          </View>
        </View>
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
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
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderItem: {
    flex: 1,
    marginHorizontal: 8,
  },
  genderBar: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    marginBottom: 8,
  },
  genderBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  genderInfo: {
    alignItems: 'center',
  },
  genderLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  genderCount: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  ageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ageItem: {
    alignItems: 'center',
    flex: 1,
  },
  ageNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  ageLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
});
