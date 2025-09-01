import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials } from '../types/auth';

export default function LoginScreen() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!credentials.email || !credentials.password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      await login(credentials);
      // Navigation will be handled by the auth context
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite';
      
      // Messages d'erreur plus spécifiques
      if (errorMessage.includes('Email ou mot de passe incorrect')) {
        Alert.alert('Identifiants Incorrects', 'L\'email ou le mot de passe saisi est incorrect. Veuillez vérifier vos identifiants.');
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        Alert.alert('Erreur de Connexion', 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
      } else if (errorMessage.includes('Tokens invalides')) {
        Alert.alert('Erreur Technique', 'Erreur lors de la réception des données d\'authentification. Veuillez réessayer.');
      } else {
        Alert.alert('Erreur de Connexion', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterPress = () => {
    Alert.alert('Bientôt Disponible', 'La fonctionnalité d\'inscription sera implémentée dans la prochaine phase');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          style={styles.scrollView}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>🏠</Text>
              </View>
              <Text style={styles.title}>Orphanage Care</Text>
              <Text style={styles.subtitle}>
                Manage and monitor orphanage statistics with care and compassion
              </Text>
            </View>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'login' && styles.activeTabButton
                ]}
                onPress={() => setActiveTab('login')}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === 'login' && styles.activeTabText
                ]}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'register' && styles.activeTabButton
                ]}
                onPress={() => {
                  setActiveTab('register');
                  handleRegisterPress();
                }}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === 'register' && styles.activeTabText
                ]}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Welcome Back</Text>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={credentials.email}
                  onChangeText={(text) => setCredentials({ ...credentials, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={credentials.password}
                  onChangeText={(text) => setCredentials({ ...credentials, password: text })}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading && styles.disabledButton
                ]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="white" size="small" />
                    <Text style={styles.loadingText}>Signing In...</Text>
                  </View>
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              {/* Demo Credentials */}
              <View style={styles.demoContainer}>
                <Text style={styles.demoTitle}>Demo Credentials:</Text>
                <Text style={styles.demoText}>Email: lumiere@centre.cd</Text>
                <Text style={styles.demoText}>Password: .wus6d66x75p</Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2024 Orphanage Care Management System
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    backgroundColor: '#0ea5e9',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6b7280',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: '#0ea5e9',
  },
  tabText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: 'white',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  loginButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 18,
  },
  demoContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  demoTitle: {
    color: '#1e40af',
    fontWeight: '500',
    marginBottom: 8,
  },
  demoText: {
    color: '#1d4ed8',
    fontSize: 14,
  },
  footer: {
    paddingVertical: 24,
  },
  footerText: {
    color: '#6b7280',
    textAlign: 'center',
    fontSize: 14,
  },
});
