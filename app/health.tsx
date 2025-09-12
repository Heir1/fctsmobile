import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DatePickerInput } from 'react-native-paper-dates';
import { childrenService } from '../services/childrenService';
import { healthService } from '../services/healthService';
import { ChildSummary } from '../types/child';

// Locale registration moved to app/_layout.tsx

export default function HealthScreen() {
  
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
  const [formVaccinationStatus, setFormVaccinationStatus] = useState<string>('');
  const [formVaccinationStructured, setFormVaccinationStructured] = useState<'vaccinated' | 'partially_vaccinated' | 'not_vaccinated' | 'unknown' | ''>('');
  const [formChronic, setFormChronic] = useState<string>('');
  const [formMedications, setFormMedications] = useState<string>('');
  const [formRemarks, setFormRemarks] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [diseases, setDiseases] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedDiseases, setSelectedDiseases] = useState<Array<{ disease_id: string; severity: 'mild' | 'moderate' | 'severe' | null; notes: string | null }>>([]);
  const [loadingDiseases, setLoadingDiseases] = useState(false);

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
      const res = await healthService.listByChild(childId);
      setRecords(res.data.health_records);
    } catch (e) {
      setRecordsError(e instanceof Error ? e.message : 'Erreur de chargement des dossiers médicaux');
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  const loadDiseases = async () => {
    try {
      setLoadingDiseases(true);
      const res = await healthService.listDiseases();
      console.log('Diseases API response:', res);
      const diseasesArray = Array.isArray(res.data) ? res.data : [];
      console.log('Diseases array:', diseasesArray);
      setDiseases(diseasesArray);
    } catch (e) {
      console.error('Error loading diseases:', e);
      // soft fail, diseases optional
    } finally {
      setLoadingDiseases(false);
    }
  };

  useEffect(() => {
    if (isUpsertOpen) {
      loadDiseases();
    }
  }, [isUpsertOpen]);

  const toggleSelectedDisease = (diseaseId: string, checked: boolean) => {
    setSelectedDiseases((prev) => {
      if (checked) {
        if (prev.some((d) => d.disease_id === diseaseId)) return prev;
        return [...prev, { disease_id: diseaseId, severity: null, notes: null }];
      } else {
        return prev.filter((d) => d.disease_id !== diseaseId);
      }
    });
  };

  const updateSelectedDisease = (diseaseId: string, patch: Partial<{ severity: 'mild' | 'moderate' | 'severe' | null; notes: string | null }>) => {
    setSelectedDiseases((prev) => prev.map((d) => (d.disease_id === diseaseId ? { ...d, ...patch } : d)));
  };

  const handleSelectChild = (child: ChildSummary) => {
    setSelectedChild(child);
    loadRecords(child.id);
  };

  const openCreateModal = () => {
    setEditingRecordId(null);
    setFormDate('');
    setFormVaccinationStatus('');
    setFormChronic('');
    setFormMedications('');
    setFormRemarks('');
    setFormVaccinationStructured('');
    setSelectedDiseases([]);
    setIsUpsertOpen(true);
  };

  const openEditModal = (record: any) => {
    setEditingRecordId(record.id);
    setFormDate(record.date || '');
    setFormVaccinationStatus(record.vaccination_status || '');
    setFormChronic(record.chronic_conditions || '');
    setFormMedications(record.medications || '');
    setFormRemarks(record.remarks || '');
    setFormVaccinationStructured(record?.vaccination_status_structured?.status || '');
    setSelectedDiseases([]);
    setIsUpsertOpen(true);
  };

  const submitUpsert = async () => {
    if (!selectedChild) return;
    try {
      setSubmitting(true);
      const payload = {
        date: formDate,
        vaccination_status: formVaccinationStatus || null,
        vaccination_status_structured: formVaccinationStructured
          ? { status: formVaccinationStructured, vaccines: [], last_updated: formDate || '' }
          : undefined,
        chronic_conditions: formChronic || null,
        medications: formMedications || null,
        remarks: formRemarks || null,
        selectedDiseases: selectedDiseases.length
          ? selectedDiseases.map((d) => ({ disease_id: d.disease_id, severity: d.severity, notes: d.notes }))
          : undefined,
      } as const;
      if (editingRecordId) {
        await healthService.update(editingRecordId, payload as any);
      } else {
        await healthService.create(selectedChild.id, payload as any);
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
    Alert.alert('Supprimer', 'Supprimer ce dossier médical ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => doDelete(recordId) },
    ]);
  };

  const doDelete = async (recordId: string) => {
    if (!selectedChild) return;
    try {
      await healthService.delete(recordId);
      await loadRecords(selectedChild.id);
      Alert.alert('Supprimé', 'Dossier supprimé');
    } catch (e) {
      Alert.alert('Erreur', e instanceof Error ? e.message : 'Échec de la suppression');
    }
  };

  const openDetail = async (recordId: string) => {
    try {
      setDetailRecord(null);
      const res = await healthService.getDetail(recordId);
      setDetailRecord(res.data);
      setIsDetailOpen(true);
    } catch (e) {
      Alert.alert('Erreur', e instanceof Error ? e.message : 'Échec du chargement du détail');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health</Text>
        <Text style={styles.subtitle}>Manage health records</Text>
      </View>
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
              <Text style={styles.sectionTitle}>Health records of {selectedChild.full_name}</Text>
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
                    <Text style={styles.recordLine}>Vaccination: {item.vaccination_status || 'N/A'}</Text>
                    <Text style={styles.recordLine}>Conditions: {item.chronic_conditions || 'N/A'}</Text>
                    <Text style={styles.recordLine}>Medications: {item.medications || 'N/A'}</Text>
                    <Text style={styles.recordLine}>Remarks: {item.remarks || '—'}</Text>
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
            <Text style={styles.modalTitle}>{editingRecordId ? 'Edit health record' : 'Create health record'}</Text>

            <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>

              {/* <Text style={styles.inputLabel}>Date de consultation</Text>
              <DatePickerInput
                locale="fr"
                inputMode="start"
                withModal
                value={formDate ? new Date(formDate) : undefined}
                onChange={(d) => setFormDate(d ? d.toISOString().slice(0, 10) : '')}
                style={styles.input}
                presentationStyle="pageSheet"
              /> */}

              <View style={styles.field}>
                <Text style={styles.inputLabel}>Date de consultation</Text>
                <DatePickerInput
                  locale="fr"
                  inputMode="start"
                  withModal
                  value={formDate ? new Date(formDate) : undefined}
                  onChange={(d) => setFormDate(d ? d.toISOString().slice(0, 10) : '')}
                  // style={styles.input}
                  presentationStyle="pageSheet"
                />
              </View>
  
              <Text style={styles.inputLabel}>Vaccination status</Text>
              <TextInput 
                value={formVaccinationStatus} 
                onChangeText={setFormVaccinationStatus} 
                placeholder="À jour / Partiel / ..." 
                placeholderTextColor="#6b7280"
                style={[styles.input]} 
                multiline 
              />
  
              <Text style={styles.inputLabel}>Statut vaccinal (structuré)</Text>
              <View style={styles.selectRow}>
                {(['vaccinated','partially_vaccinated','not_vaccinated','unknown'] as const).map((opt) => (
                  <TouchableOpacity key={opt} style={[styles.selectPill, formVaccinationStructured === opt && styles.selectPillActive]} onPress={() => setFormVaccinationStructured(opt)}>
                    <Text style={[styles.selectPillText, formVaccinationStructured === opt && styles.selectPillTextActive]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
  
              <Text style={[styles.inputLabel, { marginTop: 12 }]}>Maladies diagnostiquées</Text>
              {loadingDiseases ? (
                <ActivityIndicator size="small" color="#3b82f6" />
              ) : diseases.length === 0 ? (
                <View style={styles.diseasesBox}>
                  <Text style={styles.noDiseasesText}>Aucune maladie disponible dans la base de données</Text>
                  <Text style={styles.noDiseasesSubtext}>Les maladies doivent être ajoutées par l'administrateur</Text>
                </View>
              ) : (
                <View style={styles.diseasesBox}>
                  {diseases.map((d) => {
                    const checked = selectedDiseases.some((s) => s.disease_id === d.id);
                    return (
                      <TouchableOpacity key={d.id} style={styles.checkboxRow} onPress={() => toggleSelectedDisease(d.id, !checked)}>
                        <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
                        <Text style={styles.checkboxLabel}>{d.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
  
              {selectedDiseases.length > 0 && (
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.inputLabel}>Détails des maladies sélectionnées</Text>
                  {selectedDiseases.map((sd) => {
                    const disease = diseases.find((d) => d.id === sd.disease_id);
                    return (
                      <View key={sd.disease_id} style={styles.selectedDiseaseCard}>
                        <Text style={styles.selectedDiseaseTitle}>{disease?.name}</Text>
                        <View style={styles.selectRow}>
                          {(['mild','moderate','severe'] as const).map((opt) => (
                            <TouchableOpacity key={opt} style={[styles.selectPill, sd.severity === opt && styles.selectPillActive]} onPress={() => updateSelectedDisease(sd.disease_id, { severity: opt })}>
                              <Text style={[styles.selectPillText, sd.severity === opt && styles.selectPillTextActive]}>{opt}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        <TextInput
                          placeholder="Notes"
                          placeholderTextColor="#6b7280"
                          value={sd.notes || ''}
                          onChangeText={(t) => updateSelectedDisease(sd.disease_id, { notes: t })}
                          style={[styles.input, { marginTop: 8 }]}
                        />
                      </View>
                    );
                  })}
                </View>
              )}
  
              <Text style={styles.inputLabel}>Chronic conditions</Text>
              <TextInput 
                value={formChronic} 
                onChangeText={setFormChronic} 
                placeholder="Asthme léger..." 
                placeholderTextColor="#6b7280"
                style={styles.input} 
              />
  
              <Text style={styles.inputLabel}>Medications</Text>
              <TextInput 
                value={formMedications} 
                onChangeText={setFormMedications} 
                placeholder="Ventoline..." 
                placeholderTextColor="#6b7280"
                style={styles.input} 
              />
  
              <Text style={styles.inputLabel}>Remarks</Text>
              <TextInput 
                value={formRemarks} 
                onChangeText={setFormRemarks} 
                placeholder="Notes..." 
                placeholderTextColor="#6b7280"
                style={[styles.input, { height: 80 }]} 
                multiline 
              />
  
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
            <Text style={styles.modalTitle}>Health record details</Text>
            <ScrollView>
              {detailRecord ? (
                <View>
                  <Text style={styles.recordLine}>Date: {detailRecord.date}</Text>
                  <Text style={styles.recordLine}>Vaccination: {detailRecord.vaccination_status || 'N/A'}</Text>
                  <Text style={styles.recordLine}>Chronic: {detailRecord.chronic_conditions || 'N/A'}</Text>
                  <Text style={styles.recordLine}>Medications: {detailRecord.medications || 'N/A'}</Text>
                  <Text style={styles.recordLine}>Remarks: {detailRecord.remarks || '—'}</Text>
                  {!!detailRecord.diseases?.length && (
                    <View style={{ marginTop: 8 }}>
                      <Text style={styles.recordDate}>Diseases</Text>
                      {detailRecord.diseases.map((d: any) => (
                        <Text key={d.id} style={styles.recordLine}>• {d.disease_name} ({d.severity || 'n/a'})</Text>
                      ))}
                    </View>
                  )}
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
    backgroundColor: '#111827',
  },
  header: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  field: {
    marginBottom: 16
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f9fafb',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#9ca3af',
    marginTop: 6,
    fontSize: 14,
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
    backgroundColor: '#374151',
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
  diseasesBox: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    backgroundColor: '#111827',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#6b7280',
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkboxLabel: {
    color: '#e5e7eb',
    fontSize: 14,
  },
  selectedDiseaseCard: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    backgroundColor: '#111827',
  },
  selectedDiseaseTitle: {
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 8,
    fontSize: 15,
  },
  noDiseasesText: {
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  noDiseasesSubtext: {
    color: '#6b7280',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 6,
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
