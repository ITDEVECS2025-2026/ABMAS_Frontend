import React from "react";
import { Stack } from "expo-router";
import "../styles/global.css";
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { View } from "react-native";
import { Spinner } from "@/components/ui/spinner";
import { Provider } from 'jotai';


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
    <Provider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="(burung)" />
        <Stack.Screen name="(soil)" />
      </Stack>
    </Provider>
  );
}