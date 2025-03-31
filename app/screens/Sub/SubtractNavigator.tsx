import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SubtractSettingsScreen from "./SubtractSettingsScreen";
import SubtractNumberDisplayScreen from "./SubtractNumberDisplayScreen";
import SubtractAnswerScreen from "./SubtractAnswerScreen";
import { SubtractStackParamList } from "@/types/types";

const Stack = createStackNavigator<SubtractStackParamList>();

const SubtractNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SubtractSettings" component={SubtractSettingsScreen} />
      <Stack.Screen name="SubtractNumberDisplay" component={SubtractNumberDisplayScreen} />
      <Stack.Screen name="SubtractAnswer" component={SubtractAnswerScreen} />
    </Stack.Navigator>
  );
};

export default SubtractNavigator;
