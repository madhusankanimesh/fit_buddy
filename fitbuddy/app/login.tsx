import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../src/store/authSlice';
import { authApi } from '../src/services/api';
import { storage } from '../src/utils/storage';
import { loginSchema } from '../src/utils/validation';
import { Feather } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      setErrors({});
      // Validate inputs
      await loginSchema.validate({ username, password }, { abortEarly: false });
      
      setLoading(true);
      // Call API (use username: 'emilys', password: 'emilyspass' for testing)
      const response = await authApi.login({ username, password });
      
      // Save to secure storage
      await storage.saveToken(response.token);
      await storage.saveUser(response);
      
      // Update Redux state
      dispatch(setCredentials({ user: response, token: response.token }));
      
      // Navigate to home
      router.replace('/(tabs)');
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        const validationErrors: any = {};
        error.inner.forEach((err: any) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error('Login error:', error);
        Alert.alert(
          'Login Failed', 
          error.response?.data?.message || error.message || 'Invalid credentials. Try: emilys / emilyspass'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkipLogin = async () => {
    // Mock user for testing
    const mockUser = {
      id: 1,
      username: 'demo_user',
      email: 'demo@fitbuddy.com',
      firstName: 'Demo',
      lastName: 'User',
    };
    const mockToken = 'demo_token_123';
    
    await storage.saveToken(mockToken);
    await storage.saveUser(mockUser);
    dispatch(setCredentials({ user: mockUser, token: mockToken }));
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="activity" size={60} color="#4CAF50" />
        <Text style={styles.title}>FitBuddy</Text>
        <Text style={styles.subtitle}>Your Fitness Companion</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="#757575" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>
        {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="#757575" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#757575" />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={handleSkipLogin}
        >
          <Text style={styles.skipButtonText}>Skip Login (Demo Mode)</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.linkText}>Don't have an account? Register</Text>
        </TouchableOpacity>

        <View style={styles.demoHint}>
          <Text style={styles.demoText}>Demo: username: emilys | password: emilyspass</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    marginTop: 5,
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#F9F9F9',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
  },
  demoHint: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
  },
  demoText: {
    color: '#2E7D32',
    fontSize: 12,
    textAlign: 'center',
  },
});
