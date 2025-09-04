import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OrphanageInfo } from '../types/orphanage';

interface Props {
  orphanageInfo: OrphanageInfo;
}

export default function OrphanageProfileCard({ orphanageInfo }: Props) {
  const handleCall = () => {
    if (orphanageInfo.phone) {
      Linking.openURL(`tel:${orphanageInfo.phone}`);
    }
  };

  const handleEmail = () => {
    if (orphanageInfo.email) {
      Linking.openURL(`mailto:${orphanageInfo.email}`);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Informations de l'Orphelinat</Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Nom:</Text>
        <Text style={styles.value}>{orphanageInfo.name}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Localisation:</Text>
        <Text style={styles.value}>{orphanageInfo.city}, {orphanageInfo.province}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Adresse:</Text>
        <Text style={styles.value}>{orphanageInfo.address}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Contact:</Text>
        <Text style={styles.value}>{orphanageInfo.contact_person}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Téléphone:</Text>
        <TouchableOpacity onPress={handleCall} style={styles.linkContainer}>
          <Text style={styles.linkText}>{orphanageInfo.phone}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Email:</Text>
        <TouchableOpacity onPress={handleEmail} style={styles.linkContainer}>
          <Text style={styles.linkText}>{orphanageInfo.email}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Statut Légal:</Text>
        <Text style={styles.value}>{orphanageInfo.legal_status}</Text>
      </View>
      
      <View style={styles.capacitySection}>
        <Text style={styles.sectionTitle}>Capacité</Text>
        <View style={styles.capacityRow}>
          <View style={styles.capacityItem}>
            <Text style={styles.capacityNumber}>{orphanageInfo.children_total}</Text>
            <Text style={styles.capacityLabel}>Actuels</Text>
          </View>
          <View style={styles.capacityItem}>
            <Text style={styles.capacityNumber}>{orphanageInfo.child_capacity}</Text>
            <Text style={styles.capacityLabel}>Maximum</Text>
          </View>
          <View style={styles.capacityItem}>
            <Text style={styles.capacityNumber}>
              {((orphanageInfo.children_total / orphanageInfo.child_capacity) * 100).toFixed(1)}%
            </Text>
            <Text style={styles.capacityLabel}>Taux d'occupation</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.descriptionSection}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{orphanageInfo.description}</Text>
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#1f2937',
    flex: 2,
    textAlign: 'right',
  },
  linkContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  linkText: {
    fontSize: 14,
    color: '#0ea5e9',
    textDecorationLine: 'underline',
  },
  capacitySection: {
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
  capacityRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  capacityItem: {
    alignItems: 'center',
  },
  capacityNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  capacityLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  descriptionSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
});

