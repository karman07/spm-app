import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Animated,
  TouchableOpacity,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Firestore import
import { auth, firestore } from "../../../config/firebase"; // Import Firestore DB
import Button from "../../components/Button";
import Input from "../../components/Input";
import LottieView from "lottie-react-native";
import { BASE_COLOR } from "@/colors/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

const LoginScreen: React.FC = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user details from Firestore
      const userDocRef = doc(firestore, "users", user.uid); // Assuming user data is in "users" collection
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Save user data in AsyncStorage
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({
            email: user.email,
            name: userData.name, 
            isLoggedIn: true,
          })
        );

        await AsyncStorage.setItem("signup", "true")

        console.log(   JSON.stringify({
          email: user.email,
          name: userData.name, 
          isLoggedIn: true,
        }))

        // Navigate to Drawer screen
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Drawer" }],
          })
        );
      } else {
        Alert.alert("Error", "User data not found in Firestore");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Lottie Animation */}
      <View style={styles.animationContainer}>
        <LottieView
          source={require("../../../assets/lottie/login.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>

      {/* Animated Title */}
      <Animated.Text
        style={[
          styles.title,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        Welcome Back
      </Animated.Text>

      {/* Animated Inputs */}
      <Animated.View
        style={[styles.inputContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <Input placeholder="Email" value={email} onChangeText={setEmail} />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </Animated.View>

      {/* Animated Login Button */}
      <Animated.View
        style={[styles.inputContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <Button title="Login" onPress={handleLogin} />
      </Animated.View>

      {/* Transparent "Create Account" Button */}
      <TouchableOpacity
        style={styles.fullWidthButton}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.transparentButtonText}>Create Account</Text>
      </TouchableOpacity>

      {/* Forgot Password Link */}
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f7fa",
    alignItems: "center",
  },
  animationContainer: {
    width: 180,
    height: 180,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
  },
  fullWidthButton: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderWidth: 2,
    borderColor: BASE_COLOR,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  transparentButtonText: {
    color: BASE_COLOR,
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    color: BASE_COLOR,
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LoginScreen;
