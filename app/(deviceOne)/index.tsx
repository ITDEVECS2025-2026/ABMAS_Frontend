import { mqqtMessageAtom } from "@/store/atom";
import { useAtomValue } from "jotai";
import React from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import SpeedometerCard from "@/components/Speedometer/Speedometer";


export default function FirstDeviceScreen() {
  const Messages = useAtomValue(mqqtMessageAtom);
  const latestMessage = Messages[0]?.parsedMessage || {};

  const sensorData = [
    { key: 'N', label: 'Nitrogen', icon: '🌿', color: '#10b981', maxValue: 100, unit: 'mg/kg' },
    { key: 'P', label: 'Phosphorus', icon: '🧪', color: '#f59e0b', maxValue: 100, unit: 'mg/kg' },
    { key: 'K', label: 'Potassium', icon: '⚡', color: '#8b5cf6', maxValue: 100, unit: 'mg/kg' },
    { key: 'EC', label: 'Conductivity', icon: '🔌', color: '#06b6d4', maxValue: 5, unit: 'dS/m' },
    { key: 'PH', label: 'pH Level', icon: '🧬', color: '#ef4444', maxValue: 14, unit: 'pH' },
    { key: 'Light', label: 'Light Intensity', icon: '☀️', color: '#f97316', maxValue: 1000, unit: 'lux' },
  ];

  const environmentData = [
    { key: 'TempIn', label: 'Indoor Temp', icon: '🌡️', unit: '°C', color: '#dc2626' },
    { key: 'HumidityIn', label: 'Indoor Humidity', icon: '💧', unit: '%', color: '#0891b2' },
    { key: 'PressureIn', label: 'Indoor Pressure', icon: '📊', unit: 'hPa', color: '#7c3aed' },
    { key: 'TempOut', label: 'Outdoor Temp', icon: '🌡️', unit: '°C', color: '#ea580c' },
    { key: 'HumidityOut', label: 'Outdoor Humidity', icon: '💧', unit: '%', color: '#0284c7' },
    { key: 'PressureOut', label: 'Outdoor Pressure', icon: '📊', unit: 'hPa', color: '#9333ea' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.decorativeCircle} />
        <Text style={styles.headerTitle}>🌾 Device 1 Monitor</Text>
        <Text style={styles.headerSubtitle}>Real-time Soil & Environmental Data</Text>
        <Text style={styles.lastUpdate}>
          Last Update: {Messages[0]?.timestamp ? new Date(Messages[0].timestamp).toLocaleString() : 'No data'}
        </Text>
      </View>

      {/* Status Indicator */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Data Status</Text>
          <View style={styles.statusIndicatorRow}>
            <View style={[
              styles.statusDot,
              { backgroundColor: Messages[0] ? '#10b981' : '#ef4444' }
            ]} />
            <Text style={[
              styles.statusText,
              {
                backgroundColor: Messages[0] ? '#dcfce7' : '#fee2e2',
                color: Messages[0] ? '#166534' : '#991b1b'
              }
            ]}>
              {Messages[0] ? 'Active' : 'No Data'}
            </Text>
          </View>
        </View>
      </View>

      {/* Soil Parameters - Speedometers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌱 Soil Parameters</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.speedometerScroll}>
          {/* {sensorData.map((sensor) => (
            <SpeedometerCard
              key={sensor.key}
              value={parseFloat(latestMessage[sensor.key]) || 0}
              maxValue={sensor.maxValue}
              unit={sensor.unit}
              label={sensor.label}
              color={sensor.color}
              size={140}
            />
          ))} */}
        </ScrollView>
      </View>


      {/* Quick Stats */}
      <View style={styles.quickStatsSection}>
        <Text style={styles.sectionTitle}>📈 Quick Statistics</Text>
        <View style={styles.quickStatsGrid}>
          <View style={styles.quickStatCard}>
            <Text style={styles.quickStatIcon}>🎯</Text>
            <Text style={styles.quickStatLabel}>NPK Total</Text>
            <Text style={styles.quickStatValue}>
              {((parseFloat(latestMessage.N) || 0) + 
                (parseFloat(latestMessage.P) || 0) + 
                (parseFloat(latestMessage.K) || 0)).toFixed(1)}
            </Text>
          </View>
          
          <View style={styles.quickStatCard}>
            <Text style={styles.quickStatIcon}>🌡️</Text>
            <Text style={styles.quickStatLabel}>Temp Avg</Text>
            <Text style={styles.quickStatValue}>
              {(((parseFloat(latestMessage.TempIn) || 0) + 
                 (parseFloat(latestMessage.TempOut) || 0)) / 2).toFixed(1)}°C
            </Text>
          </View>
          
          <View style={styles.quickStatCard}>
            <Text style={styles.quickStatIcon}>💧</Text>
            <Text style={styles.quickStatLabel}>Humidity Avg</Text>
            <Text style={styles.quickStatValue}>
              {(((parseFloat(latestMessage.HumidityIn) || 0) + 
                 (parseFloat(latestMessage.HumidityOut) || 0)) / 2).toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Background Elements */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
      <View style={styles.backgroundCircle3} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    padding: 16,
  },
  header: {
    marginBottom: 24,
    position: 'relative',
    alignItems: 'center',
  },
  decorativeCircle: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    backgroundColor: '#bbf7d0',
    borderRadius: 16,
    opacity: 0.3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#166534',
    marginBottom: 8,
  },
  headerSubtitle: {
    textAlign: 'center',
    color: '#16a34a',
    fontSize: 14,
    marginBottom: 8,
  },
  lastUpdate: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 12,
    fontStyle: 'italic',
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 16,
    textAlign: 'left',
  },
  speedometerScroll: {
    paddingVertical: 10,
  },
  speedometerContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  circleContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  unitText: {
    fontSize: 10,
    color: '#6b7280',
  },
  speedometerLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dataCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  dataCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dataCardIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  dataCardLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  dataCardContent: {
    alignItems: 'flex-start',
  },
  dataCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dataCardUnit: {
    fontSize: 12,
    color: '#6b7280',
  },
  quickStatsSection: {
    marginBottom: 24,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  quickStatIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#166534',
  },
  backgroundCircle1: {
    position: 'absolute',
    top: 80,
    left: 40,
    width: 64,
    height: 64,
    backgroundColor: '#bbf7d0',
    borderRadius: 32,
    opacity: 0.2,
  },
  backgroundCircle2: {
    position: 'absolute',
    top: 240,
    right: 32,
    width: 48,
    height: 48,
    backgroundColor: '#6ee7b7',
    borderRadius: 24,
    opacity: 0.15,
  },
  backgroundCircle3: {
    position: 'absolute',
    bottom: 160,
    left: 24,
    width: 80,
    height: 80,
    backgroundColor: '#dcfce7',
    borderRadius: 40,
    opacity: 0.25,
  },
});