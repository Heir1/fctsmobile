import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, I18nManager, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DatePickerInput } from 'react-native-paper-dates';
import { SafeAreaView } from 'react-native-safe-area-context';
import UnifiedHeader from '../components/UnifiedHeader';
import { childrenService } from '../services/childrenService';
import { ChildSummary, ChildrenListResponse } from '../types/child';

const { width } = Dimensions.get('window');

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
      <View style={styles.cardHeader}>
        <View style={[styles.avatarContainer, item.gender === 'M' ? styles.avatarMale : styles.avatarFemale]}>
          <Ionicons 
            name={item.gender === 'M' ? 'male' : 'female'} 
            size={24} 
            color={item.gender === 'M' ? '#60A5FA' : '#F472B6'} 
          />
        </View>
        <View style={styles.childInfo}>
          <Text style={styles.childName}>{item.full_name}</Text>
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color="#9CA3AF" />
              <Text style={styles.childMeta}>Âge: {item.estimated_age ?? 'N/A'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="business-outline" size={14} color="#9CA3AF" />
              <Text style={styles.childMeta}>{item.orphanage?.name ?? '—'}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.actionsRow}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => router.push({ pathname: '/children/[id]', params: { id: item.id } })}
        >
          {/* <Ionicons name="eye-outline" size={16} color="white" /> */}
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
          {/* <Ionicons name="create-outline" size={16} color="white" /> */}
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => {
            setDeletingChild(item);
            setIsDeleteConfirmOpen(true);
          }}
        >
          {/* <Ionicons name="trash-outline" size={16} color="white" /> */}
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <UnifiedHeader
        title="Children"
        subtitle="Registered children list"
        showRefresh={false}
        showMenu={false}
      />
      
      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setIsCreateOpen(true)}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
      
      {

          loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#A78BFA" />
              <Text style={styles.loadingText}>Chargement des enfants...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorCard}>
              <Ionicons name="alert-circle-outline" size={32} color="#F87171" />
              <Text style={styles.errorTitle}>Erreur de chargement</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadChildren}>
                <Text style={styles.retryText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          ) : childrenData.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={64} color="#4B5563" />
              <Text style={styles.emptyTitle}>Aucun enfant enregistré</Text>
              <Text style={styles.emptyText}>Commencez par ajouter un enfant à la liste</Text>
              <TouchableOpacity style={styles.addFirstButton} onPress={() => setIsCreateOpen(true)}>
                <Text style={styles.addFirstText}>Ajouter un enfant</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={childrenData}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              showsVerticalScrollIndicator={false}
            />
          )
        }  
  
      {/* Modals avec dark mode */}
      <Modal visible={isCreateOpen} transparent animationType="fade" onRequestClose={() => setIsCreateOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTitle}>Ajouter un enfant</Text>
              {!!error && <Text style={styles.modalError}>{error}</Text>}
  
              <TextInput
                style={[styles.input, styles.field]}
                placeholder="Nom complet"
                placeholderTextColor="#9CA3AF"
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
                  locale="fr"
                  withModal
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Âge estimé</Text>
                <Picker 
                  selectedValue={form.estimated_age} 
                  onValueChange={(v) => setForm({ ...form, estimated_age: String(v) })}
                  style={styles.picker}
                  dropdownIconColor="#9CA3AF"
                >
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
                  locale="fr"
                  withModal
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Statut parental</Text>
                <Picker 
                  selectedValue={form.parent_status} 
                  onValueChange={(v) => setForm({ ...form, parent_status: String(v) })}
                  style={styles.picker}
                  dropdownIconColor="#9CA3AF"
                >
                  <Picker.Item label="Orphelin total" value="total_orphan" />
                  <Picker.Item label="Orphelin partiel" value="partial_orphan" />
                  <Picker.Item label="abandonné" value="abandoned" />
                </Picker>
              </View>
              <TextInput
                style={[styles.input, styles.field]}
                placeholder="Code interne (optionnel)"
                placeholderTextColor="#9CA3AF"
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

      {/* Edit modal */}

      <Modal visible={isEditOpen} transparent animationType="fade" onRequestClose={() => setIsEditOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTitle}>Modifier l'enfant</Text>
              {!!error && <Text style={styles.modalError}>{error}</Text>}

              <TextInput
                style={[styles.input, styles.field]}
                placeholder="Nom complet"
                placeholderTextColor="#9CA3AF"
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
                  locale="fr"
                  withModal
                />
              </View>
              
              <View style={styles.field}>
                <Text style={styles.label}>Âge estimé</Text>
                <Picker 
                  selectedValue={editForm.estimated_age} 
                  onValueChange={(v) => setEditForm({ ...editForm, estimated_age: String(v) })}
                  style={styles.picker}
                  dropdownIconColor="#9CA3AF"
                >
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
                  locale="fr"
                  withModal
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Statut parental</Text>
                <Picker 
                  selectedValue={editForm.parent_status} 
                  onValueChange={(v) => setEditForm({ ...editForm, parent_status: String(v) })}
                  style={styles.picker}
                  dropdownIconColor="#9CA3AF"
                >
                  <Picker.Item label="Orphelin total" value="total_orphan" />
                  <Picker.Item label="Orphelin partiel" value="partial_orphan" />
                  <Picker.Item label="abandonné" value="abandoned" />
                </Picker>
              </View>
              <TextInput
                style={[styles.input, styles.field]}
                placeholder="Code interne (optionnel)"
                placeholderTextColor="#9CA3AF"
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
    container: { 
      flex: 1, 
      backgroundColor: '#0f172a' 
    },
    fab: { 
      position: 'absolute', 
      right: 20, 
      bottom: 20, 
      width: 60, 
      height: 60, 
      backgroundColor: '#8B5CF6', 
      borderRadius: 30, 
      justifyContent: 'center', 
      alignItems: 'center', 
      zIndex: 10, 
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
    },
    centerContainer: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    loadingText: {
      marginTop: 12,
      color: '#9CA3AF'
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
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#E5E7EB',
      marginTop: 16
    },
    emptyText: {
      color: '#9CA3AF',
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 24
    },
    addFirstButton: {
      backgroundColor: '#8B5CF6',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8
    },
    addFirstText: {
      color: 'white',
      fontWeight: '600'
    },
    listContent: { 
      padding: 16 
    },
    separator: { 
      height: 12 
    },
    card: {
      backgroundColor: '#1F2937',
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 3,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16
    },
    avatarContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12
    },
    avatarMale: {
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
    },
    avatarFemale: {
      backgroundColor: 'rgba(236, 72, 153, 0.2)',
    },
    childInfo: {
      flex: 1
    },
    childName: { 
      fontSize: 16, 
      fontWeight: '700', 
      color: '#F9FAFB',
      marginBottom: 4
    },
    metaContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
      marginBottom: 4
    },
    childMeta: { 
      color: '#9CA3AF', 
      fontSize: 13,
      marginLeft: 4
    },
    actionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 4,
      paddingVertical: 6,
      borderRadius: 8,
      gap: 6
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
    actionText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 12,
    },
    // Styles pour les modals en dark mode
    modalOverlay: { 
      flex: 1, 
      backgroundColor: 'rgba(0,0,0,0.7)', 
      justifyContent: 'center', 
      padding: 20 
    },
    modalCard: { 
      backgroundColor: '#1F2937', 
      borderRadius: 16, 
      maxHeight: '80%' 
    },
    modalScroll: { 
      padding: 20 
    },
    modalTitle: { 
      fontSize: 20, 
      fontWeight: '700', 
      marginBottom: 16, 
      color: '#F9FAFB' 
    },
    modalError: {
      color: '#FCA5A5',
      marginBottom: 16,
      textAlign: 'center'
    },
    input: {
      borderWidth: 1,
      borderColor: '#374151',
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: '#111827',
      color: '#F9FAFB',
      fontSize: 16
    },
    field: {
      marginBottom: 16
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: '#D1D5DB',
      marginBottom: 8
    },
    rowInline: {
      flexDirection: 'row',
      gap: 8
    },
    segment: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#374151',
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
      backgroundColor: '#111827'
    },
    segmentActive: {
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      borderColor: '#8B5CF6'
    },
    segmentText: {
      color: '#9CA3AF',
      fontWeight: '600'
    },
    segmentTextActive: {
      color: '#8B5CF6'
    },
    picker: {
      color: '#F9FAFB',
      backgroundColor: '#111827',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#374151'
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
      marginTop: 8
    },
    btn: {
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center'
    },
    btnHalf: {
      flex: 1
    },
    btnPrimary: {
      backgroundColor: '#8B5CF6'
    },
    btnGhost: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#374151'
    },
    btnDanger: {
      backgroundColor: '#DC2626'
    },
    btnText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 16
    },
    btnGhostText: {
      color: '#9CA3AF'
    },
    deleteConfirmText: {
      fontSize: 16,
      color: '#E5E7EB',
      marginBottom: 12,
      textAlign: 'center'
    },
    deleteWarningText: {
      fontSize: 14,
      color: '#F87171',
      marginBottom: 24,
      textAlign: 'center'
    }
  });
