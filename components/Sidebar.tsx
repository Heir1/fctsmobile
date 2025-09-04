import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

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
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 24 }}>
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <Image
          source={require('../assets/images/logo.png')}
          resizeMode="contain"
          style={{ width: 120, height: 120 }}
        />
      </View>

      <View style={{ gap: 12 }}>
        <TouchableOpacity
          onPress={onNavigateHome}
          style={{ backgroundColor: '#f3f4f6', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16 }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>Home</Text>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>Go to Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNavigateChildren}
          style={{ backgroundColor: '#f3f4f6', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16 }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>Children</Text>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>Manage children records</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNavigateHealth}
          style={{ backgroundColor: '#f3f4f6', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16 }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>Health</Text>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>Manage health records</Text>
        </TouchableOpacity>

        {onNavigateNutrition && (
          <TouchableOpacity
            onPress={onNavigateNutrition}
            style={{ backgroundColor: '#f3f4f6', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16 }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>Nutrition</Text>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>Manage nutrition records</Text>
          </TouchableOpacity>
        )}

        {onLogout && (
          <TouchableOpacity
            onPress={onLogout}
            style={{ backgroundColor: '#fee2e2', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16 }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#991b1b' }}>Logout</Text>
            <Text style={{ fontSize: 12, color: '#b91c1c' }}>Sign out from your account</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
