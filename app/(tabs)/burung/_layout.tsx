// Lokasi: app/(tabs)/burung/_layout.tsx
import React from 'react';
import { Slot } from 'expo-router';
import { useBirdDetection } from '@/lib/hooks/useBirdDetection'; // <-- 1. Import hook

export default function BirdDetectionLayout() {
  useBirdDetection();

  return <Slot />;
}