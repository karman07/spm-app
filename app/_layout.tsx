import React from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./screens/SplashScreen"; // ✅ Import Splash Screen
import AuthNavigator from "./screens/auth/AuthNavigator";
import DrawerNavigator from "./screens/DrawerNavigator";
import { BASE_COLOR } from "@/colors/Colors";

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar backgroundColor={BASE_COLOR} />
        <Stack.Navigator screenOptions={{ headerShown: false }}> 
          <Stack.Screen name="Splash" component={SplashScreen} /> 
          <Stack.Screen name="Auth" component={AuthNavigator} />
          <Stack.Screen name="Drawer" component={DrawerNavigator} />
        </Stack.Navigator>
    </GestureHandlerRootView>
  );
}
