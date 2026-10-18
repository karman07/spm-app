import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/colors/Colors";
import { QUIZ_TICK_SECONDS, tickDown, formatSeconds } from "@/utils/time";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { MulRootStackParamList } from "@/types/types";
import { BASE_COLOR } from "@/colors/Colors";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Props = StackScreenProps<MulRootStackParamList, "Multiplication">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MultiplicationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { colors: c } = useTheme();
  const styles = React.useMemo(() => createStyles(c), [c]);
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
  const [isCorrect, setIsCorrect] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentQuestion / questions,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestion, questions]);

  useEffect(() => {
    if (quizOver || showAnswer) return;

    setTimer(time);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= QUIZ_TICK_SECONDS + 0.001) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return tickDown(prev);
      });
    }, QUIZ_TICK_SECONDS * 1000);

    return () => clearInterval(interval);
  }, [currentQuestion, quizOver, showAnswer]);

  const handleTimeout = () => {
    setWrong((prev) => prev + 1);
    setIsCorrect(false);
    setShowAnswer(true);

    setTimeout(() => {
      if (currentQuestion < questions) {
        setCurrentQuestion((prev) => prev + 1);
        setAnswer("");
        generateNewQuestion();
      } else {
        setQuizOver(true);
      }
    }, 1500);
  };

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const generateExactDigitNumber = (digits: number) => {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    let num;
    do {
      num = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (num === 1); // Never allow 1
    return num;
  };

  const generateNewQuestion = () => {
    const newNum1 = generateExactDigitNumber(multiplier);
    const newNum2 = generateExactDigitNumber(multiplied);
    setNum1(newNum1);
    setNum2(newNum2);
    setShowAnswer(false);
  };

  const handleCheckAnswer = () => {
    const isAnswerCorrect = parseInt(answer) === num1 * num2;
    setIsCorrect(isAnswerCorrect);
    setShowAnswer(true);

    if (isAnswerCorrect) {
      setCorrect(correct + 1);
    } else {
      setWrong(wrong + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswer("");
        generateNewQuestion();
      } else {
        setQuizOver(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQuestion(1);
    setCorrect(0);
    setWrong(0);
    setTimer(time);
    setAnswer("");
    setQuizOver(false);
    generateNewQuestion();
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      {/* Header with Exit */}
      <View style={styles.header}>
        <View style={styles.timerBadge}>
          <Icon name="clock-outline" size={18} color={c.text} />
          <Text style={styles.timerText}>{formatSeconds(timer)}s</Text>
        </View>
        <TouchableOpacity
          style={styles.exitButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.exitButtonText}>Exit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {!quizOver ? (
          <>
            <View style={styles.progressContainer}>
              <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
            </View>
            <Text style={styles.countText}>Question {currentQuestion} of {questions}</Text>

            <View style={styles.questionCard}>
              <Text style={styles.questionText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.4}>
                {num1} <Text style={{ color: c.primary }}>×</Text> {num2}
              </Text>

              <View style={styles.divider} />

              <Text style={styles.inputLabel}>Enter your answer:</Text>
              <Input
                placeholder="0"
                value={answer}
                onChangeText={setAnswer}
                keyboardType="numeric"
              />

              {showAnswer ? (
                <View style={[styles.feedbackBadge, { backgroundColor: isCorrect ? "#4CAF5020" : "#F4433620" }]}>
                  <Icon
                    name={isCorrect ? "check-circle" : "close-circle"}
                    size={28}
                    color={isCorrect ? "#4CAF50" : "#F44336"}
                  />
                  <Text style={[styles.feedbackText, { color: isCorrect ? c.primary : c.danger }]}>
                    {isCorrect ? "Correct!" : `Oops! It's ${num1 * num2}`}
                  </Text>
                </View>
              ) : (
                <View style={styles.buttonWrapper}>
                  <Button title={currentQuestion < questions ? "Next" : "Finish"} onPress={handleCheckAnswer} />
                </View>
              )}
            </View>
          </>
        ) : (
          <View style={[styles.questionCard, { paddingVertical: 40 }]}>
            <Text style={styles.title}>Practice Complete!</Text>

            <View style={styles.finalScoreBoard}>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreValue}>{correct}</Text>
                <Text style={styles.scoreLabel}>Correct</Text>
              </View>
              <View style={styles.scoreDivider} />
              <View style={styles.scoreItem}>
                <Text style={[styles.scoreValue, { color: c.danger }]}>{wrong}</Text>
                <Text style={styles.scoreLabel}>Wrong</Text>
              </View>
            </View>

            <View style={{ marginTop: 30, width: "100%" }}>
              <Button title="Try Again" onPress={restartQuiz} />
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate("Home")}
              >
                <Text style={styles.secondaryButtonText}>Back to Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Mini Scoreboard at bottom during quiz */}
      {!quizOver && (
        <View style={styles.miniScoreboard}>
          <Text style={[styles.miniScoreText, { color: c.primary }]}>Correct: {correct}</Text>
          <View style={styles.miniDivider} />
          <Text style={[styles.miniScoreText, { color: c.danger }]}>Wrong: {wrong}</Text>
        </View>
      )}
    </View>
  );
};

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  header: {
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: c.border,
  },
  timerText: {
    fontSize: 16,
    fontWeight: "700",
    color: c.text,
    marginLeft: 6,
  },
  exitButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: c.button + "15",
    borderRadius: 20,
  },
  exitButtonText: {
    color: c.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  progressContainer: {
    width: "100%",
    height: 6,
    backgroundColor: c.border,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: c.button,
  },
  countText: {
    fontSize: 14,
    fontWeight: "600",
    color: c.textMuted,
    textAlign: "center",
    marginBottom: 20,
  },
  questionCard: {
    backgroundColor: c.surface,
    borderRadius: 25,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  questionText: {
    fontSize: 42,
    fontWeight: "900",
    color: c.text,
    marginVertical: 20,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: c.border,
    marginVertical: 20,
  },
  inputLabel: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "700",
    color: c.textMuted,
    textTransform: "uppercase",
    marginBottom: 10,
    marginLeft: 4,
  },
  buttonWrapper: {
    width: "100%",
    marginTop: 10,
  },
  feedbackBadge: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: c.text,
    marginBottom: 20,
    textAlign: "center",
  },
  finalScoreBoard: {
    flexDirection: "row",
    backgroundColor: c.background,
    borderRadius: 20,
    padding: 20,
    width: "100%",
    alignItems: "center",
  },
  scoreItem: {
    flex: 1,
    alignItems: "center",
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: "900",
    color: c.primary,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: c.textMuted,
    textTransform: "uppercase",
  },
  scoreDivider: {
    width: 1,
    height: 40,
    backgroundColor: c.border,
  },
  secondaryButton: {
    marginTop: 15,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: c.border,
  },
  secondaryButtonText: {
    color: c.textMuted,
    fontSize: 16,
    fontWeight: "700",
  },
  miniScoreboard: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: c.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  miniScoreText: {
    fontSize: 16,
    fontWeight: "700",
    color: c.text,
  },
  miniDivider: {
    width: 1,
    height: 15,
    backgroundColor: c.border,
    marginHorizontal: 15,
  },
});

export default MultiplicationScreen;
