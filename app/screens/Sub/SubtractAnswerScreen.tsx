import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SubtractStackParamList } from "@/types/types";
import Input from "../../components/Input";
import LottieView from "lottie-react-native";
import { BASE_COLOR } from "@/colors/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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
      <View style={styles.card}>
        <Text style={styles.title}>Practice Result</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Digits</Text>
            <Text style={styles.statValue}>{digit}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Rows</Text>
            <Text style={styles.statValue}>{rows}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Time</Text>
            <Text style={styles.statValue}>{time}s</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.inputLabel}>Enter the total sum:</Text>
        <Input
          placeholder="0"
          value={userAnswer}
          onChangeText={setUserAnswer}
          keyboardType="numeric"
        />

        {!showAnswer ? (
          <TouchableOpacity
            style={[styles.button, isButtonDisabled && styles.disabledButton]}
            onPress={checkAnswer}
            disabled={isButtonDisabled}
          >
            <Text style={styles.buttonText}>Check Answer</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.feedbackContainer}>
            <View style={[styles.feedbackBadge, { backgroundColor: isCorrect ? "#4CAF5020" : "#F4433620" }]}>
              <Icon
                name={isCorrect ? "check-circle" : "close-circle"}
                size={34}
                color={isCorrect ? "#4CAF50" : "#F44336"}
              />
              <Text style={[styles.result, { color: isCorrect ? "#2E7D32" : "#D32F2F" }]}>
                {isCorrect ? "Perfectly Correct!" : `Wrong! Correct Sum: ${sum}`}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.tryAgainButton}
              onPress={() => navigation.navigate("SubtractNumberDisplay", { digit, rows, time, speak, changeColor })}
            >
              <Text style={styles.tryAgainText}>Retake Practice</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tryAgainButton, { marginTop: 15, borderColor: '#888' }]}
              onPress={() => navigation.navigate("SubtractSettings")}
            >
              <Text style={[styles.tryAgainText, { color: '#666' }]}>Change Settings</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.scoreBoard}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreValue}>{correctCount}</Text>
          <Text style={styles.scoreLabel}>Correct</Text>
        </View>
        <View style={styles.scoreDivider} />
        <View style={styles.scoreItem}>
          <Text style={[styles.scoreValue, { color: "#D32F2F" }]}>{wrongCount}</Text>
          <Text style={styles.scoreLabel}>Missed</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 20,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  statBox: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: BASE_COLOR,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 10,
  },
  button: {
    backgroundColor: BASE_COLOR,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: BASE_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  disabledButton: {
    backgroundColor: "#BDC3C7",
    shadowOpacity: 0,
  },
  feedbackContainer: {
    marginTop: 10,
  },
  feedbackBadge: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 15,
    marginBottom: 20,
  },
  result: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
    flex: 1,
  },
  tryAgainButton: {
    borderWidth: 2,
    borderColor: BASE_COLOR,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  tryAgainText: {
    color: BASE_COLOR,
    fontSize: 16,
    fontWeight: "700",
  },
  scoreBoard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    marginTop: 30,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  scoreItem: {
    flex: 1,
    alignItems: "center",
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#2E7D32",
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    marginTop: 4,
  },
  scoreDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#EEE",
  },
});

export default SubtractAnswerScreen;
