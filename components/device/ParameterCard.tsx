// components/device/ParameterCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
};

export function ParameterCard({ label, value, unit, icon }: Props) {
  return (
    <View style={styles.card}>
      {icon}
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.unit}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, // Agar bisa membagi ruang secara rata
    minWidth: 100, // Lebar minimum
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    color: '#374151',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#166534',
    marginVertical: 4,
  },
  unit: {
    fontSize: 12,
    color: '#6b7280',
  },
});