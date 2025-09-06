

import { mqqtMessageAtom } from "@/store/atom";
import { useAtomValue } from "jotai";
import React from "react";
import { View, Text, ScrollView } from "react-native";



export default function FirstDeviceScreen() {
   const Messages = useAtomValue(mqqtMessageAtom);

   const latestMessage =Messages[0]?.parsedMessage || {};
  return (
    <View className="flex-1 bg-zinc-700 justify-center items-center">
      <ScrollView>
        <Text>N: {latestMessage.N ?? "-"}</Text>
     
      </ScrollView>
      <ScrollView>
        <Text>P: {latestMessage.P ?? "-"}</Text>
      
      </ScrollView>
      <ScrollView>
        <Text>K: {latestMessage.K ?? "-"}</Text>
     
      </ScrollView>
      <ScrollView>
        <Text>EC: {latestMessage.EC ?? "-" }</Text>
      
      </ScrollView>
      <ScrollView>
        <Text>PH: {latestMessage.PH ?? "-"}</Text>
      
      </ScrollView>
      <ScrollView>
        <Text>TempIn: {latestMessage.TempIn ?? "-"}</Text>
        
      </ScrollView>
      <ScrollView>
        <Text>HumidityIn: {latestMessage.HumidityIn ?? "-"}</Text>
      
      </ScrollView>
      <ScrollView>
        <Text>PressureIn: {latestMessage.PressureIn ?? "-"}</Text>
       
      </ScrollView>
      <ScrollView>
        <Text>TempOut: {latestMessage.TempOut ?? "-"}</Text>
       
      </ScrollView>
      <ScrollView>
        <Text>HumidityOut: {latestMessage.HumidityOut ?? "-"}</Text>
      
      </ScrollView>
      <ScrollView>
        <Text>PressureOut: {latestMessage.PressureOut ?? "-"}</Text>
    
      </ScrollView>
      <ScrollView>
        <Text>Light: {latestMessage.Light ?? "-"}</Text>
       
      </ScrollView>
    </View>
  )
}