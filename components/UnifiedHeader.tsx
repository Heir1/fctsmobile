import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type UnifiedHeaderProps = {
  title: string;
  subtitle: string;
  onMenuPress?: () => void;
  onRefreshPress?: () => void;
  refreshing?: boolean;
  showRefresh?: boolean;
  showMenu?: boolean;
};

export default function UnifiedHeader({
  title,
  subtitle,
  onMenuPress,
  onRefreshPress,
  refreshing = false,
  showRefresh = false,
  showMenu = false,
}: UnifiedHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {showMenu && (
          <TouchableOpacity 
            onPress={onMenuPress} 
            style={styles.menuButton}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={28} color="#3b82f6" />
          </TouchableOpacity>
        )}
        
        <View style={[styles.headerTextContainer, !showMenu && styles.headerTextContainerNoMenu]}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>

        {showRefresh && (
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={onRefreshPress}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="refresh" 
                size={22} 
                color={refreshing ? '#3b82f6' : '#9ca3af'} 
                style={refreshing && styles.refreshingIcon}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'rgba(35, 37, 40, 0.95)',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingTop: 35,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  headerTextContainerNoMenu: {
    marginLeft: 0,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  refreshButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  refreshingIcon: {
    transform: [{ rotate: '360deg' }],
  },
});


