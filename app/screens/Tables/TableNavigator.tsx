import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './NumberButtonsScreen';
import CustomInputScreen from './CustomInputScreen';
import TableDisplayScreen from './TableDisplayScreen';
import DodgingTableSettings from './DodgingTableSettings';
import DodgingTableQuizScreen from './DodgingTableQuizScreen';

export type RootStackParamList = {
  Home: undefined;
  CustomInput: undefined;
  TableDisplay: { number: number };
  DodgingTableSettings: undefined;
  DodgingTableQuiz: {
    startTable: number;
    endTable: number;
    questions: number;
    time: number;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function TableNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CustomInput" component={CustomInputScreen} />
      <Stack.Screen name="TableDisplay" component={TableDisplayScreen} />
      <Stack.Screen name="DodgingTableSettings" component={DodgingTableSettings} />
      <Stack.Screen name="DodgingTableQuiz" component={DodgingTableQuizScreen} />
    </Stack.Navigator>
  );
}
