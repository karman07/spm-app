import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { MulRootStackParamList } from "@/types/types";
import { BASE_COLOR } from "@/colors/Colors";

type Props = StackScreenProps<MulRootStackParamList, "Home">;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [questions, setQuestions] = useState("");
  const [time, setTime] = useState("");
  const [multiplier, setMultiplier] = useState("");
  const [multiplied, setMultiplied] = useState("");
  const scaleAnim = new Animated.Value(1);

  const startQuiz = () => {
    if (!questions || !time || !multiplier || !multiplied) return;
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      navigation.navigate("Multiplication", {
        questions: parseInt(questions),
        time: parseInt(time),
        multiplier: parseInt(multiplier),
        multiplied: parseInt(multiplied),
      });
    });
  };

  return (
    <View style={styles.container}>

      <TextInput style={styles.input} placeholder="Number of Questions" keyboardType="numeric" onChangeText={setQuestions} />
      <TextInput style={styles.input} placeholder="Time per Question (sec)" keyboardType="numeric" onChangeText={setTime} />
      <TextInput style={styles.input} placeholder="Multiplier Digit (e.g., 2)" keyboardType="numeric" onChangeText={setMultiplier} />
      <TextInput style={styles.input} placeholder="Multiplied Digit (e.g., 3)" keyboardType="numeric" onChangeText={setMultiplied} />

      <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity style={styles.button} onPress={startQuiz}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    fontSize: 18,
    color: "#333",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonWrapper: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: BASE_COLOR,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HomeScreen;
