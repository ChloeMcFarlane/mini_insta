// File: app/(tabs)/post.tsx
// Author: (cmcfar)/cmcfar@bu.edu
// Description: This file defines the tab screen for post.

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ActivityIndicator, SafeAreaView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PostScreen() {
  // Definitions
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [postCap, setPostCap] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Reset function
  const handleRefresh = () => {
    setImage(null);
    setPostCap('');
    setError('');
  };

  // Pick image function
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Add post function
  const addPost = async () => {
    if (!postCap || !image) {
      setError('Please add an image and a caption');
      return;
    }
    setIsPosting(true);
    setError('');
    try {
      const token = await AsyncStorage.getItem('userToken');

      // Build form data
      const formData = new FormData();
      formData.append('caption', postCap);
      formData.append('image_file', {
        uri: image,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      // Set up timeout so post never hangs forever
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10 sec

      const response = await fetch('https://cs-webapps.bu.edu/cmcfar/mini_insta/api/post/create', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const newPost = await response.json();

      if (response.ok) {
        console.log('Post created:', newPost);
        setPostCap('');
        setImage(null);
      } else {
        console.error('Server response:', newPost);
        setError('Failed to create post. Please try again.');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Connection error. Is your server up?');
    } finally {
      setIsPosting(false);
    }
  };

  // Loading state while uploading
  if (isPosting) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fabaad" />
        <Text style={{ marginTop: 10 }}>Uploading your post...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Post</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.imageContainer}>
        <Button title="Pick an image from camera roll" onPress={pickImage} color="#0095f6" />
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Add a caption..."
        value={postCap}
        onChangeText={setPostCap}
      />
      <View style={styles.buttonContainer}>
        <Button title="Create Post" onPress={addPost} color="#0095f6" />
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
  buttonContainer: { marginTop: 10 },
  imageContainer: { alignItems: 'center', marginBottom: 20 },
  image: { width: 300, height: 225, marginTop: 15, borderRadius: 8 },
});