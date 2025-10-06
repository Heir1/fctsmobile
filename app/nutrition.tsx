import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DatePickerInput } from 'react-native-paper-dates';
import UnifiedHeader from '../components/UnifiedHeader';
import { childrenService } from '../services/childrenService';
import { nutritionService } from '../services/nutritionService';
import { ChildSummary } from '../types/child';

// Locale registration moved to app/_layout.tsx

export default function NutritionScreen() {
  const [children, setChildren] = useState<ChildSummary[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [childrenError, setChildrenError] = useState<string | null>(null);
  const [selectedChild, setSelectedChild] = useState<ChildSummary | null>(null);

  const [records, setRecords] = useState<any[] | null>(null);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [recordsError, setRecordsError] = useState<string | null>(null);

  const [isUpsertOpen, setIsUpsertOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [detailRecord, setDetailRecord] = useState<any | null>(null);

  // form state
  const [formDate, setFormDate] = useState('');
  const [formWeight, setFormWeight] = useState<string>('');
  const [formHeight, setFormHeight] = useState<string>('');
  const [formStatus, setFormStatus] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const nutritionStatusOptions = [
    { value: 'severely_malnourished', label: 'Malnutrition sévère' },
    { value: 'malnourished', label: 'Malnutrition modérée' },
    { value: 'normal', label: 'Normal' },
  ];

  const loadChildren = async () => {
    try {
      setChildrenError(null);
      setLoadingChildren(true);
      const res = await childrenService.getAllChildren();
      setChildren(res.data.children);
    } catch (e) {
      setChildrenError(e instanceof Error ? e.message : 'Erreur de chargement des enfants');
    } finally {
      setLoadingChildren(false);
    }
  };

  const loadRecords = async (childId: string) => {
    try {
      setRecordsError(null);
      setLoadingRecords(true);
      const res = await nutritionService.listByChild(childId);
      setRecords(res.data.records);
    } catch (e) {
      setRecordsError(e instanceof Error ? e.message : 'Erreur de chargement des dossiers');
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  const handleSelectChild = (child: ChildSummary) => {
    setSelectedChild(child);
    loadRecords(child.id);
  };

  const openCreateModal = () => {
    setEditingRecordId(null);
    setFormDate('');
    setFormWeight('');
    setFormHeight('');
    setFormStatus('');
    setIsUpsertOpen(true);
  };

  const openEditModal = (record: any) => {
    setEditingRecordId(record.id);
    setFormDate(record.date || '');
    setFormWeight(String(record.weight_kg ?? ''));
    setFormHeight(String(record.height_cm ?? ''));
    setFormStatus(record.nutrition_status || '');
    setIsUpsertOpen(true);
  };

  const submitUpsert = async () => {
    if (!selectedChild) return;
    try {
      setSubmitting(true);
      // Basic validation and formatting
      const weight = Number(formWeight);
      const height = Number(formHeight);
      const dateIso = formDate ? `${formDate}T00:00:00.000Z` : '';
      if (!dateIso) throw new Error('La date est requise');
      if (!isFinite(weight) || weight <= 0) throw new Error('Poids invalide');
      if (!isFinite(height) || height <= 0) throw new Error('Taille invalide');
      if (!formStatus) throw new Error('Statut nutritionnel requis');

      const payload = {
        date: dateIso,
        weight_kg: weight,
        height_cm: height,
        nutrition_status: formStatus,
      } as const;
      if (editingRecordId) {
        await nutritionService.update(editingRecordId, payload as any);
      } else {
        await nutritionService.create(selectedChild.id, payload as any);
      }
      setIsUpsertOpen(false);
      await loadRecords(selectedChild.id);
      Alert.alert('Succès', editingRecordId ? 'Dossier mis à jour' : 'Dossier créé');
    } catch (e) {
      Alert.alert('Erreur', e instanceof Error ? e.message : 'Échec de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (recordId: string) => {
    Alert.alert('Supprimer', 'Supprimer ce dossier ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => doDelete(recordId) },
    ]);
  };

  const doDelete = async (recordId: string) => {
    if (!selectedChild) return;
    try {
      await nutritionService.delete(recordId);
      await loadRecords(selectedChild.id);
      Alert.alert('Supprimé', 'Dossier supprimé');
    } catch (e) {
      Alert.alert('Erreur', e instanceof Error ? e.message : 'Échec de la suppression');
    }
  };

  const openDetail = async (recordId: string) => {
    try {
      setDetailRecord(null);
      const res = await nutritionService.getDetail(recordId);
      setDetailRecord(res.data);
      setIsDetailOpen(true);
    } catch (e) {
      Alert.alert('Erreur', e instanceof Error ? e.message : 'Échec du chargement du détail');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <UnifiedHeader
        title="Nutrition"
        subtitle="Manage nutrition records"
        showRefresh={false}
        showMenu={false}
      />
      <View style={styles.content}>
        {!selectedChild && (
          <View style={{ flex: 1, width: '100%' }}>
            <Text style={styles.sectionTitle}>Select a child</Text>
            {loadingChildren ? (
              <View style={styles.centered}> 
                <ActivityIndicator size="large" color="#3b82f6" />
              </View>
            ) : childrenError ? (
              <Text style={styles.errorText}>{childrenError}</Text>
            ) : (
              <FlatList
                data={children}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.childCard} onPress={() => handleSelectChild(item)}>
                    <Text style={styles.childName}>{item.full_name}</Text>
                    <Text style={styles.childMeta}>{item.estimated_age ? `${item.estimated_age} yrs` : 'Age N/A'} • {item.gender}</Text>
                    <Text style={styles.childMetaSmall}>{item.orphanage?.name || '—'}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        )}
  
        {selectedChild && (
          <View style={{ flex: 1, width: '100%' }}>
            <View style={styles.childHeader}>
              <Text style={styles.sectionTitle}>Nutrition records of {selectedChild.full_name}</Text>
              <TouchableOpacity onPress={() => setSelectedChild(null)} style={styles.backBtn}>
                <Text style={styles.backBtnText}>← Change child</Text>
              </TouchableOpacity>
            </View>
            {loadingRecords ? (
              <View style={styles.centered}>
                <ActivityIndicator size="large" color="#3b82f6" />
              </View>
            ) : recordsError ? (
              <Text style={styles.errorText}>{recordsError}</Text>
            ) : (
              <FlatList
                data={records || []}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
                ListEmptyComponent={<Text style={styles.placeholder}>No records yet</Text>}
                renderItem={({ item }) => (
                  <View style={styles.recordCard}>
                    <Text style={styles.recordDate}>{item.date}</Text>
                    <Text style={styles.recordLine}>Poids: {item.weight_kg ?? '—'} kg</Text>
                    <Text style={styles.recordLine}>Taille: {item.height_cm ?? '—'} cm</Text>
                    <Text style={styles.recordLine}>BMI: {item.bmi ?? '—'}</Text>
                    <Text style={styles.recordLine}>Statut: {item.nutrition_status || '—'}</Text>
                    <View style={styles.recordActions}>
                      <TouchableOpacity onPress={() => openDetail(item.id)} style={[styles.actionBtn, styles.viewButton]}>
                        <Text style={styles.actionBtnText}>Details</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => openEditModal(item)} style={[styles.actionBtn, styles.editButton]}>
                        <Text style={styles.actionBtnText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => confirmDelete(item.id)} style={[styles.actionBtn, styles.deleteButton]}>
                        <Text style={[styles.actionBtnText, styles.deleteBtnText]}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        )}
      </View>
  
      {selectedChild && (
        <TouchableOpacity style={styles.fab} onPress={openCreateModal}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
  
      {/* Upsert Modal */}
      <Modal visible={isUpsertOpen} transparent animationType="slide" onRequestClose={() => setIsUpsertOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingRecordId ? 'Edit nutrition record' : 'Create nutrition record'}</Text>
            <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
              <View style={styles.field}>
                <Text style={styles.inputLabel}>Date</Text>
                <DatePickerInput
                  locale="fr"
                  inputMode="start"
                  withModal
                  value={formDate ? new Date(formDate) : undefined}
                  onChange={(d) => setFormDate(d ? d.toISOString().slice(0, 10) : '')}
                  presentationStyle="pageSheet"
                />
              </View>
  
              <Text style={styles.inputLabel}>Poids (kg)</Text>
              <TextInput 
                value={formWeight} 
                onChangeText={setFormWeight} 
                placeholder="25.5" 
                placeholderTextColor="#6b7280"
                keyboardType="numeric" 
                style={styles.input} 
              />
  
              <Text style={styles.inputLabel}>Taille (cm)</Text>
              <TextInput 
                value={formHeight} 
                onChangeText={setFormHeight} 
                placeholder="120.5" 
                placeholderTextColor="#6b7280"
                keyboardType="numeric" 
                style={styles.input} 
              />
  
              <Text style={styles.inputLabel}>Statut nutritionnel</Text>
              <View style={styles.selectRow}>
                {nutritionStatusOptions.map((opt) => (
                  <TouchableOpacity key={opt.value} style={[styles.selectPill, formStatus === opt.value && styles.selectPillActive]} onPress={() => setFormStatus(opt.value)}>
                    <Text style={[styles.selectPillText, formStatus === opt.value && styles.selectPillTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
  
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setIsUpsertOpen(false)} style={[styles.modalBtn, styles.cancelBtn]} disabled={submitting}>
                  <Text style={[styles.modalBtnText, styles.cancelBtnText]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={submitUpsert} style={[styles.modalBtn, styles.saveBtn]} disabled={submitting}>
                  <Text style={[styles.modalBtnText, styles.saveBtnText]}>{submitting ? 'Saving...' : 'Save'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
  
      {/* Detail Modal */}
      <Modal visible={isDetailOpen} transparent animationType="fade" onRequestClose={() => setIsDetailOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nutrition record details</Text>
            <ScrollView>
              {detailRecord ? (
                <View>
                  <Text style={styles.recordLine}>Date: {detailRecord.date}</Text>
                  <Text style={styles.recordLine}>Poids: {detailRecord.weight_kg} kg</Text>
                  <Text style={styles.recordLine}>Taille: {detailRecord.height_cm} cm</Text>
                  <Text style={styles.recordLine}>BMI: {detailRecord.bmi}</Text>
                  <Text style={styles.recordLine}>Interprétation: {detailRecord.bmi_interpretation || '—'}</Text>
                  <Text style={styles.recordLine}>Statut: {detailRecord.nutrition_status}</Text>
                </View>
              ) : (
                <ActivityIndicator size="small" color="#3b82f6" />
              )}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setIsDetailOpen(false)} style={[styles.modalBtn, styles.saveBtn]}>
                <Text style={[styles.modalBtnText, styles.saveBtnText]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  field: {
    marginBottom: 16
  },
  content: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: '#111827',
  },
  placeholder: {
    color: '#6b7280',
    textAlign: 'center',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f9fafb',
    paddingHorizontal: 20,
    marginVertical: 16,
    letterSpacing: 0.3,
  },
  childCard: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  childName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 6,
  },
  childMeta: {
    color: '#d1d5db',
    fontSize: 14,
  },
  childMetaSmall: {
    color: '#9ca3af',
    marginTop: 4,
    fontSize: 12,
  },
  childHeader: {
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 12,
  },
  backBtn: {
    marginTop: 8,
    padding: 8,
  },
  backBtnText: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 14,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordCard: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recordDate: {
    fontWeight: '700',
    marginBottom: 8,
    color: '#f9fafb',
    fontSize: 16,
  },
  recordLine: {
    color: '#e5e7eb',
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
  recordActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#f9fafb',
    fontWeight: '600',
    fontSize: 12,
  },
  viewButton: {
    backgroundColor: '#3B82F6',
  },
  editButton: {
    backgroundColor: '#F59E0B',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  deleteBtnText: {
    color: '#fecaca',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '300',
    marginTop: -2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#1f2937',
    borderRadius: 20,
    padding: 24,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: '#374151',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontWeight: '600',
    color: '#e5e7eb',
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#111827',
    color: '#f9fafb',
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  modalBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#374151',
  },
  cancelBtnText: {
    color: '#f9fafb',
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#3b82f6',
  },
  saveBtnText: {
    color: 'white',
    fontWeight: '700',
  },
  selectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  selectPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  selectPillActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#3b82f6',
  },
  selectPillText: {
    color: '#d1d5db',
    fontWeight: '600',
    fontSize: 12,
  },
  selectPillTextActive: {
    color: '#ffffff',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    padding: 20,
    fontSize: 14,
  },
  modalBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
});


