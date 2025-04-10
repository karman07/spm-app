import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  Platform,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { DivRootStackParamList } from "@/types/types";
import { BASE_COLOR } from "@/colors/Colors";

type Props = StackScreenProps<DivRootStackParamList, "Division">;

const DivisionScreen: React.FC<Props> = ({ route }) => {
  const { questions, time, dividendDigits, divisorDigits } = route.params;

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [dividend, setDividend] = useState(0);
  const [divisor, setDivisor] = useState(0);
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timer, setTimer] = useState(time);
  const [quizOver, setQuizOver] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    generateQuestion();
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          endQuiz("Time's up!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const generateQuestion = () => {
    let a: number, b: number;
    do {
      b = Math.floor(Math.random() * (10 ** divisorDigits - 1)) + 1;
      const quotient = Math.floor(Math.random() * (10 ** (dividendDigits - divisorDigits)));
      a = b * quotient;
    } while (
      a < 1 || b < 1 || 
      (dividendDigits === 3 && (a < 100 || a > 999 || b > 99))
    );
    setDividend(a);
    setDivisor(b);
    setShowAnswer(false);
  };

  const showToast = (message: string) => {
    if (Platform.OS === "android") ToastAndroid.show(message, ToastAndroid.SHORT);
    else console.log(message);
  };

  const endQuiz = (message: string) => {
    setQuizOver(true);
    showToast(message);
  };

  const checkAnswer = () => {
    if (parseInt(answer) === dividend / divisor) {
      setCorrect(correct + 1);
    } else {
      setWrong(wrong + 1);
    }
    setShowAnswer(true);
    if (currentQuestion < questions) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setAnswer("");
        generateQuestion();
      }, 800);
    } else {
      setTimeout(() => endQuiz("Questions are over!"), 800);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(1);
    setCorrect(0);
    setWrong(0);
    setTimer(time);
    setAnswer("");
    setQuizOver(false);
    generateQuestion();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>⏳ {timer}s</Text>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>✅ {correct}</Text>
        <Text style={styles.scoreText}>❌ {wrong}</Text>
      </View>

      {!quizOver && (
        <>
          <Text style={styles.questionText}>{dividend} ÷ {divisor}</Text>
          {showAnswer && <Text style={styles.answerText}>Answer: {dividend / divisor}</Text>}
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Your answer"
            value={answer}
            onChangeText={setAnswer}
          />
          <TouchableOpacity style={styles.button} onPress={checkAnswer}>
            <Text style={styles.buttonText}>
              {currentQuestion < questions ? "Next ➡️" : "Finish 🎯"}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {quizOver && (
        <TouchableOpacity style={styles.retryButton} onPress={restartQuiz}>
          <Text style={styles.retryButtonText}>Retry 🔄</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  timer: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "600",
  },
  questionText: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
  },
  answerText: {
    fontSize: 20,
    color: "#007BFF",
    marginBottom: 10,
  },
  input: {
    width: "80%",
    padding: 14,
    fontSize: 22,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: BASE_COLOR,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  retryButton: {
    backgroundColor: BASE_COLOR,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 30,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DivisionScreen;
