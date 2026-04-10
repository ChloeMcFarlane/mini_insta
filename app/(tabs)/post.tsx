// File: app/(tabs)/profile.tsx
// Author: (cmcfar)/cmcfar@bu.edu
// Description: This file defines the tab screen for creating a user's profile.
//  * If the user is not logged in, they are redirected to the login screen.
//  * CONVERSATION USED TO GENERATE STYLING FOR THIS FILE: https://claude.ai/share/9cd36580-8d68-40fd-88e0-dbbae15d1ab0
// NOTE: TO TEST LOGIN, USE THESE CREDENTIALS: 
//   Username: addybaddy
//   Password: PeachesAndCream!23

import React, { useState, useEffect } from 'react';
import {
  View, TextInput, TouchableOpacity, StyleSheet, Text,
  ActivityIndicator, Alert, Image, ScrollView,
  KeyboardAvoidingView, Platform, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const { width: SCREEN_W } = Dimensions.get('window');
const isTablet = SCREEN_W >= 600;
const BASE = 'https://cs-webapps.bu.edu/cmcfar/mini_insta/api';

export default function PostScreen() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState('');
  const [postCap, setPostCap] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [urlFocused, setUrlFocused] = useState(false);
  const [capFocused, setCapFocused] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('userToken').then(token => {
      setIsLoggedIn(!!token);
      setAuthChecked(true);
    });
  }, []);

  const addPost = async () => {
    if (!imageUrl.trim()) {
      setError('Please enter an image URL');
      return;
    }
    setIsPosting(true);
    setError('');
    try {
      const token = await AsyncStorage.getItem('userToken');
      const profileId = await AsyncStorage.getItem('profileId');

      console.log("TOKEN:", token);
      console.log("PROFILE ID:", profileId);

      const response = await fetch(`${BASE}/${profileId}/posts/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: Number(profileId),
          caption: postCap,
          image_url: imageUrl.trim(),
        }),
      });

      const data = await response.json();
      console.log('Post response:', response.status, JSON.stringify(data));

      if (response.ok) {
        setImageUrl('');
        setPostCap('');
        Alert.alert('Posted!', 'Your post was created.', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/profile') },
        ]);
      } else {
        setError('Error: ' + JSON.stringify(data));
      }
    } catch (err: any) {
      setError('Connection error: ' + err.message);
    } finally {
      setIsPosting(false);
    }
  };

  if (!authChecked) return (
    <SafeAreaView style={styles.center}>
      <ActivityIndicator size="large" color="#A882DD" />
    </SafeAreaView>
  );

  if (!isLoggedIn) return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.center}>
        <Text style={styles.title}>Create Post</Text>
        <Text style={styles.subtext}>You need to be logged in to post.</Text>
        <TouchableOpacity style={styles.authBtn} onPress={() => router.replace('/login')}>
          <Text style={styles.btnText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  if (isPosting) return (
    <SafeAreaView style={styles.center}>
      <ActivityIndicator size="large" color="#A882DD" />
      <Text style={{ color: '#fff', marginTop: 10 }}>Posting...</Text>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Create Post</Text>
          {error ? <Text style={styles.err}>{error}</Text> : null}

          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={[styles.input, urlFocused && styles.focused]}
            placeholder="https://example.com/photo.jpg"
            placeholderTextColor="rgb(140,137,137)"
            value={imageUrl}
            onChangeText={setImageUrl}
            autoCapitalize="none"
            keyboardType="url"
            onFocus={() => setUrlFocused(true)}
            onBlur={() => setUrlFocused(false)}
          />

          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.preview} />
          ) : null}

          <Text style={styles.label}>Caption</Text>
          <TextInput
            style={[styles.input, styles.captionInput, capFocused && styles.focused]}
            placeholder="Add a caption..."
            placeholderTextColor="rgb(140,137,137)"
            value={postCap}
            onChangeText={setPostCap}
            multiline
            numberOfLines={3}
            onFocus={() => setCapFocused(true)}
            onBlur={() => setCapFocused(false)}
          />

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btn, !imageUrl && styles.btnDisabled]}
              onPress={addPost}
              disabled={!imageUrl}
            >
              <Text style={styles.btnText}>Post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => { setImageUrl(''); setPostCap(''); setError(''); }}
            >
              <Text style={styles.cancelText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', padding: 28 },
  container: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 28, maxWidth: isTablet ? 600 : undefined, alignSelf: 'center', width: '100%' },
  title: { fontSize: 28, fontWeight: '800', fontStyle: 'italic', color: '#A882DD', textAlign: 'center', marginBottom: 28 },
  subtext: { color: 'rgb(140,137,137)', fontSize: 15, textAlign: 'center', marginBottom: 24 },
  err: { color: '#C8154B', textAlign: 'center', marginBottom: 16, fontSize: 13 },
  label: { fontSize: 13, fontWeight: '600', color: 'rgb(140,137,137)', marginBottom: 8 },
  input: { backgroundColor: '#302f2f', borderWidth: 1, borderColor: '#333', borderRadius: 8, color: '#fff', paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, marginBottom: 16 },
  captionInput: { textAlignVertical: 'top', minHeight: 80 },
  focused: { borderColor: '#A882DD' },
  preview: { width: '100%', aspectRatio: 1, borderRadius: 8, marginBottom: 16, resizeMode: 'cover' },
  row: { flexDirection: 'row', gap: 12, marginTop: 4 },
  btn: { flex: 1, paddingVertical: 13, backgroundColor: '#bc9ee6', borderWidth: 1, borderColor: '#A882DD', borderRadius: 8, alignItems: 'center' },
  authBtn: { width: '100%',
    paddingVertical: 14,
    backgroundColor: '#bc9ee6',
    borderWidth: 1,
    borderColor: '#A882DD',
    borderRadius: 8,
    alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#555', borderColor: '#444' },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  cancelBtn: { flex: 1, paddingVertical: 13, borderWidth: 1, borderColor: '#333', borderRadius: 8, alignItems: 'center' },
  cancelText: { color: 'rgb(140,137,137)', fontSize: 14 },
});