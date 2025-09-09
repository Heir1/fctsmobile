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

              <Text style={styles.title}>Sign In</Text>

            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  placeholderTextColor="#7D8A95"
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

              <View style={styles.registerContainer}>
                <Text style={styles.register}>Don't have an account ? </Text>
                <TouchableOpacity  onPress={() => {
                  setActiveTab('register');
                  handleRegisterPress();
                }}>
                  <Text style={styles.createAccount}>Create Account</Text>
                </TouchableOpacity>
              </View>

            </View>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232528',
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
    paddingTop: '30%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    // backgroundColor: '#0ea5e9',
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F1F4F6',
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
    backgroundColor: '#232528',
    borderRadius: 12,
    padding: 12,
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
    color: '#F1F4F6',
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#B2BCC9',
    backgroundColor: '#2B3037',
  },
  loginButton: {
    backgroundColor: '#2E6FF3',
    borderRadius: 32,
    paddingVertical: 14,
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 20
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  register: {
    color: '#B2BCC9',
    fontSize: 13,
  },
  createAccount: {
    color: '#F1F4F6',
    fontWeight: 'bold',
    fontSize: 13,
  },
  // Pour l'effet au press
  createAccountPressed: {
    color: '#0056B3',
    opacity: 0.8,
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
