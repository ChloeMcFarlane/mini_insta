// File: app/(tabs)/post.tsx
// Author: (cmcfar)/cmcfar@bu.edu
// Description: This file defines the tab screen for post.

// Self-imports
import React, { useState, useEffect } from 'react';
import { StatusBar, View, Image, Text, ActivityIndicator, TextInput, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../assets/my_styles';

import EditScreenInfo from '@/components/EditScreenInfo';

export default function post() {
    // Definitions
const [isLoading, setIsLoading] = useState(false);
const [refreshing, setRefreshing] = useState(false);
const [post, setPost] = useState([]);
const [image, setImage] = useState<string | null>(null);
// const [picture, setPicture] = useState([]);
const [error, setError] = useState(''); 
const [postCap, setpostCap] = useState('');
const [postBody, setPostBody] = useState('');
const [isPosting, setIsPosting] = useState(false);

// pick image function
const pickImage = async () => {
  // No permissions request is necessary for launching the image library.
  // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
  // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
  // so the app users aren't surprised by a system dialog after picking a video.
  // See "Invoke permissions for videos" sub section for more details.
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

  console.log(result);

  if (!result.canceled) {
    setImage(result.assets[0].uri);
  }
};

// form function for adding a post
const formData = new FormData();
formData.append('caption', postCap); 
formData.append('image_file', {
  uri: image,
  name: 'photo.jpg',
  type: 'image/jpeg',
} as any);


// add post function
const addPost = async () => {
  setIsPosting(true);
  try{
    const response = await fetch('https://cs-webapps.bu.edu/cmcfar/mini_insta/api/post/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: postCap,
        text: postBody,
      }),
    });
    const newPost = await response.json();
    newPost = new FormData();
    setpostCap('');
    setPostBody('');
    setIsPosting(false);
    
  } catch (error){
    console.error('Error creating post:', error);
    setIsPosting(false);
    setError('Failed to add new post');
    return;
  }
};

// Loading state
if (isLoading) {
  return (
      <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fabaad" />
          <Text> Loading.... </Text>
      </SafeAreaView>
  )

}

// Refresh
const handleRefresh = async () => {
  setRefreshing(true);
  await fetchData(20)
  setRefreshing(false);
}

  return (
    <SafeAreaView style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
          <View style={styles.inputContainer}>
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
          </View>
            
            <TextInput style={styles.input} placeholder="Add caption..." value={postCap} onChangeText={setpostCap}/>
            <Button title={isPosting ? "Posting..." : "Create Post"} 
            onPress={addPost} 
            disabled={isPosting}/>
        </View>
    </SafeAreaView>
  );
}