import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../../../config/firebase";
import Button from "../../components/Button";
import Input from "../../components/Input";
import LottieView from "lottie-react-native";
import { Picker } from "@react-native-picker/picker";
import { BASE_COLOR } from "@/colors/Colors";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

const RegisterScreen: React.FC = ({ navigation }: any) => {
  const [name, setName] = useState<string>("");
  const [guardianName, setGuardianName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedInstitute, setSelectedInstitute] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const institutes = [
    { label: "ABC Institute", value: "abc" },
    { label: "XYZ University", value: "xyz" },
    { label: "LMN Academy", value: "lmn" },
  ];

  const handleRegister = async () => {
    if (!name || !guardianName || !mobile || !email || !password || !selectedInstitute) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(firestore, "users", userId), {
        name,
        guardianName,
        mobile,
        email,
        selectedInstitute,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Account Created Successfully!");
      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();

      if (result.type === 'success') {
        const googleCredential = GoogleAuthProvider.credential(result.data.idToken);
        const userCredential = await signInWithCredential(auth, googleCredential);
        const user = userCredential.user;

        // Check/Create user in Firestore
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        let userName = user.displayName || "Google User";

        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            name: userName,
            email: user.email,
            createdAt: new Date(),
            loginMethod: "google",
          });
        } else {
          userName = userDoc.data().name;
        }

        await AsyncStorage.setItem(
          "user",
          JSON.stringify({
            email: user.email,
            name: userName,
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
      if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Google Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Lottie Animation */}
        <View style={styles.animationContainer}>
          <LottieView
            source={require("../../../assets/lottie/register.json")}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Create Account</Text>

        {/* Input Fields */}
        <Input placeholder="Full Name" value={name} onChangeText={setName} />
        <Input
          placeholder="Guardian Name"
          value={guardianName}
          onChangeText={setGuardianName}
        />
        <Input
          placeholder="Mobile Number"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Institute Dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Select Institute</Text>
          {Platform.OS === "ios" ? (
            <>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowPicker(true)}
              >
                <Text style={styles.pickerButtonText}>
                  {selectedInstitute
                    ? institutes.find((i) => i.value === selectedInstitute)?.label
                    : "Choose Institute"}
                </Text>
              </TouchableOpacity>
              <Modal
                visible={showPicker}
                transparent={true}
                animationType="slide"
              >
                <View style={styles.modalContainer}>
                  <View style={styles.pickerWrapper}>
                    <TouchableOpacity
                      style={styles.doneButton}
                      onPress={() => setShowPicker(false)}
                    >
                      <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                    <Picker
                      selectedValue={selectedInstitute}
                      onValueChange={(itemValue: string) =>
                        setSelectedInstitute(itemValue)
                      }
                    >
                      <Picker.Item label="Select Institute" value="" />
                      {institutes.map((i) => (
                        <Picker.Item
                          key={i.value}
                          label={i.label}
                          value={i.value}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              </Modal>
            </>
          ) : (
            <Picker
              selectedValue={selectedInstitute}
              onValueChange={(itemValue: string) => setSelectedInstitute(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Institute" value="" />
              {institutes.map((i) => (
                <Picker.Item key={i.value} label={i.label} value={i.value} />
              ))}
            </Picker>
          )}
        </View>

        {/* Register Button */}
        {loading ? (
          <ActivityIndicator size="large" color={BASE_COLOR} style={{ marginVertical: 20 }} />
        ) : (
          <>
            <Button title="Register" onPress={handleRegister} />

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleRegister}
            >
              <Icon name="google" size={24} color="#DB4437" style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Sign Up with Google</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Already have an account? */}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f7fa",
    alignItems: "center",
  },
  animationContainer: {
    width: 200,
    height: 200,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  dropdownContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    padding: 10,
  },
  picker: {
    width: "100%",
    height: 50,
  },
  pickerButton: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  doneButton: {
    alignItems: "flex-end",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  doneButtonText: {
    color: BASE_COLOR,
    fontSize: 18,
    fontWeight: "bold",
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
    width: "100%",
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

export default RegisterScreen;
