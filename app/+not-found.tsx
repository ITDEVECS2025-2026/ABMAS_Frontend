import { View, Text } from "react-native";
import React from "react";
export default function NotFoundScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: 'red'
      }}>404 - Not Found</Text>
    </View>
  );
}