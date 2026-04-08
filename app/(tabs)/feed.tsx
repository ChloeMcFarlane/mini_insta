// File: app/(tabs)/feed.tsx
// Author: (cmcfar)/cmcfar@bu.edu
// Description: This file defines the tab screen for feed.

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Feed() {
  // Definitions
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  // Fetch posts on load
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch posts function
  const fetchPosts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = await AsyncStorage.getItem('userToken');
      const profileId = await AsyncStorage.getItem('profileId');
      const response = await fetch(`https://cs-webapps.bu.edu/cmcfar/mini_insta/api/${profileId}/feed`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        setError('Failed to load posts.');
        return;
      }
      const data = await response.json();
      const posts = data.results ? data.results : data;
      setPosts(posts);
    } catch (err: any) {
      console.error('Feed error:', err);
      setError('Connection error. Is your server up?');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fabaad" />
        <Text style={{ marginTop: 10 }}>Loading feed...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        data={posts}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: any) => (
          <View style={styles.postContainer}>
            {item.photos && item.photos.length > 0 && (
              <Image
                source={{ uri: item.photos[0].image_url || `https://cs-webapps.bu.edu${item.photos[0].image_file}` }}
                style={styles.postImage}
              />
            )}
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// TO DO: CHANGE STYLING!!
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 15 },
  postContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15 },
  postImage: { width: '100%', height: 300, borderRadius: 8, marginBottom: 10 },
  caption: { fontSize: 16 },
});