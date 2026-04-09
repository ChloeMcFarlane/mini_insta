// File: app/(tabs)/post.tsx
// Author: (cmcfar)/cmcfar@bu.edu
// Description: This file defines the tab screen for creating a post.
//  * If the user is not logged in, they are redirected to the login screen.
//  * CONVERSATION USED TO GENERATE STYLING FOR THIS FILE: https://claude.ai/share/9cd36580-8d68-40fd-88e0-dbbae15d1ab0

import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const { width: SCREEN_W } = Dimensions.get('window');
const isTablet = SCREEN_W >= 600;

export default function PostScreen() {
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [postCap, setPostCap] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [capFocused, setCapFocused] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // Check auth on mount — redirect to login if no token
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setIsLoggedIn(false);
        router.replace('/login');
      } else {
        setIsLoggedIn(true);
      }
    };
    checkAuth();
  }, []);

  const handleRefresh = () => {
    setImage(null);
    setPostCap('');
    setError('');
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const addPost = async () => {
    console.log("DEBUG TOKEN:", token);
    if (!postCap || !image) {
      setError('Please add an image and a caption');
      return;
    }
    setIsPosting(true);
    setError('');

    try {
      const token = await AsyncStorage.getItem('userToken');

      // Guard: token missing at post time (e.g. session expired)
      if (!token) {
        setError('Session expired — please log in again.');
        router.replace('/login');
        return;
      }

      const formData = new FormData();
      formData.append('caption', postCap);

      // uri, name, and type are all required for Django's FileField
      formData.append('image_file', {
        uri: image,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(
        'https://cs-webapps.bu.edu/cmcfar/mini_insta/api/post/create',
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
          },
          body: formData,
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      const newPost = await response.json();
      console.log('Post response status:', response.status);
      console.log('Post response body:', JSON.stringify(newPost));

      if (response.ok) {
        console.log('Post created:', newPost);
        setPostCap('');
        setImage(null);
      } else {
        const detail = newPost?.detail || newPost?.image_file || 'Failed to create post.';
        setError(String(detail));
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        setError('Request timed out. Is your server up?');
      } else {
        console.error('Error creating post:', err);
        setError('Connection error. Is your server up?');
      }
    } finally {
      setIsPosting(false);
    }
  };

  // Show spinner while auth check is in progress
  if (isLoggedIn === null || isPosting) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A882DD" />
        <Text style={styles.loadingText}>
          {isPosting ? 'Uploading your post...' : 'Loading...'}
        </Text>
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
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Create Post</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Image picker section */}
          <Text style={styles.sectionLabel}>Photo</Text>
          <View style={styles.imageContainer}>
            <TouchableOpacity style={styles.pickBtn} onPress={pickImage} activeOpacity={0.8}>
              <Text style={styles.pickBtnText}>Pick an image from camera roll</Text>
            </TouchableOpacity>
            {image && (
              <Image source={{ uri: image }} style={styles.preview} />
            )}
          </View>

          {/* Caption input */}
          <Text style={styles.sectionLabel}>Caption</Text>
          <TextInput
            style={[styles.input, capFocused && styles.inputFocused]}
            placeholder="Add a caption..."
            placeholderTextColor="rgb(140,137,137)"
            value={postCap}
            onChangeText={setPostCap}
            multiline
            numberOfLines={3}
            onFocus={() => setCapFocused(true)}
            onBlur={() => setCapFocused(false)}
          />

          {/* Action buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.btnPost} onPress={addPost} activeOpacity={0.8}>
              <Text style={styles.btnPostText}>Create Post</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCancel} onPress={handleRefresh} activeOpacity={0.8}>
              <Text style={styles.btnCancelText}>Reset</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 24,
    paddingVertical: 28,
    maxWidth: isTablet ? 600 : undefined,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#A882DD',
    textAlign: 'center',
    marginBottom: 28,
  },
  errorText: {
    color: '#C8154B',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 13,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgb(140,137,137)',
    marginBottom: 8,
    marginTop: 4,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pickBtn: {
    backgroundColor: '#bc9ee6',
    borderWidth: 1,
    borderColor: '#A882DD',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  pickBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  preview: {
    width: isTablet ? 400 : 300,
    height: isTablet ? 300 : 225,
    marginTop: 16,
    borderRadius: 8,
  },
  input: {
    backgroundColor: '#302f2f',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 20,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  inputFocused: {
    borderColor: '#A882DD',
    shadowColor: '#A882DD',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 7,
    elevation: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  btnPost: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#bc9ee6',
    borderWidth: 1,
    borderColor: '#A882DD',
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPostText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
  },
  btnCancelText: {
    color: 'rgb(140,137,137)',
    fontSize: 14,
  },
});