import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, I18nManager, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DatePickerInput } from 'react-native-paper-dates';
import { SafeAreaView } from 'react-native-safe-area-context';
import { childrenService } from '../services/childrenService';
import { ChildSummary, ChildrenListResponse } from '../types/child';

export default function ChildrenScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [childrenData, setChildrenData] = useState<ChildSummary[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<ChildSummary | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingChild, setDeletingChild] = useState<ChildSummary | null>(null);
  const [editForm, setEditForm] = useState({
    full_name: '',
    gender: 'M' as 'M' | 'F',
    estimated_age: '',
    parent_status: 'total_orphan',
    internal_code: '',
  });
  const [editBirthDate, setEditBirthDate] = useState<Date | undefined>(undefined);
  const [editEntryDate, setEditEntryDate] = useState<Date | undefined>(undefined);
  const [form, setForm] = useState({
    full_name: '',
    gender: 'M' as 'M' | 'F',
    estimated_age: '',
    parent_status: 'total_orphan',
    internal_code: '',
  });

  // react-native-paper-dates setup
  I18nManager.forceRTL(false);
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [entryDate, setEntryDate] = useState<Date | undefined>(undefined);
  const ageOptions: string[] = Array.from({ length: 19 }, (_, i) => String(i));

  // Validation function for create form
  const isFormValid = () => {
    return (
      form.full_name.trim() !== '' &&
      birthDate !== undefined &&
      form.estimated_age !== '' &&
      entryDate !== undefined
    );
  };

  // Validation function for edit form
  const isEditFormValid = () => {
    return (
      editForm.full_name.trim() !== '' &&
      editBirthDate !== undefined &&
      editForm.estimated_age !== '' &&
      editEntryDate !== undefined
    );
  };

  const loadChildren = async () => {
    try {
      setError(null);
      setLoading(true);
      const res: ChildrenListResponse = await childrenService.getAllChildren();
      setChildrenData(res.data.children);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  const renderItem = ({ item }: { item: ChildSummary }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.childName}>{item.full_name}</Text>
        <Text style={styles.childMeta}>Age estimé: {item.estimated_age ?? 'N/A'} • {item.gender === 'M' ? 'Garçon' : 'Fille'}</Text>
        <Text style={styles.childMeta}>Orphelinat: {item.orphanage?.name ?? '—'}</Text>
      </View>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push(`/children/${item.id}`)}>
          <Text style={styles.actionText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            setEditingChild(item);
            setEditForm({
              full_name: item.full_name,
              gender: item.gender,
              estimated_age: item.estimated_age ? String(item.estimated_age) : '',
              parent_status: item.parent_status || 'total_orphan',
              internal_code: item.internal_code || '',
            });
            setEditBirthDate(item.birth_date ? new Date(item.birth_date) : undefined);
            setEditEntryDate(item.entry_date ? new Date(item.entry_date) : undefined);
            setIsEditOpen(true);
          }}
        >
          <Text style={[styles.actionText, styles.editText]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => {
            setDeletingChild(item);
            setIsDeleteConfirmOpen(true);
          }}
        >
          <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Children</Text>
        <Text style={styles.subtitle}>Liste des enfants</Text>
      </View>
      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setIsCreateOpen(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      ) : error ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Erreur</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadChildren}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={childrenData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}

      {/* Create Modal */}
      <Modal visible={isCreateOpen} transparent animationType="fade" onRequestClose={() => setIsCreateOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTitle}>Ajouter un enfant</Text>
              {!!error && <Text style={styles.modalError}>{error}</Text>}

              <TextInput
                style={[styles.input, styles.field]}
                placeholder="Nom complet"
                value={form.full_name}
                onChangeText={(t) => setForm({ ...form, full_name: t })}
              />
              <View style={[styles.rowInline, styles.field]}>
                <Pressable style={[styles.segment, form.gender === 'M' && styles.segmentActive]} onPress={() => setForm({ ...form, gender: 'M' })}>
                  <Text style={[styles.segmentText, form.gender === 'M' && styles.segmentTextActive]}>Garçon</Text>
                </Pressable>
                <Pressable style={[styles.segment, form.gender === 'F' && styles.segmentActive]} onPress={() => setForm({ ...form, gender: 'F' })}>
                  <Text style={[styles.segmentText, form.gender === 'F' && styles.segmentTextActive]}>Fille</Text>
                </Pressable>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Date de naissance</Text>
                <DatePickerInput
                  value={birthDate}
                  onChange={(d) => setBirthDate(d ?? undefined)}
                  inputMode="start"
                  withModal
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Âge estimé</Text>
                <Picker selectedValue={form.estimated_age} onValueChange={(v) => setForm({ ...form, estimated_age: String(v) })}>
                  <Picker.Item label="Sélectionner l'âge" value="" />
                  {ageOptions.map((a) => (
                    <Picker.Item key={a} label={a} value={a} />
                  ))}
                </Picker>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Date d&apos;entrée</Text>
                <DatePickerInput
                  value={entryDate}
                  onChange={(d) => setEntryDate(d ?? undefined)}
                  inputMode="start"
                  withModal
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Statut parental</Text>
                <Picker selectedValue={form.parent_status} onValueChange={(v) => setForm({ ...form, parent_status: String(v) })}>
                  <Picker.Item label="Orphelin total" value="total_orphan" />
                  <Picker.Item label="Orphelin partiel" value="partial_orphan" />
                  <Picker.Item label="abandonné" value="abandoned" />
                </Picker>
              </View>
              <TextInput
                style={[styles.input, styles.field]}
                placeholder="Code interne (optionnel)"
                value={form.internal_code}
                onChangeText={(t) => setForm({ ...form, internal_code: t })}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.btn, styles.btnGhost, styles.btnHalf]} 
                  disabled={submitting} 
                  onPress={() => setIsCreateOpen(false)}
                >
                  <Text style={[styles.btnText, styles.btnGhostText]}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.btnPrimary, styles.btnHalf]}
                  disabled={submitting || !isFormValid()}
                  onPress={async () => {
                    try {
                      setSubmitting(true);
                      const formatDate = (d?: Date) => (d ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` : null);
                      const birth_date = formatDate(birthDate);
                      const entry_date = formatDate(entryDate);
                      await childrenService.createChild({
                        full_name: form.full_name.trim(),
                        gender: form.gender,
                        birth_date,
                        estimated_age: form.estimated_age ? Number(form.estimated_age) : null,
                        entry_date,
                        parent_status: form.parent_status ? form.parent_status : null,
                        internal_code: form.internal_code || undefined,
                      });
                      setIsCreateOpen(false);
                      setForm({ full_name: '', gender: 'M', estimated_age: '', parent_status: 'total_orphan', internal_code: '' });
                      setBirthDate(undefined);
                      setEntryDate(undefined);
                      await loadChildren();
                    } catch (e) {
                      setError(e instanceof Error ? e.message : 'Erreur lors de la création');
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  <Text style={styles.btnText}>{submitting ? 'Envoi...' : 'Créer'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={isEditOpen} transparent animationType="fade" onRequestClose={() => setIsEditOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTitle}>Modifier l'enfant</Text>
              {!!error && <Text style={styles.modalError}>{error}</Text>}

              <TextInput
                style={[styles.input, styles.field]}
                placeholder="Nom complet"
                value={editForm.full_name}
                onChangeText={(t) => setEditForm({ ...editForm, full_name: t })}
              />
              <View style={[styles.rowInline, styles.field]}>
                <Pressable style={[styles.segment, editForm.gender === 'M' && styles.segmentActive]} onPress={() => setEditForm({ ...editForm, gender: 'M' })}>
                  <Text style={[styles.segmentText, editForm.gender === 'M' && styles.segmentTextActive]}>Garçon</Text>
                </Pressable>
                <Pressable style={[styles.segment, editForm.gender === 'F' && styles.segmentActive]} onPress={() => setEditForm({ ...editForm, gender: 'F' })}>
                  <Text style={[styles.segmentText, editForm.gender === 'F' && styles.segmentTextActive]}>Fille</Text>
                </Pressable>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Date de naissance</Text>
                <DatePickerInput
                  value={editBirthDate}
                  onChange={(d) => setEditBirthDate(d ?? undefined)}
                  inputMode="start"
                  withModal
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Âge estimé</Text>
                <Picker selectedValue={editForm.estimated_age} onValueChange={(v) => setEditForm({ ...editForm, estimated_age: String(v) })}>
                  <Picker.Item label="Sélectionner l'âge" value="" />
                  {ageOptions.map((a) => (
                    <Picker.Item key={a} label={a} value={a} />
                  ))}
                </Picker>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Date d&apos;entrée</Text>
                <DatePickerInput
                  value={editEntryDate}
                  onChange={(d) => setEditEntryDate(d ?? undefined)}
                  inputMode="start"
                  withModal
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Statut parental</Text>
                <Picker selectedValue={editForm.parent_status} onValueChange={(v) => setEditForm({ ...editForm, parent_status: String(v) })}>
                  <Picker.Item label="Orphelin total" value="total_orphan" />
                  <Picker.Item label="Orphelin partiel" value="partial_orphan" />
                  <Picker.Item label="abandonné" value="abandoned" />
                </Picker>
              </View>
              <TextInput
                style={[styles.input, styles.field]}
                placeholder="Code interne (optionnel)"
                value={editForm.internal_code}
                onChangeText={(t) => setEditForm({ ...editForm, internal_code: t })}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.btn, styles.btnGhost, styles.btnHalf]} 
                  disabled={submitting} 
                  onPress={() => setIsEditOpen(false)}
                >
                  <Text style={[styles.btnText, styles.btnGhostText]}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.btnPrimary, styles.btnHalf]}
                  disabled={submitting || !isEditFormValid()}
                  onPress={async () => {
                    try {
                      console.log('Starting edit submission...');
                      setSubmitting(true);
                      const formatDate = (d?: Date) => (d ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` : null);
                      const birth_date = formatDate(editBirthDate);
                      const entry_date = formatDate(editEntryDate);
                      console.log('Edit data:', {
                        id: editingChild!.id,
                        full_name: editForm.full_name.trim(),
                        gender: editForm.gender,
                        birth_date,
                        estimated_age: editForm.estimated_age ? Number(editForm.estimated_age) : null,
                        entry_date,
                        parent_status: editForm.parent_status ? editForm.parent_status : null,
                        internal_code: editForm.internal_code || undefined,
                      });
                      await childrenService.updateChild(editingChild!.id, {
                        full_name: editForm.full_name.trim(),
                        gender: editForm.gender,
                        birth_date,
                        estimated_age: editForm.estimated_age ? Number(editForm.estimated_age) : null,
                        entry_date,
                        parent_status: editForm.parent_status ? editForm.parent_status : null,
                        internal_code: editForm.internal_code || undefined,
                      });
                      console.log('Edit successful!');
                      setIsEditOpen(false);
                      setEditingChild(null);
                      await loadChildren();
                    } catch (e) {
                      console.error('Edit error:', e);
                      setError(e instanceof Error ? e.message : 'Erreur lors de la modification');
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  <Text style={styles.btnText}>{submitting ? 'Envoi...' : 'Modifier'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={isDeleteConfirmOpen} transparent animationType="fade" onRequestClose={() => setIsDeleteConfirmOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalScroll}>
              <Text style={styles.modalTitle}>Confirmer la suppression</Text>
              <Text style={styles.deleteConfirmText}>
                Êtes-vous sûr de vouloir supprimer l&apos;enfant &quot;{deletingChild?.full_name}&quot; ?
              </Text>
              <Text style={styles.deleteWarningText}>
                Cette action est irréversible et supprimera définitivement toutes les données de l&apos;enfant.
              </Text>
              
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.btn, styles.btnGhost, styles.btnHalf]} 
                  disabled={submitting} 
                  onPress={() => setIsDeleteConfirmOpen(false)}
                >
                  <Text style={[styles.btnText, styles.btnGhostText]}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.btnDanger, styles.btnHalf]}
                  disabled={submitting}
                  onPress={async () => {
                    try {
                      console.log('Starting delete...');
                      setSubmitting(true);
                      await childrenService.deleteChild(deletingChild!.id);
                      console.log('Delete successful!');
                      setIsDeleteConfirmOpen(false);
                      setDeletingChild(null);
                      await loadChildren();
                    } catch (e) {
                      console.error('Delete error:', e);
                      setError(e instanceof Error ? e.message : 'Erreur lors de la suppression');
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  <Text style={styles.btnText}>{submitting ? 'Suppression...' : 'Supprimer'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: 'white', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { color: '#6b7280' },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, backgroundColor: '#0ea5e9', borderRadius: 28, justifyContent: 'center', alignItems: 'center', zIndex: 10, elevation: 5 },
  fabText: { color: 'white', fontSize: 28, fontWeight: '800', marginTop: -2 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorCard: { backgroundColor: '#fef3c7', margin: 16, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#f59e0b' },
  errorTitle: { fontSize: 16, fontWeight: '700', color: '#92400e', marginBottom: 4 },
  errorText: { color: '#b45309', marginBottom: 8 },
  retryButton: { backgroundColor: '#f59e0b', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, alignSelf: 'flex-start' },
  retryText: { color: 'white', fontWeight: '600' },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', flexDirection: 'row', alignItems: 'center' },
  childName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  childMeta: { color: '#6b7280', marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: 8, marginLeft: 8 },
  actionButton: { backgroundColor: '#eef2ff', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  actionText: { color: '#1e40af', fontWeight: '600' },
  editButton: { backgroundColor: '#ecfeff' },
  editText: { color: '#0369a1' },
  deleteButton: { backgroundColor: '#fee2e2' },
  deleteText: { color: '#b91c1c' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: 'white', borderRadius: 16, padding: 16 },
  modalScroll: { paddingBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: '#111827' },
  modalError: { color: '#b91c1c', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 10, backgroundColor: '#fff' },
  field: { marginBottom: 12 },
  rowInline: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  segment: { flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 5, paddingVertical: 10, alignItems: 'center' },
  segmentActive: { backgroundColor: '#e0f2fe', borderColor: '#38bdf8' },
  segmentText: { color: '#374151', fontWeight: '600' },
  segmentTextActive: { color: '#0369a1' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginTop: 4 },
  btn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 5, flex: 1 },
  btnHalf: { flex: 1 },
  btnPrimary: { backgroundColor: '#0ea5e9' },
  btnText: { color: 'white', fontWeight: '700', textAlign: 'center' },
  btnGhost: { backgroundColor: '#f3f4f6' },
  btnGhostText: { color: '#111827' },
  btnDanger: { backgroundColor: '#dc2626' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 4 },
  col: { marginBottom: 0 },
  deleteConfirmText: { fontSize: 16, color: '#374151', marginBottom: 10, textAlign: 'center' },
  deleteWarningText: { fontSize: 14, color: '#dc2626', marginBottom: 20, textAlign: 'center' },
});


