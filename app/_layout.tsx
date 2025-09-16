import React from "react";
import { Stack } from "expo-router";
import "../styles/global.css";
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { View } from "react-native";
import { Spinner } from "@/components/ui/spinner";


export default function RootLayout() {
  const [loaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
  });

  if (!loaded) {
    return (
      <View>
        <Spinner color={"blue"} focusable />
      </View>
    );
  }


  return (
    <Stack
      screenOptions={{
        headerShown: false,
 
      }}
    >
      <Stack.Screen name="(Home)/index" />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="(deviceOne)" />
      <Stack.Screen name="(deviceTwo)" />
      <Stack.Screen name="(deviceThree)" />
      <Stack.Screen name="(deviceFour)" />
      <Stack.Screen name="(deviceFive)" />
    </Stack>
  );
}