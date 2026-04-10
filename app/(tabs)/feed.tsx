// File: app/(tabs)/feed.tsx
// Author: (cmcfar)/cmcfar@bu.edu

import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_W } = Dimensions.get('window');
const MAX_W = Math.min(SCREEN_W, 600);
const BASE = 'https://cs-webapps.bu.edu/cmcfar/mini_insta/api';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, [])
  );

  const fetchPosts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = await AsyncStorage.getItem('userToken');
      const pId = await AsyncStorage.getItem('profileId');

      const url = (token && pId)
        ? `${BASE}/${pId}/feed`
        : `${BASE}/profiles/`;

      console.log('Feed fetching:', url);

      const headers: Record<string, string> = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = `Token ${token}`;

      const res = await fetch(url, { headers });
      console.log('Feed status:', res.status);

      if (!res.ok) {
        const text = await res.text();
        console.log('Error body (first 300):', text.slice(0, 300));
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setPosts(data.results ? data.results : data);
      console.log('Feed data:', JSON.stringify(data).slice(0, 300));
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A882DD" />
        <Text style={styles.loadingText}>Loading feed...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.brand}>mini_insta</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        data={posts}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: any) => (
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              {item.profile_details?.profile_image_url ? (
                <Image
                  source={{ uri: item.profile_details.profile_image_url }}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]} />
              )}
              <Text style={styles.ownerName}>
                {item.profile_details?.username || 'user'}
              </Text>
            </View>

            {item.photos && item.photos.length > 0 && (
              <Image
                source={{
                  uri: item.photos[0].image_url ||
                    `https://cs-webapps.bu.edu${item.photos[0].image_file}`,
                }}
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

const styles = StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#000' 
  },
  loadingText: { 
    marginTop: 10, 
    color: '#fff', 
    fontSize: 14 
  },
  brand: { 
    fontSize: 28, 
    fontWeight: '800', 
    fontStyle: 'italic', 
    color: '#A882DD', 
    textAlign: 'center', 
    paddingVertical: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: '#333' 
  },
  errorText: { 
    color: '#C8154B', 
    textAlign: 'center', 
    marginVertical: 12, 
    fontSize: 13 
  },
  feedContent: { 
    paddingVertical: 12, 
    alignItems: 'center' 
  },
  postCard: { 
    width: MAX_W, 
    borderWidth: 1, 
    borderColor: '#333', 
    borderRadius: 8, 
    overflow: 'hidden', 
    marginBottom: 20, 
    backgroundColor: '#000' 
  },
  postHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12 
  },
  avatar: { 
    width: 42, 
    height: 42, 
    borderRadius: 21, 
    borderWidth: 0.3, 
    borderColor: 'gray' 
  },
  avatarFallback: { 
    backgroundColor: '#302f2f' 
  },
  ownerName: { 
    marginLeft: 12, 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#fff' 
  },
  postImage: { 
    width: '100%', 
    aspectRatio: 1, 
    resizeMode: 'cover' 
  },
  caption: { 
    padding: 12, 
    fontSize: 14, 
    color: '#fff' 
  },
});