import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore import
import { auth, firestore } from "../../../config/firebase"; // Import Firestore DB
import Button from "../../components/Button";
import Input from "../../components/Input";
import LottieView from "lottie-react-native";
import { BASE_COLOR } from "@/colors/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const LoginScreen: React.FC = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "62371647868-t84t8t8t8t8t8t8t8t8t8t.apps.googleusercontent.com", // This should be updated from Firebase Console
      offlineAccess: true,
    });

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

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();

      if (result.type === 'success') {
        const googleCredential = GoogleAuthProvider.credential(result.data.idToken);
        const userCredential = await signInWithCredential(auth, googleCredential);
        const user = userCredential.user;

        // Check if user exists in Firestore, if not create them
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        let name = user.displayName || "Google User";

        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            name,
            email: user.email,
            createdAt: new Date(),
            loginMethod: "google",
          });
        } else {
          name = userDoc.data().name;
        }

        await AsyncStorage.setItem(
          "user",
          JSON.stringify({
            email: user.email,
            name: name,
            isLoggedIn: true,
          })
        );
        await AsyncStorage.setItem("signup", "true");

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Drawer" }],
          })
        );
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Error", "Play services not available");
      } else {
        Alert.alert("Google Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
        {loading ? (
          <ActivityIndicator size="large" color={BASE_COLOR} style={{ marginVertical: 10 }} />
        ) : (
          <>
            <Button title="Login" onPress={handleLogin} />

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
            >
              <Icon name="google" size={24} color="#DB4437" style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
          </>
        )}
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

      {/* Skip Button */}
      <TouchableOpacity
        style={{ marginTop: 25 }}
        onPress={() => navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Drawer" }],
          })
        )}
      >
        <Text style={[styles.link, { color: '#888' }]}>Skip for now</Text>
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#888",
    fontWeight: "600",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    width: "100%",
    marginBottom: 10,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
});

export default LoginScreen;
