import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { DivRootStackParamList } from "@/types/types";
import { BASE_COLOR } from "@/colors/Colors";

type Props = StackScreenProps<DivRootStackParamList, "Home">;

const DivisionHomeScreen: React.FC<Props> = ({ navigation }) => {
  const [questions, setQuestions] = useState("");
  const [time, setTime] = useState("");
  const [dividendDigits, setDividendDigits] = useState("");
  const [divisorDigits, setDivisorDigits] = useState("");
  const scaleAnim = new Animated.Value(1);

  const startQuiz = () => {
    if (!questions || !time || !dividendDigits || !divisorDigits) return;
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      navigation.navigate("Division", {
        questions: parseInt(questions),
        time: parseInt(time),
        dividendDigits: parseInt(dividendDigits),
        divisorDigits: parseInt(divisorDigits),
      });
    });
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Number of Questions" keyboardType="numeric" onChangeText={setQuestions} />
      <TextInput style={styles.input} placeholder="Time per Question (sec)" keyboardType="numeric" onChangeText={setTime} />
      <TextInput style={styles.input} placeholder="Dividend Digits (e.g., 2)" keyboardType="numeric" onChangeText={setDividendDigits} />
      <TextInput style={styles.input} placeholder="Divisor Digits (e.g., 1)" keyboardType="numeric" onChangeText={setDivisorDigits} />

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
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    fontSize: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default DivisionHomeScreen;
