import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CalendarScreen() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  const weekdays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

  const getDaysInMonth = (year: number, month: number) => {
    const startDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const formatMonthYear = (date: Date) =>
    date.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });

  const isSameDate = (a: Date, b: Date) =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://10.0.2.2:3000/events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error('❌ API ไม่คืน array:', data);
        setAllEvents([]);
        return;
      }

      const upcoming = data.filter((event) => new Date(event.endTime) > new Date());
      setAllEvents(upcoming);

      const selectedDayEvents = upcoming.filter((e) =>
        isSameDate(new Date(e.startTime), selectedDate)
      );
      setEvents(selectedDayEvents);
    } catch (err) {
      console.error('❌ Fetch all events failed', err);
    }
    setLoading(false);
  };

  const hasEventOnDate = (date: Date) => {
    return allEvents.some((e) => isSameDate(new Date(e.startTime), date));
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [selectedDate])
  );

  useEffect(() => {
    setTimeout(() => {
      const scrollY = today.getMonth() * 400;
      scrollViewRef.current?.scrollTo({ y: scrollY, animated: true });
    }, 300);
  }, []);

  return (
    <ScrollView ref={scrollViewRef} style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
      {Array.from({ length: 12 }, (_, monthIndex) => {
        const year = today.getFullYear();
        const days = getDaysInMonth(year, monthIndex);
        const monthDate = new Date(year, monthIndex, 1);

        return (
          <View key={monthIndex} style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
              {formatMonthYear(monthDate)}
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              {weekdays.map((w, i) => (
                <Text key={i} style={{ width: 36, textAlign: 'center', color: '#6B7280', fontSize: 12 }}>
                  {w}
                </Text>
              ))}
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {days.map((day, i) => {
                const isSelected = day && isSameDate(day, selectedDate);
                const isToday = day && isSameDate(day, today);
                const hasEvent = day && hasEventOnDate(day);

                return (
                  <TouchableOpacity
                    key={i}
                    disabled={!day}
                    onPress={() => {
                      if (day) {
                        setSelectedDate(day);
                        const dayEvents = allEvents.filter((e) =>
                          isSameDate(new Date(e.startTime), day)
                        );
                        setEvents(dayEvents);
                      }
                    }}
                    style={{
                      width: '14.28%',
                      aspectRatio: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 8,
                      backgroundColor: isSelected ? '#4F46E5' : 'transparent',
                      marginBottom: 4,
                      position: 'relative',
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected ? 'white' : isToday ? '#4F46E5' : '#111827',
                        fontWeight: isToday ? 'bold' : 'normal',
                      }}
                    >
                      {day ? day.getDate() : ''}
                    </Text>
                    {hasEvent && (
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 6,
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: '#EF4444',
                        }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })}

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
        📌 กิจกรรมวันที่ {selectedDate.toLocaleDateString('th-TH')}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" />
      ) : events.length > 0 ? (
        events.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={{
              backgroundColor: '#F3F4F6',
              padding: 12,
              borderRadius: 12,
              marginBottom: 10,
            }}
            onPress={() => {
              router.push(`/event-form?edit=${event.id}`);
            }}
          >
            <Text style={{ fontWeight: '600', fontSize: 16 }}>{event.title}</Text>
            <Text style={{ color: '#6B7280', marginTop: 4 }}>
              {new Date(event.startTime).toLocaleTimeString('th-TH')} -{' '}
              {new Date(event.endTime).toLocaleTimeString('th-TH')}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={{ color: '#6B7280' }}>ไม่มีกิจกรรมในวันนี้</Text>
      )}
    </ScrollView>
  );
}
