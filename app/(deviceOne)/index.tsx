
import React from "react";
import { View, Text, ScrollView } from "react-native";



export default function FirstDeviceScreen() {
  return (
    <View className="flex-1 bg-zinc-700 justify-center items-center">
      <ScrollView>
        <Text>N</Text>
      </ScrollView>
      <ScrollView>
        <Text>P</Text>
      </ScrollView>
      <ScrollView>
        <Text>K</Text>
      </ScrollView>
      <ScrollView>
        <Text>EC</Text>
      </ScrollView>
      <ScrollView>
        <Text>PH</Text>
      </ScrollView>
      <ScrollView>
        <Text>TempIn</Text>
      </ScrollView>
      <ScrollView>
        <Text>HumidityIn</Text>
      </ScrollView>
      <ScrollView>
        <Text>PressureIn</Text>
      </ScrollView>
      <ScrollView>
        <Text>TempOut</Text>
      </ScrollView>
      <ScrollView>
        <Text>HumidityOut</Text>
      </ScrollView>
      <ScrollView>
        <Text>PressureOut</Text>
      </ScrollView>
      <ScrollView>
        <Text>Light</Text>
      </ScrollView>

    </View>
  )
}