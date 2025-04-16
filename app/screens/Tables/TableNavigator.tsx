import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './NumberButtonsScreen';
import CustomInputScreen from './CustomInputScreen';
import TableDisplayScreen from './TableDisplayScreen';

export type RootStackParamList = {
  Home: undefined;
  CustomInput: undefined;
  TableDisplay: { number: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // 🚫 Hide header on all screens
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CustomInput" component={CustomInputScreen} />
        <Stack.Screen name="TableDisplay" component={TableDisplayScreen} />
      </Stack.Navigator>
  );
}
