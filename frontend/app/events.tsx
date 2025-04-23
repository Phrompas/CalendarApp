import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EventsScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://10.0.2.2:3000/events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Fetch all events failed', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📆 รายการกิจกรรมทั้งหมด</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/event-form')}>
        <Text style={styles.addButtonText}>➕ เพิ่มกิจกรรม</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" />
      ) : events.length > 0 ? (
        events.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDescription}>{event.description}</Text>
            <Text style={styles.eventTime}>
              {new Date(event.startTime).toLocaleTimeString()} -{' '}
              {new Date(event.endTime).toLocaleTimeString()}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.noEventText}>ไม่มีกิจกรรมในวันนี้</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4F46E5',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  eventCard: {
    backgroundColor: '#E5E7EB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  eventTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  eventDescription: {
    color: '#4B5563',
    marginBottom: 4,
  },
  eventTime: {
    color: '#6B7280',
    fontSize: 12,
  },
  noEventText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 32,
  },
});
