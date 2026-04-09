// File: app/(tabs)/feed.tsx
// Author: (cmcfar)/cmcfar@bu.edu
// Description: This file defines the tab screen for feed.
//  * Logged-out users see the global public feed (no auth required).
//  * Logged-in users see their own personalized feed.
//  * CONVERSATION USED TO GENERATE STYLING FOR THIS FILE: https://claude.ai/share/9cd36580-8d68-40fd-88e0-dbbae15d1ab0

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_W } = Dimensions.get('window');
const MAX_W = Math.min(SCREEN_W, 600);

export default function Feed() {
  const [posts, setPosts] = useState([]);
  
  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, [])
  );

  const fetchPosts = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem('userToken');
    const pId = await AsyncStorage.getItem('profileId');

    // Toggle: Authenticated feed vs Public profiles/posts
    const url = (token && pId) 
      ? `https://cs-webapps.bu.edu/cmcfar/mini_insta/api/${pId}/feed/` 
      : `https://cs-webapps.bu.edu/cmcfar/mini_insta/api/profiles/`;

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Token ${token}`;

    const res = await fetch(url, { headers });
    const data = await res.json();
    setPosts(data);
    setIsLoading(false);
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
            {/* Profile header row */}
            <View style={styles.postHeader}>
              {item.owner?.profile_pic ? (
                <Image
                  source={{
                    uri:
                      item.owner.profile_pic_url ||
                      `https://cs-webapps.bu.edu${item.owner.profile_pic}`,
                  }}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]} />
              )}
              <Text style={styles.ownerName}>
                {item.owner?.username || 'user'}
              </Text>
            </View>

            {/* Post image */}
            {item.photos && item.photos.length > 0 && (
              <Image
                source={{
                  uri:
                    item.photos[0].image_url ||
                    `https://cs-webapps.bu.edu${item.photos[0].image_file}`,
                }}
                style={styles.postImage}
              />
            )}

            {/* Caption */}
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
  brand: {
    fontSize: 28,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#A882DD',
    textAlign: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  errorText: {
    color: '#C8154B',
    textAlign: 'center',
    marginVertical: 12,
    fontSize: 13,
  },
  feedContent: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  postCard: {
    width: MAX_W,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#000',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 0.3,
    borderColor: 'gray',
  },
  avatarFallback: {
    backgroundColor: '#302f2f',
  },
  ownerName: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  caption: {
    padding: 12,
    fontSize: 14,
    color: '#fff',
  },
});