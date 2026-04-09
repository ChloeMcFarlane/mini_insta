// File: app/login.tsx
// Author: (cmcfar)/cmcfar@bu.edu
// Description: This file defines the screen for logging in.
//  * CONVERSATION USED TO GENERATE STYLING FOR THIS FILE: https://claude.ai/share/9cd36580-8d68-40fd-88e0-dbbae15d1ab0

import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleRefresh = () => {
    setUsername('');
    setPassword('');
    setError('');
  };

  const login = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('https://cs-webapps.bu.edu/cmcfar/mini_insta/api/login/', { // Added slash
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Use await to ensure these are saved before navigating
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('profileId', data.profile_id.toString());
        router.replace('/(tabs)/feed');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Is your server up?');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A882DD" />
        <Text style={styles.loadingText}>Logging you in...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.brand}>mini_insta</Text>
          <Text style={styles.subtitle}>sign in to continue</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Username</Text>
            <TextInput
              style={[styles.fieldInput, usernameFocused && styles.fieldInputFocused]}
              placeholder="Enter your username"
              placeholderTextColor="#888"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              onFocus={() => setUsernameFocused(true)}
              onBlur={() => setUsernameFocused(false)}
            />
          </View>

          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Password</Text>
            <TextInput
              style={[styles.fieldInput, passwordFocused && styles.fieldInputFocused]}
              placeholder="Enter your password"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
          </View>

          <TouchableOpacity style={styles.btnLogin} onPress={login} activeOpacity={0.8}>
            <Text style={styles.btnLoginText}>Log In</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 14,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  brand: {
    fontSize: 52,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#A882DD',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgb(140,137,137)',
    textAlign: 'center',
    marginBottom: 36,
    letterSpacing: 1,
  },
  errorText: {
    color: '#C8154B',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 13,
  },
  fieldWrapper: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgb(140,137,137)',
    marginBottom: 6,
  },
  fieldInput: {
    backgroundColor: '#302f2f',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#fff',
  },
  fieldInputFocused: {
    borderColor: '#A882DD',
    shadowColor: '#A882DD',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 7,
    elevation: 4,
  },
  btnLogin: {
    backgroundColor: '#bc9ee6',
    borderWidth: 1,
    borderColor: '#A882DD',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  btnLoginText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  btnCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
  },
  btnCancelText: {
    color: 'rgb(140,137,137)',
    fontSize: 14,
  },
});