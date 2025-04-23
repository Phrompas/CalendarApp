import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useLocalSearchParams, router } from 'expo-router';

export default function EventFormScreen() {
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const isEdit = !!edit;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  const showStartPicker = () => setStartPickerVisible(true);
  const hideStartPicker = () => setStartPickerVisible(false);

  const showEndPicker = () => setEndPickerVisible(true);
  const hideEndPicker = () => setEndPickerVisible(false);

  const handleConfirmStart = (date: Date) => {
    setStartTime(date);
    hideStartPicker();
  };

  const handleConfirmEnd = (date: Date) => {
    setEndTime(date);
    hideEndPicker();
  };

  const fetchEvent = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`http://10.0.2.2:3000/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const event = data.find((e: any) => e.id == edit);
      if (event) {
        setTitle(event.title);
        setDescription(event.description);
        setStartTime(new Date(event.startTime));
        setEndTime(new Date(event.endTime));
      }
    } catch (err) {
      console.error('Fetch event failed', err);
    }
  };

  useEffect(() => {
    if (isEdit) {
      fetchEvent();
    }
  }, [edit]);

  const handleSubmit = async () => {
    if (!title || !description || !startTime || !endTime) {
      return Alert.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(
        isEdit ? `http://10.0.2.2:3000/events/${edit}` : 'http://10.0.2.2:3000/events',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Alert.alert(isEdit ? 'แก้ไขกิจกรรมแล้ว' : 'เพิ่มกิจกรรมเรียบร้อย');
        router.replace('/calendar');
      } else {
        Alert.alert('ไม่สำเร็จ', data?.error || 'Unknown error');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isEdit ? '✏️ แก้ไขกิจกรรม' : '📝 เพิ่มกิจกรรม'}</Text>

      <TextInput
        placeholder="ชื่อกิจกรรม"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="รายละเอียด"
        value={description}
        onChangeText={setDescription}
        multiline
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
      />

      <TouchableOpacity style={styles.pickerButton} onPress={showStartPicker}>
        <Text style={styles.pickerText}>
          {startTime ? `เริ่ม: ${startTime.toLocaleString('th-TH')}` : 'เลือกเวลาเริ่มต้น'}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="datetime"
        onConfirm={handleConfirmStart}
        onCancel={hideStartPicker}
        locale="th-TH"
      />

      <TouchableOpacity style={styles.pickerButton} onPress={showEndPicker}>
        <Text style={styles.pickerText}>
          {endTime ? `สิ้นสุด: ${endTime.toLocaleString('th-TH')}` : 'เลือกเวลาสิ้นสุด'}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="datetime"
        onConfirm={handleConfirmEnd}
        onCancel={hideEndPicker}
        locale="th-TH"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isEdit ? 'อัปเดตกิจกรรม' : 'บันทึกกิจกรรม'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  pickerButton: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
  pickerText: {
    fontSize: 16,
    color: '#111827',
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
