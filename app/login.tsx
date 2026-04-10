// File: app/login.tsx
// Author: (cmcfar)/cmcfar@bu.edu
// Description: Login screen — posts credentials to API, stores token + profileId, then redirects to feed.
// NOTE: TO TEST LOGIN, USE THESE CREDENTIALS: 
//   Username: addybaddy
//   Password: PeachesAndCream!23

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const BASE = 'https://cs-webapps.bu.edu/cmcfar/mini_insta/api';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    await AsyncStorage.clear();
    if (!username || !password) {
      setError('Please enter username and password.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${BASE}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('profileId', data.profile_id.toString());
        router.replace('/(tabs)/feed');
      } else {
        setError(data.error || 'Login failed. Check your credentials.');
      }
    } catch (err: any) {
      setError('Connection error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <Text style={styles.brand}>mini_insta</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="rgb(140,137,137)"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="rgb(140,137,137)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.btn, isLoading && styles.btnDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Log In</Text>
          }
        </TouchableOpacity>

        {/* Skip login — browse as guest */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.guestBtn}
          onPress={() => router.replace('/(tabs)/feed')}
          activeOpacity={0.7}
        >
          <Text style={styles.guestText}>Browse as guest</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  inner: {
    flex: 1, justifyContent: 'center',
    paddingHorizontal: 28,
  },
  brand: {
    fontSize: 42, fontWeight: '800', fontStyle: 'italic',
    color: '#A882DD', textAlign: 'center', marginBottom: 8,
  },
  subtitle: {
    fontSize: 14, color: 'rgb(140,137,137)',
    textAlign: 'center', marginBottom: 36,
  },
  errorText: {
    color: '#C8154B', textAlign: 'center',
    marginBottom: 16, fontSize: 13,
  },
  input: {
    backgroundColor: '#302f2f',
    borderWidth: 1, borderColor: '#333', borderRadius: 8,
    color: '#fff', paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, marginBottom: 14,
  },
  btn: {
    backgroundColor: '#bc9ee6', borderWidth: 1, borderColor: '#A882DD',
    borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    color: 'rgb(140,137,137)',
    fontSize: 12,
    marginHorizontal: 12,
  },
  guestBtn: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
  },
  guestText: { color: 'rgb(140,137,137)', fontSize: 15, fontWeight: '700' },
});