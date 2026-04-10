// File: app/(tabs)/feed.tsx
// Author: (cmcfar)/cmcfar@bu.edu
// Description: Tab screen for feed. Shows different content if logged in vs guest:

import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const { width: SCREEN_W } = Dimensions.get('window');
const MAX_W = Math.min(SCREEN_W, 600);
const BASE = 'https://cs-webapps.bu.edu/cmcfar/mini_insta/api';

export default function Feed() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useFocusEffect(React.useCallback(() => { fetchData(); }, []));

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = await AsyncStorage.getItem('userToken');
      const pId = await AsyncStorage.getItem('profileId');

      if (token && pId) {
        setIsLoggedIn(true);

        // Try feed; if empty fall back to own posts so screen isn't blank
        const feedRes = await fetch(`${BASE}/${pId}/feed`, {
          headers: { 'Authorization': `Token ${token}`, 'Accept': 'application/json' },
        });
        if (feedRes.ok) {
          const d = await feedRes.json();
          const arr = d.results ?? d;
          if (arr.length > 0) { setPosts(arr); return; }
        }

        // Fallback: show own posts
        const ownRes = await fetch(`${BASE}/${pId}/posts`, {
          headers: { 'Authorization': `Token ${token}`, 'Accept': 'application/json' },
        });
        const d2 = await ownRes.json();
        setPosts(d2.results ?? d2);

      } else {
        setIsLoggedIn(false);
        const res = await fetch(`${BASE}/profiles`, { headers: { 'Accept': 'application/json' } });
        const d = await res.json();
        setProfiles(d.results ?? d);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return (
    <SafeAreaView style={styles.center}>
      <ActivityIndicator size="large" color="#A882DD" />
    </SafeAreaView>
  );

  if (!isLoggedIn) return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.brand}>mini_insta</Text>
      <Text style={styles.guestNote}>Log in to see your feed.</Text>
      <TouchableOpacity
        style={styles.signInBtn}
        onPress={() => router.replace('/login')}
        activeOpacity={0.8}
      >
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.err}>{error}</Text> : null}
      <FlatList
        data={profiles}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }: any) => (
          <View style={styles.profileRow}>
            {item.profile_image_url
              ? <Image source={{ uri: item.profile_image_url }} style={styles.avatar} />
              : <View style={[styles.avatar, styles.avatarFallback]} />}
            <Text style={styles.name}>{item.username}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.brand}>mini_insta</Text>
      {error ? <Text style={styles.err}>{error}</Text> : null}
      {!error && posts.length === 0
        ? <Text style={styles.empty}>No posts yet — follow someone or make your first post!</Text>
        : null}
      <FlatList
        data={posts}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }: any) => {
          const photo = item.photos?.[0];
          const uri = photo?.image_url ?? (photo?.image_file ? `https://cs-webapps.bu.edu${photo.image_file}` : null);
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                {item.profile_details?.profile_image_url
                  ? <Image source={{ uri: item.profile_details.profile_image_url }} style={styles.avatar} />
                  : <View style={[styles.avatar, styles.avatarFallback]} />}
                <Text style={styles.name}>{item.profile_details?.username ?? 'user'}</Text>
              </View>
              {uri ? <Image source={{ uri }} style={styles.postImg} /> : null}
              {item.caption ? <Text style={styles.caption}>{item.caption}</Text> : null}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  brand: { fontSize: 28, fontWeight: '800', fontStyle: 'italic', color: '#A882DD', textAlign: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#333' },
  guestNote: { color: 'rgb(140,137,137)', textAlign: 'center', fontSize: 13, paddingVertical: 10 },
  loginLink: { color: '#A882DD', fontWeight: '600' },
  err: { color: '#C8154B', textAlign: 'center', marginVertical: 12, fontSize: 13 },
  empty: { color: 'rgb(140,137,137)', textAlign: 'center', marginTop: 40, fontSize: 14, paddingHorizontal: 32 },
  list: { paddingVertical: 12, alignItems: 'center' },
  profileRow: { width: MAX_W, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#222' },
  card: { width: MAX_W, borderWidth: 1, borderColor: '#333', borderRadius: 8, overflow: 'hidden', marginBottom: 20, backgroundColor: '#000' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  avatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 0.3, borderColor: 'gray' },
  avatarFallback: { backgroundColor: '#302f2f' },
  name: { marginLeft: 12, fontSize: 15, fontWeight: '600', color: '#fff' },
  postImg: { width: '100%', aspectRatio: 1, resizeMode: 'cover' },
  caption: { padding: 12, fontSize: 14, color: '#fff' },
  signInBtn: {
    marginHorizontal: 28,
    marginVertical: 10,
    paddingVertical: 14,
    backgroundColor: '#bc9ee6',
    borderWidth: 1,
    borderColor: '#A882DD',
    borderRadius: 8,
    alignItems: 'center',
  },
  signInText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});