// app/(deviceFour)/index.tsx

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAtomValue } from 'jotai';
import { mqqtMessageAtom } from '@/store/atom';

import { ParameterCard } from '@/components/device/ParameterCard';
import { GaugeCard } from '@/components/device/GaugeCard';

const calculateProgress = (value: number, min: number, max: number) => {
  if (value < min) return 0;
  if (value > max) return 1;
  return (value - min) / (max - min);
};

export default function SecondDeviceScreen() { 
  const messages = useAtomValue(mqqtMessageAtom);
  // console.log('All Messages:', messages);
  const latestMessage = JSON.parse(messages[0]?.message || '{}') || {};
  // console.log('Latest Message:', latestMessage);

  // console.log(typeof latestMessage.N)
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Utama */}
      <View style={styles.header}>
        {/* JUDUL DAN IKON DIUBAH */}
        <Text style={styles.title}>🍃 Device 1 Monitor</Text> 
        <Text style={styles.subtitle}>Real-time Soil & Enviromental Data</Text>
        <Text style={styles.updateText}>
          Last Update: {messages[0]?.timestamp ? new Date(messages[0].timestamp).toLocaleTimeString() : 'No data'}
        </Text>
      </View>

      <View style={styles.statusCard}>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Data Status</Text>
        <View style={styles.statusIndicatorRow}>
          <View style={[
            styles.statusDot,
            { backgroundColor: messages[0] ? '#10b981' : '#ef4444' }
          ]} />
          <Text style={[
            styles.statusText,
            {
              backgroundColor: messages[0] ? '#dcfce7' : '#fee2e2',
              color: messages[0] ? '#166534' : '#991b1b'
            }
          ]}>
            {messages[0] ? 'Active' : 'No Data'}
          </Text>
        </View>
      </View>
    </View>

      {/* 2. Section Soil Parameters */}
      <Text style={styles.sectionTitle}>🌱 Soil Parameters</Text>
      <View style={styles.cardRow}>
        <ParameterCard label="Nitrogen" value={Number(latestMessage.N || 0).toFixed(1)} unit="mg/kg" icon={<Text style={styles.iconText}>N</Text>} />
        <ParameterCard label="Phosphorus" value={Number(latestMessage.P || 0).toFixed(1)} unit="mg/kg" icon={<Text style={styles.iconText}>P</Text>} />
        <ParameterCard label="Potassium" value={Number(latestMessage.K || 0).toFixed(1)} unit="mg/kg" icon={<Text style={styles.iconText}>K</Text>} />
      </View>
       <View style={styles.cardRow}>
        <ParameterCard label="Conductivity" value={Number(latestMessage.EC || 0).toFixed(1)} unit="μs/cm" icon={<Text style={styles.iconEmoji}>⚡️</Text>} />
        <ParameterCard label="Power of Hydrogen" value={Number(latestMessage.pH || 0).toFixed(1)} unit="pH" icon={<Text style={styles.iconEmoji}>🧪</Text>} />
      </View>

      {/* 3. Section Environment Statistics */}
      <Text style={styles.sectionTitle}>🏡 Environment Statistics</Text>
      <View style={styles.cardRowWrap}>
        <GaugeCard label="Temperature" value={Number(latestMessage.TempOut || 0).toFixed(1)} unit="°C" progress={calculateProgress(latestMessage.TempOut || 0, 0, 50)} icon={<Text style={styles.iconEmoji}>🌡️</Text>} />
        <GaugeCard label="Humidity" value={Number(latestMessage.HumOut || 0).toFixed(1)} unit="%" progress={calculateProgress(latestMessage.HumOut || 0, 0, 100)} icon={<Text style={styles.iconEmoji}>💧</Text>} />
        <GaugeCard label="Light Intensity" value={Number(latestMessage.Lux || 0).toFixed(0)} unit="lux" progress={calculateProgress(latestMessage.Lux|| 0, 0, 2000)} icon={<Text style={styles.iconEmoji}>☀️</Text>} />
        <GaugeCard label="Pressure" value={Number(latestMessage.PresOut || 0).toFixed(1)} unit="hPa" progress={calculateProgress(latestMessage.PresOut || 0, 900, 1100)} icon={<Text style={styles.iconEmoji}>📊</Text>} />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#166534',
  },
  subtitle: {
    fontSize: 14,
    color: '#15803d',
  },
  updateText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14532d',
    marginBottom: 16,
    marginTop: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
   cardRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  iconEmoji: {
    fontSize: 24,
  },
  statusCard: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 14,
  },
});