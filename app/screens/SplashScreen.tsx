import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/colors/Colors";
import React, { useEffect, useRef } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_COLOR } from "@/colors/Colors";
import { CommonActions } from "@react-navigation/native";

export default function SplashScreen({ navigation }: any) {
  const { colors: c } = useTheme();
  const styles = React.useMemo(() => createStyles(c), [c]);
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

    const navigateToHome = () => {
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Drawer" }],
          })
        );
      }, 2000);
    };

    navigateToHome();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoTile, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Animated.Image
          source={require("../../assets/img/Sprouting_Minds_Abacus_(1).png")}
          style={styles.image}
        />
      </Animated.View>
      <Animated.Text style={[styles.brand, { opacity: fadeAnim }]}>Abacus</Animated.Text>
      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>Sharpen your mental math</Animated.Text>
      <ActivityIndicator size="small" color="#fff" style={styles.loader} />
    </View>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: c.header,
  },
  logoTile: {
    width: 150,
    height: 150,
    borderRadius: 40,
    backgroundColor: c.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  brand: {
    marginTop: 28,
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#fff",
  },
  tagline: {
    marginTop: 6,
    fontSize: 15,
    color: "rgba(255,255,255,0.78)",
  },
  loader: {
    marginTop: 40,
  },
});
