import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MiniInsta Login</Text>
      
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername}
      />

      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword}
      />

      <Button title="Log In" onPress={() => console.log('Login pressed!')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
});