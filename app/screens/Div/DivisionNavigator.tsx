import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DivisionHomeScreen from "./DivisionHomeScreen";
import DivisionScreen from "./DivisionScreen";
import { DivRootStackParamList } from "@/types/types";

const Stack = createStackNavigator<DivRootStackParamList>();

const DivisionNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={DivisionHomeScreen} />
    <Stack.Screen name="Division" component={DivisionScreen} />
  </Stack.Navigator>
);

export default DivisionNavigator;
