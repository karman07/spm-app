// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import Quiz from './Quiz';
import Result from './Result';
import { Provider as PaperProvider } from 'react-native-paper';


export type RootStackParamList = {
    Home: undefined;
    Quiz: undefined;
    Result: { correct: number; wrong: number };
  };

const Stack = createNativeStackNavigator<RootStackParamList>();
  
export default function RiddlesNavigator() {
  return (
    <PaperProvider>
        <Stack.Navigator initialRouteName="Home"   screenOptions={{
          headerShown: false, // 🚫 Hide header on all screens
        }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Quiz" component={Quiz} />
          <Stack.Screen name="Result" component={Result} />
        </Stack.Navigator>
    </PaperProvider>
  );
}
