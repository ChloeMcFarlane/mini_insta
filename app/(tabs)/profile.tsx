// File: app/(tabs)/profile.tsx
// Author: (cmcfar)/cmcfar@bu.edu
// Description: This file defines the tab screen for a profile.
//  * If the user is not logged in, they are redirected to the login screen.
//  * NOTE: Data fetching to be wired up in a future session.
//  * CONVERSATION USED TO GENERATE STYLING FOR THIS FILE: https://claude.ai/share/9cd36580-8d68-40fd-88e0-dbbae15d1ab0

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const { width: SCREEN_W } = Dimensions.get('window');
const isTablet = SCREEN_W >= 600;
const THUMB_SIZE = (SCREEN_W - 3 * 2) / 3;

export default function Profile() {
  const router = useRouter();

  // Redirect to login if no token
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) router.replace('/login');
    };
    checkAuth();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Page title */}
        <Text style={styles.brand}>mini_insta</Text>

        {/* Profile header placeholder */}
        <View style={styles.profileHeaderWrapper}>
          {/* Avatar placeholder */}
          <View style={styles.avatarPlaceholder} />

          {/* Username placeholder */}
          <Text style={styles.username}>username</Text>

          {/* Metrics row */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItemBordered}>
              <Text style={styles.metricCount}>—</Text>
              <Text style={styles.metricLabel}>posts</Text>
            </View>
            <View style={styles.metricItemBordered}>
              <Text style={styles.metricCount}>—</Text>
              <Text style={styles.metricLabel}>followers</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricCount}>—</Text>
              <Text style={styles.metricLabel}>following</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Bio area */}
          <Text style={styles.aboutTitle}>About Me</Text>
          <Text style={styles.bioText}>Bio will appear here once data fetching is wired up.</Text>
        </View>

        {/* Posts grid placeholder */}
        <View style={styles.postsGrid}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.postThumb} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    paddingBottom: 40,
  },
  brand: {
    fontSize: 24,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#A882DD',
    textAlign: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileHeaderWrapper: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 28,
    maxWidth: isTablet ? 600 : undefined,
    alignSelf: 'center',
    width: '100%',
  },
  avatarPlaceholder: {
    width: isTablet ? 160 : 110,
    height: isTablet ? 160 : 110,
    borderRadius: isTablet ? 80 : 55,
    backgroundColor: '#302f2f',
    borderWidth: 0.3,
    borderColor: 'gray',
  },
  username: {
    marginTop: 14,
    fontSize: isTablet ? 32 : 22,
    fontWeight: '800',
    color: '#fff',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  metricItem: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  metricItemBordered: {
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgb(140,137,137)',
  },
  metricCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  metricLabel: {
    fontSize: 12,
    color: 'rgb(140,137,137)',
  },
  divider: {
    width: '100%',
    maxWidth: 400,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgb(140,137,137)',
    marginVertical: 20,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: 'rgb(140,137,137)',
    textAlign: 'center',
    maxWidth: 400,
    lineHeight: 20,
    marginBottom: 8,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    paddingTop: 20,
    width: '100%',
  },
  postThumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    backgroundColor: '#302f2f',
  },
});