import React, { useEffect, useRef } from "react";
import { View, ActivityIndicator, StyleSheet, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_COLOR } from "@/colors/Colors";
import { CommonActions } from "@react-navigation/native";

export default function SplashScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage cleared!");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    ]).start();

    // clearStorage()

    const checkSignupStatus = async () => {
      try {
        const signupStatus = await AsyncStorage.getItem("signup");
        const routeName = signupStatus === "true" ? "Drawer" : "Auth";

        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: routeName }],
            })
          );
        }, 2000);
      } catch (error) {
        console.error("Error fetching signup status", error);
      }
    };

    checkSignupStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../assets/img/Sprouting_Minds_Abacus_(1).png")}
        style={[styles.image, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
      />
      <ActivityIndicator size="large" color={BASE_COLOR} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});
