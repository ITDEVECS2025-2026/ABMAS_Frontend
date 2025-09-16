import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <SafeAreaView>
      <Stack.Screen 
        name="DeviceFour"
        options={{ 
          title: 'Device Four' 
          
        }} 
      />
    </SafeAreaView>
  );
}