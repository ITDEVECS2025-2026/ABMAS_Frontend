import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{ 
          title: 'Device Four' 
        }} 
      />
    </Stack>
  );
}