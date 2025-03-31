import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "./SettingsScreen";
import NumberDisplayScreen from "./NumberDisplayScreen";
import AnswerScreen from "./AnswerScreen";
import { AddStackParamList } from "@/types/types";

const Stack = createStackNavigator<AddStackParamList>();

const AddNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="NumberDisplay" component={NumberDisplayScreen} />
      <Stack.Screen name="Answer" component={AnswerScreen} />
    </Stack.Navigator>
  );
};

export default AddNavigator;
