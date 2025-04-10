import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./screens/SplashScreen";
import AuthNavigator from "./screens/auth/AuthNavigator";
import DrawerNavigator from "./screens/DrawerNavigator";
import { BASE_COLOR } from "@/colors/Colors";
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import NativeAdComponent from "./components/BannerAd";

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    mobileAds()
      .setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false
      }).then(() => {
        return mobileAds().initialize()
      }).then(() => {
        console.log("Admob Success")
      }).catch((error) => {
        console.log("Admob failed : ", error)
      })
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
