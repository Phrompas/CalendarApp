import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to Calendar App📆</Text>

      <TouchableOpacity
        style={{
          backgroundColor: '#4F46E5',
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
          marginBottom: 12,
        }}
        onPress={() => router.push('/login')}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: '#10B981',
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
        }}
        onPress={() => router.push('/register')}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}
