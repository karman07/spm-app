import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SubtractStackParamList } from "@/types/types";
import Input from "../../components/Input";
import LottieView from "lottie-react-native";
import { BASE_COLOR } from "@/colors/Colors";

type Props = StackScreenProps<SubtractStackParamList, "SubtractAnswer">;

const SubtractAnswerScreen: React.FC<Props> = ({ navigation, route }) => {
  const { sum, digit, rows, time, speak, changeColor } = route.params;
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const storageKey = `subtract-${digit}-${rows}-${time}`;

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const storedData = await AsyncStorage.getItem(storageKey);
        if (storedData) {
          const { correct, wrong } = JSON.parse(storedData);
          setCorrectCount(correct || 0);
          setWrongCount(wrong || 0);
        }
      } catch (error) {
        console.error("Error loading counts from AsyncStorage:", error);
      }
    };

    loadCounts();
  }, [storageKey]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("SubtractSettings");
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);

  const checkAnswer = async () => {
    setShowAnswer(true);
    const isAnswerCorrect = parseInt(userAnswer) === sum;
    setIsCorrect(isAnswerCorrect);
    setIsButtonDisabled(true);

    try {
      let newCorrectCount = correctCount;
      let newWrongCount = wrongCount;

      if (isAnswerCorrect) {
        newCorrectCount += 1;
        setCorrectCount(newCorrectCount);
      } else {
        newWrongCount += 1;
        setWrongCount(newWrongCount);
      }

      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify({ correct: newCorrectCount, wrong: newWrongCount })
      );
    } catch (error) {
      console.error("Error saving counts to AsyncStorage:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter the Answer</Text>

      <Input
        placeholder="Your Answer"
        value={userAnswer}
        onChangeText={setUserAnswer}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.button, isButtonDisabled && styles.disabledButton]}
        onPress={checkAnswer}
        disabled={isButtonDisabled}
      >
        <Text style={styles.buttonText}>Check Answer</Text>
      </TouchableOpacity>

      {showAnswer && (
        <View style={styles.animationContainer}>
          <LottieView
            source={isCorrect ? require("@/assets/lottie/correct.json") : require("@/assets/lottie/wrong.json")}
            autoPlay
            loop={false}
            style={styles.animation}
          />
          <Text style={styles.result}>
            {isCorrect ? "✅ Correct!" : `❌ Wrong! Answer: ${sum}`}
          </Text>
        </View>
      )}

      <View style={styles.scoreContainer}>
        <Text style={styles.correctText}>✅ Correct: {correctCount}</Text>
        <Text style={styles.wrongText}>❌ Wrong: {wrongCount}</Text>
      </View>

      <TouchableOpacity
        style={styles.tryAgainButton}
        onPress={() => navigation.navigate("SubtractNumberDisplay", { digit, rows, time, speak, changeColor })}
      >
        <Text style={styles.tryAgainText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  result: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },
  animationContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  animation: {
    width: 150,
    height: 150,
  },
  button: {
    backgroundColor: BASE_COLOR,
    paddingVertical: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#A0A0A0",
  },
  tryAgainButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: BASE_COLOR,
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  tryAgainText: {
    color: BASE_COLOR,
    fontSize: 18,
    fontWeight: "bold",
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
  correctText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
  },
  wrongText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
});

export default SubtractAnswerScreen;
