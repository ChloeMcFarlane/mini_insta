// File: app/(tabs)/profile.tsx
// Author: (cmcfar)/cmcfar@bu.edu

import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const { width: SCREEN_W } = Dimensions.get('window');
const isTablet = SCREEN_W >= 600;
const BASE = 'https://cs-webapps.bu.edu/cmcfar/mini_insta/api';

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
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

          const headers = { 'Authorization': `Token ${token}`, 'Accept': 'application/json' };

          const pRes = await fetch(`${BASE}/profiles`, { headers });
          const allData = await pRes.json();
          const allProfiles = allData.results ? allData.results : allData;
          const found = allProfiles.find((p: any) => p.id.toString() === pId);
          setProfile(found);
          return;
          
          console.log('Profile status:', pRes.status);
          if (!pRes.ok) throw new Error(`Profile fetch failed: ${pRes.status}`);
          setProfile(await pRes.json());

        } catch (err: any) {
          console.error(err);
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
        <View style={styles.profileHeaderWrapper}>
          <View style={styles.avatarPlaceholder} />
          <Text style={styles.username}>{profile?.username || ''}</Text>
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
          <View style={styles.divider} />
          {profile?.bio_text ? (
            <Text style={styles.bioText}>{profile.bio_text}</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  container: { 
    paddingBottom: 40 
  },
  brand: { 
    fontSize: 24, 
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
  profileHeaderWrapper: { 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 28, 
    maxWidth: isTablet ? 600 : undefined, 
    alignSelf: 'center', 
    width: '100%' 
  },
  avatarPlaceholder: { 
    width: isTablet ? 160 : 110, 
    height: isTablet ? 160 : 110, 
    borderRadius: isTablet ? 80 : 55, 
    backgroundColor: '#302f2f', 
    borderWidth: 0.3, 
    borderColor: 'gray' 
  },
  username: { 
    marginTop: 14, 
    fontSize: isTablet ? 32 : 22, 
    fontWeight: '800', 
    color: '#fff' 
  },
  metricsRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 16, 
    paddingVertical: 8 
  },
  metricItem: { 
    paddingHorizontal: 20, 
    alignItems: 'center' 
  },
  metricItemBordered: { 
    paddingHorizontal: 20, 
    alignItems: 'center', 
    borderRightWidth: 1, 
    borderRightColor: 'rgb(140,137,137)' 
  },
  metricCount: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#fff' 
  },
  metricLabel: { 
    fontSize: 12, 
    color: 'rgb(140,137,137)' 
  },
  divider: { 
    width: '100%', 
    maxWidth: 400, 
    borderBottomWidth: 0.5, 
    borderBottomColor: 'rgb(140,137,137)', 
    marginVertical: 20 
  },
  bioText: { 
    fontSize: 14, 
    color: 'rgb(140,137,137)', 
    textAlign: 'center', 
    maxWidth: 400, 
    lineHeight: 20, 
    marginBottom: 8 
  },
});