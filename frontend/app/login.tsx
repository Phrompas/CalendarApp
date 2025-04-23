import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../services/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Please fill in all fields');
    }
    
    if (!email.includes('@')) {
      return Alert.alert('Invalid email format');
    }

    try {
      const res = await fetch('http://10.0.2.2:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        await AsyncStorage.setItem('token', data.token);
        Alert.alert('Login success!');
        router.replace('/calendar');
      } else {
        Alert.alert('Login failed', data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Network error');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24, backgroundColor: 'white' }}>
      <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 24 }}>🔐 Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
        }}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
        }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: '#4F46E5',
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
