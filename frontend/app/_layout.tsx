import { Slot, useRouter, usePathname } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';

export default function Layout() {
  const router = useRouter();
  const pathname = usePathname();
  const today = new Date();

  const showTabs = pathname === '/calendar';

  return (
    <View style={{ flex: 1 }}>
      <Slot />

      {showTabs && (
        <View
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F3F4F6',
            padding: 12,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 6,
            elevation: 5,
          }}
        >
          <Text style={{ color: '#111827', fontSize: 16 }}>
            📆 {today.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/events')}
            style={{
              backgroundColor: '#4F46E5',
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>กิจกรรม</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
