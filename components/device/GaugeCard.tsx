// components/device/GaugeCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

type Props = {
  label: string;
  value: string;
  unit: string;
  progress: number; // Nilai 0 sampai 1
  icon: React.ReactNode;
};

const GAUGE_SIZE = 120;
const STROKE_WIDTH = 12;
const RADIUS = (GAUGE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = RADIUS * Math.PI;

export function GaugeCard({ label, value, unit, progress, icon }: Props) {
  const strokeDashoffset = CIRCUMFERENCE - CIRCUMFERENCE * progress;
  // console.log(strokeDashoffset)
  // console.log(progress)
  return (
    <View style={styles.card}>
      <View style={styles.gaugeContainer}>
        <Svg width={GAUGE_SIZE} height={GAUGE_SIZE / 2 + STROKE_WIDTH} viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE / 2 + STROKE_WIDTH}`}>
          {/* Latar Belakang Gauge */}
          <Path
            d={`M ${STROKE_WIDTH / 2} ${GAUGE_SIZE / 2} A ${RADIUS} ${RADIUS} 0 0 1 ${GAUGE_SIZE - STROKE_WIDTH / 2} ${GAUGE_SIZE / 2}`}
            stroke="#e5e7eb"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            fill="none"
          />
          {/* Foreground Gauge (Progress) */}
          <Path
            d={`M ${STROKE_WIDTH / 2} ${GAUGE_SIZE / 2} A ${RADIUS} ${RADIUS} 0 0 1 ${GAUGE_SIZE - STROKE_WIDTH / 2} ${GAUGE_SIZE / 2}`}
            stroke="#10b981"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
          />
        </Svg>
        <View style={styles.iconContainer}>
          {icon}
        </View>
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.unit}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        width: '48%', // Mengambil hampir setengah lebar
        marginBottom: 16,
    },
    gaugeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    iconContainer: {
        position: 'absolute',
    },
    label: {
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
    },
    value: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#166534',
        marginVertical: 4,
    },
    unit: {
        fontSize: 14,
        color: '#6b7280',
    },
});