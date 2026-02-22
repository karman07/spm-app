import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import SquareRootQuizScreen from './SquareRootQuizScreen';

export type RootStackParamList = {
  Home: { mode: 'square' | 'cube' };
  SquareRootQuiz: {
    questions: number;
    time: number;
    digit: number;
    mode: 'square' | 'cube';
  };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function SquareRootNavigator({ mode = 'square' }: { mode?: 'square' | 'cube' }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ mode }}
      />
      <Stack.Screen name="SquareRootQuiz" component={SquareRootQuizScreen} />
    </Stack.Navigator>
  );
}
