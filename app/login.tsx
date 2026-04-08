// File: app/(tabs)/login.tsx
// Author: (cmcfar)/cmcfar@bu.edu
// Description: This file defines the screen for logging in.

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default function LoginScreen() {
  const router = useRouter();

  // Definitions
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 

  // Refresh function
  const handleRefresh = () => {
    setUsername('');
    setPassword('');
    setError('');
  };

  // login function
  const login = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true); // Trigger the loading UI
    setError('');

    try {
      const response = await fetch('https://cs-webapps.bu.edu/cmcfar/mini_insta/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // SUCCESS: Save the token and profile ID locally
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('profileId', data.profile_id.toString());
        
        console.log('Login successful. Token saved.');
        router.replace('/(tabs)/feed'); 
        // Move to main app
      } else {
        setError('Login failed. Check your credentials.');
      } 
    } catch (err) {
      console.error('Login Error:', err);
      setError('Connection error. Is your server up?');
    } finally {
      setIsLoading(false); 
    }
  };

  // loading function
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fabaad" />
        <Text style={{ marginTop: 10 }}>Logging you in...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>MiniInsta Login</Text>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none"
      />

      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword}
      />

      <View style={styles.buttonContainer}>
        <Button title="Log In" onPress={login} color="#0095f6" />
        <View style={{ marginTop: 10 }}>
          <Button title="Reset Form" onPress={handleRefresh} color="#666" />
        </View>
      </View>
    </SafeAreaView>
  );
}

// TO DO: CHANGE STYLING!!
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, marginBottom: 15, borderRadius: 8 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 15 },
  buttonContainer: { marginTop: 10 }
});