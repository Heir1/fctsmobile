import { Ionicons } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type SidebarProps = {
  onNavigateHome: () => void;
  onNavigateChildren: () => void;
  onNavigateHealth: () => void;
  onNavigateNutrition?: () => void;
  onClose: () => void;
  onLogout?: () => void;
};

export default function Sidebar({ onNavigateHome, onNavigateChildren, onNavigateHealth, onNavigateNutrition, onLogout }: SidebarProps) {
  return (
    <View style={styles.container}>
      {/* Header avec effet de verre */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>
        <Text style={styles.appName}>CareDashboard</Text>
        <Text style={styles.appVersion}>v2.1.0</Text>
      </View>

      {/* Menu principal */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          onPress={onNavigateHome}
          style={styles.menuItem}
          activeOpacity={0.8}
        >
          <View style={[styles.menuIconContainer, styles.homeIcon]}>
            <Ionicons name="home" size={22} color="#3b82f6" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Home</Text>
            <Text style={styles.menuSubtitle}>Dashboard overview</Text>
          </View>
          <View style={styles.menuBadge}>
            <Ionicons name="chevron-forward" size={16} color="#6b7280" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNavigateChildren}
          style={styles.menuItem}
          activeOpacity={0.8}
        >
          <View style={[styles.menuIconContainer, styles.childrenIcon]}>
            <Ionicons name="people" size={22} color="#8b5cf6" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Children</Text>
            <Text style={styles.menuSubtitle}>Manage profiles</Text>
          </View>
          <View style={styles.menuBadge}>
            <Ionicons name="chevron-forward" size={16} color="#6b7280" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNavigateHealth}
          style={styles.menuItem}
          activeOpacity={0.8}
        >
          <View style={[styles.menuIconContainer, styles.healthIcon]}>
            <Ionicons name="medical" size={22} color="#10b981" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Health</Text>
            <Text style={styles.menuSubtitle}>Medical records</Text>
          </View>
          <View style={styles.menuBadge}>
            <Ionicons name="chevron-forward" size={16} color="#6b7280" />
          </View>
        </TouchableOpacity>

        {onNavigateNutrition && (
          <TouchableOpacity
            onPress={onNavigateNutrition}
            style={styles.menuItem}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIconContainer, styles.nutritionIcon]}>
              <Ionicons name="nutrition" size={22} color="#f59e0b" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Nutrition</Text>
              <Text style={styles.menuSubtitle}>Diet & growth tracking</Text>
            </View>
            <View style={styles.menuBadge}>
              <Ionicons name="chevron-forward" size={16} color="#6b7280" />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Section logout */}
      {onLogout && (
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={onLogout}
            style={styles.logoutItem}
            activeOpacity={0.8}
          >
            <View style={[styles.logoutIconContainer]}>
              <Ionicons name="log-out" size={22} color="#ef4444" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.logoutTitle}>Logout</Text>
              <Text style={styles.logoutSubtitle}>Secure sign out</Text>
            </View>
            <View style={styles.menuBadge}>
              <Ionicons name="exit-outline" size={16} color="#ef4444" />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 0,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    tintColor: '#3b82f6',
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f8fafc',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  homeIcon: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  childrenIcon: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  healthIcon: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  nutritionIcon: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '400',
    opacity: 0.8,
  },
  menuBadge: {
    paddingLeft: 8,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  logoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fecaca',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  logoutSubtitle: {
    fontSize: 12,
    color: '#fca5a5',
    fontWeight: '400',
    opacity: 0.8,
  },
});