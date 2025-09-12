import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { childrenService } from '../../services/childrenService';
import { ChildDetail } from '../../types/child';
import { Ionicons } from '@expo/vector-icons';

export default function ChildDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [child, setChild] = useState<ChildDetail | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        setLoading(true);
        const data = await childrenService.getChildById(String(id));
        setChild(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  // return (
  //   <SafeAreaView style={styles.container}>
  //     <View style={styles.header}>
  //       <Text style={styles.title}>Child Details</Text>
  //       <Text style={styles.subtitle}>{child?.full_name ?? id}</Text>
  //     </View>
  //     {loading ? (
  //       <View style={styles.loadingContainer}>
  //         <ActivityIndicator size="large" color="#0ea5e9" />
  //       </View>
  //     ) : error ? (
  //       <View style={styles.errorCard}>
  //         <Text style={styles.errorTitle}>Erreur</Text>
  //         <Text style={styles.errorText}>{error}</Text>
  //       </View>
  //     ) : child ? (
  //       <ScrollView contentContainerStyle={{ padding: 16 }}>
  //         <View style={styles.section}>
  //           <Text style={styles.sectionTitle}>Informations</Text>
  //           <Text style={styles.row}>Nom: {child.full_name}</Text>
  //           <Text style={styles.row}>Genre: {child.gender}</Text>
  //           <Text style={styles.row}>Âge estimé: {child.estimated_age ?? 'N/A'}</Text>
  //           <Text style={styles.row}>Code interne: {child.internal_code ?? '—'}</Text>
  //         </View>

  //         <View style={styles.section}>
  //           <Text style={styles.sectionTitle}>Nutrition</Text>
  //           {child.nutrition_records.length === 0 ? (
  //             <Text style={styles.muted}>Aucun enregistrement</Text>
  //           ) : (
  //             child.nutrition_records.map((r) => (
  //               <Text key={r.id} style={styles.row}>• {r.date}: BMI {r.bmi} (Poids {r.weight_kg}kg, Taille {r.height_cm}cm)</Text>
  //             ))
  //           )}
  //         </View>

  //         <View style={styles.section}>
  //           <Text style={styles.sectionTitle}>Santé</Text>
  //           {child.health_records.length === 0 ? (
  //             <Text style={styles.muted}>Aucun enregistrement</Text>
  //           ) : (
  //             child.health_records.map((r) => (
  //               <Text key={r.id} style={styles.row}>• {r.date}: {r.remarks ?? '—'}</Text>
  //             ))
  //           )}
  //         </View>

  //         <View style={styles.section}>
  //           <Text style={styles.sectionTitle}>Maladies</Text>
  //           {child.child_diseases.length === 0 ? (
  //             <Text style={styles.muted}>Aucun enregistrement</Text>
  //           ) : (
  //             child.child_diseases.map((d, idx) => (
  //               <Text key={idx} style={styles.row}>• {d.diseases?.name ?? '—'} ({d.severity ?? '—'})</Text>
  //             ))
  //           )}
  //         </View>
  //       </ScrollView>
  //     ) : null}
  //   </SafeAreaView>
  // );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Détails de l'enfant</Text>
          <Text style={styles.subtitle}>{child?.full_name ?? id}</Text>
        </View>
        <View style={styles.avatarPlaceholder}>
          <Ionicons 
            name={child?.gender === 'M' ? 'male' : 'female'} 
            size={28} 
            color={child?.gender === 'M' ? '#60A5FA' : '#F472B6'} 
          />
        </View>
      </View>
      
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#A78BFA" />
          <Text style={styles.loadingText}>Chargement des détails...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorCard}>
          <Ionicons name="alert-circle-outline" size={32} color="#F87171" />
          <Text style={styles.errorTitle}>Erreur de chargement</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} >
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : child ? (
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Carte Informations Personnelles */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={20} color="#A78BFA" />
              <Text style={styles.sectionTitle}>Informations Personnelles</Text>
            </View>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Nom complet</Text>
                <Text style={styles.infoValue}>{child.full_name}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Genre</Text>
                <View style={styles.genderBadge}>
                  <Text style={[styles.genderText, child.gender === 'M' ? styles.maleText : styles.femaleText]}>
                    {child.gender === 'M' ? 'Garçon' : 'Fille'}
                  </Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Âge estimé</Text>
                <Text style={styles.infoValue}>{child.estimated_age ?? 'N/A'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Code interne</Text>
                <Text style={styles.infoValue}>{child.internal_code || '—'}</Text>
              </View>
            </View>
          </View>
  
          {/* Carte Nutrition */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="nutrition-outline" size={20} color="#FBBF24" />
              <Text style={styles.sectionTitle}>Nutrition</Text>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add-circle" size={22} color="#A78BFA" />
              </TouchableOpacity>
            </View>
            {child.nutrition_records.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="fast-food-outline" size={32} color="#4B5563" />
                <Text style={styles.emptyText}>Aucun enregistrement nutritionnel</Text>
              </View>
            ) : (
              <View style={styles.recordsList}>
                {child.nutrition_records.slice(0, 3).map((r) => (
                  <View key={r.id} style={styles.recordItem}>
                    <View style={styles.recordHeader}>
                      <Text style={styles.recordDate}>{new Date(r.date).toLocaleDateString('fr-FR')}</Text>
                      <View style={styles.bmiBadge}>
                        <Text style={styles.bmiText}>BMI: {r.bmi}</Text>
                      </View>
                    </View>
                    <View style={styles.recordDetails}>
                      <Text style={styles.recordDetail}>Poids: {r.weight_kg}kg</Text>
                      <Text style={styles.recordDetail}>Taille: {r.height_cm}cm</Text>
                    </View>
                  </View>
                ))}
                {child.nutrition_records.length > 3 && (
                  <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>Voir tous ({child.nutrition_records.length})</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
  
          {/* Carte Santé */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="medkit-outline" size={20} color="#34D399" />
              <Text style={styles.sectionTitle}>Santé</Text>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add-circle" size={22} color="#A78BFA" />
              </TouchableOpacity>
            </View>
            {child.health_records.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="medical-outline" size={32} color="#4B5563" />
                <Text style={styles.emptyText}>Aucun enregistrement de santé</Text>
              </View>
            ) : (
              <View style={styles.recordsList}>
                {child.health_records.slice(0, 3).map((r) => (
                  <View key={r.id} style={styles.recordItem}>
                    <Text style={styles.recordDate}>{new Date(r.date).toLocaleDateString('fr-FR')}</Text>
                    <Text style={styles.recordRemarks} numberOfLines={2}>
                      {r.remarks || 'Aucune remarque'}
                    </Text>
                  </View>
                ))}
                {child.health_records.length > 3 && (
                  <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>Voir tous ({child.health_records.length})</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
  
          {/* Carte Maladies */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="alert-circle-outline" size={20} color="#F87171" />
              <Text style={styles.sectionTitle}>Maladies</Text>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add-circle" size={22} color="#A78BFA" />
              </TouchableOpacity>
            </View>
            {child.child_diseases.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="heart-outline" size={32} color="#4B5563" />
                <Text style={styles.emptyText}>Aucune maladie enregistrée</Text>
              </View>
            ) : (
              <View style={styles.diseasesList}>
                {child.child_diseases.map((d, idx) => (
                  <View key={idx} style={styles.diseaseItem}>
                    <Text style={styles.diseaseName}>{d.diseases?.name || 'Maladie non spécifiée'}</Text>
                    {d.severity && (
                      <View style={[styles.severityBadge, 
                        d.severity === 'léger' ? styles.severityLow :
                        d.severity === 'modéré' ? styles.severityMedium :
                        styles.severityHigh
                      ]}>
                        <Text style={styles.severityText}>{d.severity}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  )

}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#111827' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151'
  },
  headerContent: {
    flex: 1,
  },
  title: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#F9FAFB',
    marginBottom: 4
  },
  subtitle: { 
    color: '#A78BFA', 
    fontSize: 16,
    fontWeight: '600'
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: {
    marginTop: 12,
    color: '#9CA3AF',
    fontSize: 16
  },
  errorCard: { 
    backgroundColor: '#1F2937', 
    margin: 20, 
    padding: 24, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#F87171',
    alignItems: 'center'
  },
  errorTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#F87171', 
    marginTop: 12,
    marginBottom: 8 
  },
  errorText: { 
    color: '#FCA5A5', 
    marginBottom: 16,
    textAlign: 'center'
  },
  retryButton: { 
    backgroundColor: '#DC2626', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 8
  },
  retryText: { 
    color: 'white', 
    fontWeight: '600' 
  },
  scrollContent: { 
    padding: 16 
  },
  section: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    paddingBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F9FAFB',
    marginLeft: 10
  },
  addButton: {
    marginLeft: 'auto'
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  infoItem: {
    width: '48%',
    marginBottom: 16
  },
  infoLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
    fontWeight: '600'
  },
  infoValue: {
    fontSize: 16,
    color: '#F9FAFB',
    fontWeight: '500'
  },
  genderBadge: {
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start'
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600'
  },
  maleText: {
    color: '#60A5FA'
  },
  femaleText: {
    color: '#F472B6'
  },
  emptyState: {
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center'
  },
  recordsList: {
    gap: 12
  },
  recordItem: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151'
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  recordDate: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500'
  },
  bmiBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  bmiText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '600'
  },
  recordDetails: {
    flexDirection: 'row',
    gap: 16
  },
  recordDetail: {
    color: '#D1D5DB',
    fontSize: 14
  },
  recordRemarks: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20
  },
  viewAllButton: {
    alignItems: 'center',
    padding: 12,
    marginTop: 8
  },
  viewAllText: {
    color: '#A78BFA',
    fontWeight: '600'
  },
  diseasesList: {
    gap: 12
  },
  diseaseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151'
  },
  diseaseName: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '500'
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  severityLow: {
    backgroundColor: 'rgba(52, 211, 153, 0.1)'
  },
  severityMedium: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)'
  },
  severityHigh: {
    backgroundColor: 'rgba(248, 113, 113, 0.1)'
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600'
  },
});

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f9fafb' },
//   header: { backgroundColor: 'white', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
//   title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
//   subtitle: { color: '#6b7280' },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   errorCard: { backgroundColor: '#fee2e2', margin: 16, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#ef4444' },
//   errorTitle: { fontSize: 16, fontWeight: '700', color: '#991b1b', marginBottom: 4 },
//   errorText: { color: '#b91c1c' },
//   section: { backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 12 },
//   sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 8 },
//   row: { color: '#374151', marginBottom: 4 },
//   muted: { color: '#9ca3af' },
// });



