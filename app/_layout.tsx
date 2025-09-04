import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, LogBox, StyleSheet, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { registerTranslation } from 'react-native-paper-dates';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import LoginScreen from '../components/LoginScreen';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

function AppContent() {
  // Suppress known RN 19 warning from third-party libs
  LogBox.ignoreLogs(['useInsertionEffect must not schedule updates']);

  // Register FR locale for date pickers once
  registerTranslation('fr', ({
    save: 'Sauvegarder',
    selectSingle: 'Sélectionner date',
    selectMultiple: 'Sélectionner dates',
    selectRange: 'Sélectionner période',
    notAccordingToDateFormat: (inputFormat: any) => 'Format invalide',
    mustBeHigherThan: (date: any) => 'Doit être après la date',
    mustBeLowerThan: (date: any) => 'Doit être avant la date',
    mustBeBetween: (startDate: any, endDate: any) => 'Doit être entre les dates',
    dateIsDisabled: (date: any) => 'Date désactivée',
    previous: 'Précédent',
    next: 'Suivant',
    typeInDate: 'Saisir la date',
    inputHelpText: 'Format: JJ/MM/AAAA',
  }) as any);
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PaperProvider>
        <Stack>
          <Stack.Screen name="dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </PaperProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
});
