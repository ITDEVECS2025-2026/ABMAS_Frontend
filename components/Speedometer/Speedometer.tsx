
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Speedometer, { Arc, Needle, Progress, Marks } from "react-native-cool-speedometer";

type Props = {
  value: number;
  maxValue: number;
  unit: string;
  label: string;
  color: string;
  size?: number;
};

export default function SpeedometerCard({
  value,
  maxValue,
  unit,
  label,
  color,
  size = 160,
}: Props) {
  return (
    <View style={styles.container}>
      <Speedometer
        value={value}
        max={maxValue}
        angle={180}
        fontFamily="Arial"
        width={size}
        height={size / 2 + 40}
      >
        <Arc arcWidth={15} color={color} />
        <Progress arcWidth={15} />
        <Needle color="#374151" />
        <Marks step={maxValue / 5} lineColor="#9ca3af" />
      </Speedometer>

      <Text style={styles.valueText}>
        {value.toFixed(1)} {unit}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 12,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#dcfce7",
  },
  valueText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#166534",
    marginTop: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginTop: 4,
  },
});
