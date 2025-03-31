import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../../../config/firebase";
import Button from "../../components/Button";
import Input from "../../components/Input";
import LottieView from "lottie-react-native";
import { Picker } from "@react-native-picker/picker";
import { BASE_COLOR } from "@/colors/Colors";

const RegisterScreen: React.FC = ({ navigation }: any) => {
  const [name, setName] = useState<string>("");
  const [guardianName, setGuardianName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedInstitute, setSelectedInstitute] = useState<string>("");

  const handleRegister = async () => {
    if (!name || !guardianName || !mobile || !email || !password || !selectedInstitute) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid; // Get user ID

      // Save user details in Firestore
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
          <Picker
            selectedValue={selectedInstitute}
            onValueChange={(itemValue: string) => setSelectedInstitute(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Institute" value="" />
            <Picker.Item label="ABC Institute" value="abc" />
            <Picker.Item label="XYZ University" value="xyz" />
            <Picker.Item label="LMN Academy" value="lmn" />
          </Picker>
        </View>

        {/* Register Button */}
        <Button title="Register" onPress={handleRegister} />

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
  link: {
    color: BASE_COLOR,
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RegisterScreen;
