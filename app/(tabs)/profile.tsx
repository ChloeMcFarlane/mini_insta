// File: app/(tabs)/profile.tsx
// Author: (cmcfar)/cmcfar@bu.edu
// Description: This file defines the tab screen for creating a user's profile.
//  * If the user is not logged in, they are redirected to the login screen.
//  * CONVERSATION USED TO GENERATE STYLING FOR THIS FILE: https://claude.ai/share/9cd36580-8d68-40fd-88e0-dbbae15d1ab0
// NOTE: TO TEST LOGIN, USE THESE CREDENTIALS: 
//   Username: addybaddy
//   Password: PeachesAndCream!23

import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const { width: SCREEN_W } = Dimensions.get('window');
const isTablet = SCREEN_W >= 600;
const THUMB_SIZE = (SCREEN_W - 6) / 3;
const BASE = 'https://cs-webapps.bu.edu/cmcfar/mini_insta/api';

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        setIsLoading(true);
        setError('');
        try {
          const token = await AsyncStorage.getItem('userToken');
          const pId = await AsyncStorage.getItem('profileId');

          if (!token || !pId) {
            router.replace('/login');
            return;
          }

          const headers = { 
            'Authorization': `Token ${token}`, 
            'Accept': 'application/json' 
          };

          // Get profile from list and filter
          const pRes = await fetch(`${BASE}/profiles`, { headers });
          const allData = await pRes.json();
          const allProfiles = allData.results ? allData.results : allData;
          const found = allProfiles.find((p: any) => p.id.toString() === pId);
          setProfile(found);

          // Get this profile's posts
          const postsRes = await fetch(`${BASE}/${pId}/posts`, { headers });
          const postsData = await postsRes.json();
          console.log('Number of posts:', postsData.results?.length);
          console.log('First post photos:', JSON.stringify(postsData.results?.[0]?.photos));
          setPosts(postsData.results ? postsData.results : postsData);

        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }, [])
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <ActivityIndicator size="large" color="#A882DD" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.brand}>mini_insta</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Profile Header */}
        <View style={styles.profileHeaderWrapper}>
          {profile?.profile_image_url ? (
            <Image 
              source={{ uri: profile.profile_image_url }} 
              style={styles.avatar} 
            />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]} />
          )}
          <Text style={styles.username}>{profile?.username || ''}</Text>
          {profile?.bio_text ? (
            <Text style={styles.bioText}>{profile.bio_text}</Text>
          ) : null}

          {/* Metrics */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItemBordered}>
              <Text style={styles.metricCount}>{profile?.post_count ?? 0}</Text>
              <Text style={styles.metricLabel}>posts</Text>
            </View>
            <View style={styles.metricItemBordered}>
              <Text style={styles.metricCount}>{profile?.follower_count ?? 0}</Text>
              <Text style={styles.metricLabel}>followers</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricCount}>{profile?.following_count ?? 0}</Text>
              <Text style={styles.metricLabel}>following</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <Text style={styles.noPostsText}>No posts yet</Text>
        ) : (
          <View style={styles.postsGrid}>
            {posts.map((post: any) => {
              const photo = post.photos?.[0];
              const imgUri = photo?.image_url || 
                (photo?.image_file ? `https://cs-webapps.bu.edu${photo.image_file}` : null);
              return (
                <View key={post.id} style={styles.postThumb}>
                  {imgUri ? (
                    <Image 
                      source={{ uri: imgUri }} 
                      style={styles.thumbImage} 
                    />
                  ) : (
                    <View style={[styles.thumbImage, styles.thumbFallback]} />
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  container: { paddingBottom: 40 },
  brand: { 
    fontSize: 24, fontWeight: '800', fontStyle: 'italic', 
    color: '#A882DD', textAlign: 'center', paddingVertical: 14, 
    borderBottomWidth: 1, borderBottomColor: '#333' 
  },
  errorText: { color: '#C8154B', textAlign: 'center', marginVertical: 12 },
  profileHeaderWrapper: { 
    alignItems: 'center', paddingHorizontal: 20, paddingTop: 28,
    maxWidth: isTablet ? 600 : undefined, alignSelf: 'center', width: '100%' 
  },
  avatar: { 
    width: isTablet ? 160 : 110, height: isTablet ? 160 : 110,
    borderRadius: isTablet ? 80 : 55, borderWidth: 0.3, borderColor: 'gray' 
  },
  avatarFallback: { backgroundColor: '#302f2f' },
  username: { 
    marginTop: 14, fontSize: isTablet ? 32 : 22, 
    fontWeight: '800', color: '#fff' 
  },
  bioText: { 
    marginTop: 8, fontSize: 14, color: 'rgb(140,137,137)', 
    textAlign: 'center', maxWidth: 300 
  },
  metricsRow: { 
    flexDirection: 'row', alignItems: 'center', 
    marginTop: 16, paddingVertical: 8 
  },
  metricItem: { paddingHorizontal: 20, alignItems: 'center' },
  metricItemBordered: { 
    paddingHorizontal: 20, alignItems: 'center', 
    borderRightWidth: 1, borderRightColor: 'rgb(140,137,137)' 
  },
  metricCount: { fontSize: 18, fontWeight: '700', color: '#fff' },
  metricLabel: { fontSize: 12, color: 'rgb(140,137,137)' },
  divider: { 
    borderBottomWidth: 0.5, borderBottomColor: '#333', 
    marginVertical: 16, marginHorizontal: 20 
  },
  noPostsText: { 
    color: 'rgb(140,137,137)', textAlign: 'center', 
    marginTop: 20, fontSize: 14 
  },
  postsGrid: { 
    flexDirection: 'row', flexWrap: 'wrap', gap: 2 
  },
  postThumb: { width: THUMB_SIZE, height: THUMB_SIZE },
  thumbImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  thumbFallback: { backgroundColor: '#302f2f' },
});