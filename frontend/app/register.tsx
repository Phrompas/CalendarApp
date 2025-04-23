import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      return Alert.alert('Please fill in all fields');
    }

    try {
      const res = await fetch('http://10.0.2.2:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Register success!', 'You can now log in.');
        router.replace('/login');
      } else {
        Alert.alert('Error', data.error || 'Register failed');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Network error');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24, backgroundColor: 'white' }}>
      <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 24 }}>📩 Register</Text>

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
        onPress={handleRegister}
        style={{
          backgroundColor: '#10B981',
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}
