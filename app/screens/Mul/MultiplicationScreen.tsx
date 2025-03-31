import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { MulRootStackParamList } from "@/types/types";
import { BASE_COLOR } from "@/colors/Colors";

type Props = StackScreenProps<MulRootStackParamList, "Multiplication">;

const MultiplicationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { questions, time, multiplier, multiplied } = route.params;
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
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
          setQuizOver(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const generateQuestion = () => {
    const newNum1 = Math.floor(Math.random() * Math.pow(10, multiplier));
    const newNum2 = Math.floor(Math.random() * Math.pow(10, multiplied));
    setNum1(newNum1);
    setNum2(newNum2);
    setShowAnswer(false);
  };

  const checkAnswer = () => {
    if (parseInt(answer) === num1 * num2) {
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
      }, 1000);
    } else {
      setTimeout(() => {
        setQuizOver(true);
      }, 1000);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(1);
    setCorrect(0);
    setWrong(0);
    setTimer(time);
    setQuizOver(false);
    generateQuestion();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>⏳ {timer} sec</Text>

      <View style={styles.scoreContainer}>
        <Text style={styles.correctAnswers}>✅ Correct: {correct}</Text>
        <Text style={styles.wrongAnswers}>❌ Wrong: {wrong}</Text>
      </View>

      {quizOver ? (
        <View style={styles.overlay}>
          <Text style={styles.quizOverText}>🎯 Questions Over!</Text>
          <Text style={styles.correctAnswers}>✅ Correct: {correct}</Text>
          <Text style={styles.wrongAnswers}>❌ Wrong: {wrong}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={restartQuiz}>
            <Text style={styles.retryButtonText}>Retry 🔄</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.question}>{num1} × {num2}</Text>

          {showAnswer && (
            <Text style={styles.answerText}>Correct Answer: {num1 * num2}</Text>
          )}

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter Answer"
            value={answer}
            onChangeText={setAnswer}
            editable={!quizOver}
          />

          <TouchableOpacity 
            style={[styles.button, quizOver && styles.disabledButton]} 
            onPress={checkAnswer} 
            disabled={quizOver}
          >
            <Text style={styles.buttonText}>
              {currentQuestion < questions ? "Next ➡️" : "Finish 🎯"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  timer: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
  },
  correctAnswers: {
    fontSize: 18,
    color: "#28a745",
    fontWeight: "bold",
  },
  wrongAnswers: {
    fontSize: 18,
    color: "#dc3545",
    fontWeight: "bold",
  },
  question: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#222",
    marginVertical: 20,
  },
  answerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 10,
  },
  input: {
    width: "80%",
    padding: 15,
    borderWidth: 1.5,
    borderColor: "#555",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 24,
    color: "#222",
    backgroundColor: "#ffffff",
    marginBottom: 20,
  },
  button: {
    backgroundColor: BASE_COLOR,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  overlay: {
    backgroundColor: "rgba(255,255,255,0.95)",
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  quizOverText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FF4500",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: BASE_COLOR,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default MultiplicationScreen;
