// File: app/(tabs)/post.tsx
// Author: (cmcfar)/cmcfar@bu.edu
// Description: Create post screen with auth check, image upload, and image URL fallback.

import React, { useState, useEffect } from 'react';
import { View,TextInput,TouchableOpacity,StyleSheet,Text,ActivityIndicator,Alert,Image,ScrollView,KeyboardAvoidingView,Platform,Dimensions,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const { width: SCREEN_W } = Dimensions.get('window');
const isTablet = SCREEN_W >= 600;

export default function PostScreen() {
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrlFocused, setImageUrlFocused] = useState(false);
  const [error, setError] = useState('');
  const [postCap, setPostCap] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [capFocused, setCapFocused] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth on mount
  useEffect(() => {
    AsyncStorage.getItem('userToken').then(token => {
      setIsLoggedIn(!!token);
      setAuthChecked(true);
    });
  }, []);

  const handleRefresh = () => {
    setImage(null);
    setImageUrl('');
    setPostCap('');
    setError('');
  };

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission required', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageUrl(''); // clear URL if file is picked
      setError('');
    }
  };

  const addPost = async () => {
    if (!image && !imageUrl) {
      setError('Please select an image or enter an image URL');
      return;
    }
    setIsPosting(true);
    setError('');
    try {
      const token = await AsyncStorage.getItem('userToken');
      const profileId = await AsyncStorage.getItem('profileId');

      const formData = new FormData();
      formData.append('profile', profileId as string);
      formData.append('caption', postCap);

      if (image) {
        // File upload path
        formData.append('image_file', {
          uri: Platform.OS === 'ios' ? image.replace('file://', '') : image,
          name: 'photo.jpg',
          type: 'image/jpeg',
        } as any);
      } else if (imageUrl) {
        // URL path
        formData.append('image_url', imageUrl);
      }

      const response = await fetch(
        'https://cs-webapps.bu.edu/cmcfar/mini_insta/api/post/create',
        {
          method: 'POST',
          headers: { 'Authorization': `Token ${token}` },
          body: formData,
        }
      );

      const data = await response.json();
      console.log('Post status:', response.status, 'data:', JSON.stringify(data));

      if (response.ok) {
        setImage(null);
        setImageUrl('');
        setPostCap('');
        Alert.alert('Success!', 'Your post was created!', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/feed') }
        ]);
      } else {
        setError('Failed: ' + JSON.stringify(data));
      }
    } catch (err: any) {
      console.error('Post error:', err);
      setError('Connection error: ' + err.message);
    } finally {
      setIsPosting(false);
    }
  };

  // Still checking auth
  if (!authChecked) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A882DD" />
      </SafeAreaView>
    );
  }

  // Not logged in
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.notLoggedInContainer}>
          <Text style={styles.title}>Create Post</Text>
          <Text style={styles.notLoggedInText}>
            You need to be logged in to create a post.
          </Text>
          <TouchableOpacity
            style={styles.btnLogin}
            onPress={() => router.replace('/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnLoginText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Posting spinner
  if (isPosting) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A882DD" />
        <Text style={styles.loadingText}>Uploading your post...</Text>
      </SafeAreaView>
    );
  }

  const hasImage = !!image || !!imageUrl;
  const previewUri = image || (imageUrl || null);

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

          {/* Image picker */}
          <Text style={styles.sectionLabel}>Photo</Text>
          <View style={styles.imageContainer}>
            <TouchableOpacity
              style={styles.pickBtn}
              onPress={pickImage}
              activeOpacity={0.8}
            >
              <Text style={styles.pickBtnText}>
                {image ? 'Change Photo' : 'Pick from Camera Roll'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* OR divider */}
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          {/* Image URL input */}
          <Text style={styles.sectionLabel}>Paste an Image URL</Text>
          <TextInput
            style={[styles.input, imageUrlFocused && styles.inputFocused]}
            placeholder="https://example.com/photo.jpg"
            placeholderTextColor="rgb(140,137,137)"
            value={imageUrl}
            onChangeText={(text) => {
              setImageUrl(text);
              if (text) setImage(null); // clear file if URL is typed
            }}
            autoCapitalize="none"
            keyboardType="url"
            onFocus={() => setImageUrlFocused(true)}
            onBlur={() => setImageUrlFocused(false)}
          />

          {/* Preview */}
          {previewUri ? (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: previewUri }}
                style={styles.preview}
              />
            </View>
          ) : null}

          {/* Caption */}
          <Text style={styles.sectionLabel}>Caption</Text>
          <TextInput
            style={[styles.input, styles.captionInput, capFocused && styles.inputFocused]}
            placeholder="Add a caption..."
            placeholderTextColor="rgb(140,137,137)"
            value={postCap}
            onChangeText={setPostCap}
            multiline
            numberOfLines={3}
            onFocus={() => setCapFocused(true)}
            onBlur={() => setCapFocused(false)}
          />

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.btnPost, !hasImage && styles.btnDisabled]}
              onPress={addPost}
              activeOpacity={hasImage ? 0.8 : 1}
              disabled={!hasImage}
            >
              <Text style={styles.btnPostText}>Create Post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnCancel}
              onPress={handleRefresh}
              activeOpacity={0.8}
            >
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
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  notLoggedInText: {
    color: 'rgb(140,137,137)',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  btnLogin: {
    backgroundColor: '#bc9ee6',
    borderWidth: 1,
    borderColor: '#A882DD',
    borderRadius: 8,
    paddingVertical: 13,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  btnLoginText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
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
    marginBottom: 16,
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
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  orText: {
    color: 'rgb(140,137,137)',
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  preview: {
    width: isTablet ? 400 : 300,
    height: isTablet ? 300 : 225,
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
    marginBottom: 16,
  },
  captionInput: {
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
  btnDisabled: {
    backgroundColor: '#555',
    borderColor: '#444',
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