import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { Platform } from "react-native";
import SplashScreen from "./screens/SplashScreen";
import AuthNavigator from "./screens/auth/AuthNavigator";
import DrawerNavigator from "./screens/DrawerNavigator";
import { BASE_COLOR } from "@/colors/Colors";
import NativeAdComponent from "./components/BannerAd";

import { initMobileAds } from "./utils/mobileAds";

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    initMobileAds();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar backgroundColor={BASE_COLOR} />
      {/* 👇 Optional: global banner ad */}
      {/* <BannerAdComponent /> */}

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Drawer" component={DrawerNavigator} />
      </Stack.Navigator>

    </GestureHandlerRootView>
  );
}
