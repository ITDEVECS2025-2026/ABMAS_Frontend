// Di file baru: app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'; // (Atau ikon lain)

// Fungsi helper untuk ikon
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        // Opsi untuk styling tab Anda
      }}>
      <Tabs.Screen
        // Nama "abmas" merujuk ke folder app/(tabs)/abmas
        name="Soil"
        options={{
          title: 'Soil Monitoring', // Judul di header
          tabBarLabel: 'Tanah', // Teks di tab bar
          headerShown: false, // Biarkan layout di dlm abmas/ yg atur header
          tabBarIcon: ({ color }) => <FontAwesome name="tachometer" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        // Nama "burung" merujuk ke folder app/(tabs)/burung
        name="burung"
        options={{
          title: 'Deteksi Burung',
          tabBarLabel: 'Deteksi',
          headerShown: false, // Biarkan layout di dlm burung/ yg atur header
          tabBarIcon: ({ color }) => <TabBarIcon name="binoculars" color={color} />,
        }}
      />
    </Tabs>
  );
}