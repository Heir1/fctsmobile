import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { childrenService } from '../../services/childrenService';
import { ChildDetail } from '../../types/child';

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Child Details</Text>
        <Text style={styles.subtitle}>{child?.full_name ?? id}</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      ) : error ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Erreur</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : child ? (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations</Text>
            <Text style={styles.row}>Nom: {child.full_name}</Text>
            <Text style={styles.row}>Genre: {child.gender}</Text>
            <Text style={styles.row}>Âge estimé: {child.estimated_age ?? 'N/A'}</Text>
            <Text style={styles.row}>Code interne: {child.internal_code ?? '—'}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nutrition</Text>
            {child.nutrition_records.length === 0 ? (
              <Text style={styles.muted}>Aucun enregistrement</Text>
            ) : (
              child.nutrition_records.map((r) => (
                <Text key={r.id} style={styles.row}>• {r.date}: BMI {r.bmi} (Poids {r.weight_kg}kg, Taille {r.height_cm}cm)</Text>
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Santé</Text>
            {child.health_records.length === 0 ? (
              <Text style={styles.muted}>Aucun enregistrement</Text>
            ) : (
              child.health_records.map((r) => (
                <Text key={r.id} style={styles.row}>• {r.date}: {r.remarks ?? '—'}</Text>
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Maladies</Text>
            {child.child_diseases.length === 0 ? (
              <Text style={styles.muted}>Aucun enregistrement</Text>
            ) : (
              child.child_diseases.map((d, idx) => (
                <Text key={idx} style={styles.row}>• {d.diseases?.name ?? '—'} ({d.severity ?? '—'})</Text>
              ))
            )}
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: 'white', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { color: '#6b7280' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorCard: { backgroundColor: '#fee2e2', margin: 16, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#ef4444' },
  errorTitle: { fontSize: 16, fontWeight: '700', color: '#991b1b', marginBottom: 4 },
  errorText: { color: '#b91c1c' },
  section: { backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 8 },
  row: { color: '#374151', marginBottom: 4 },
  muted: { color: '#9ca3af' },
});



