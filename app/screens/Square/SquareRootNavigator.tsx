import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import SquareRootQuizScreen from './SquareRootQuizScreen';

export type RootStackParamList = {
  Home: undefined;
  SquareRootQuiz: { questions: number; time: number, digit:number
   };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function SquareRootNavigator() {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SquareRootQuiz" component={SquareRootQuizScreen} />
      </Stack.Navigator>
  );
}
