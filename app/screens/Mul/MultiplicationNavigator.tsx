import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import MultiplicationScreen from "./MultiplicationScreen";
import { MulRootStackParamList } from "@/types/types";

const Stack = createStackNavigator<MulRootStackParamList>();

export default function MultiplicationNavigator() {
  return (
   
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Multiplication" component={MultiplicationScreen} />
      </Stack.Navigator>

  );
}
