import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { AddStackParamList } from "@/types/types";
import * as Speech from "expo-speech";
import { BASE_COLOR } from "@/colors/Colors";

type Props = StackScreenProps<AddStackParamList, "NumberDisplay">;

const NumberDisplayScreen: React.FC<Props> = ({ navigation, route }) => {
  const { digit, rows, time, speak, changeColor } = route.params;
  const [currentNumber, setCurrentNumber] = useState("");
  const [sum, setSum] = useState(0);
  const [count, setCount] = useState(0);
  const [textColor, setTextColor] = useState("#333");
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: count / parseInt(rows),
      duration: 300,
      useNativeDriver: false, // Width animation doesn't support native driver
    }).start();
  }, [count, rows]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Immediately show the first number to avoid the initial gap
    if (count === 0) {
      generateAndDisplayNumber();
      setCount(1);
    }

    if (count < parseInt(rows)) {
      interval = setInterval(() => {
        generateAndDisplayNumber();
        setCount((prev) => prev + 1);
      }, parseFloat(time) * 1000);
    } else {
      setTimeout(() => {
        navigation.navigate("Answer", { sum, digit, rows, time, speak, changeColor });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [count, digit, rows, time, speak, navigation]);

  const generateAndDisplayNumber = () => {
    const newNumber = generateNumber(parseInt(digit));
    setCurrentNumber(newNumber.toString());
    setSum((prevSum) => prevSum + newNumber);

    if (speak) {
      Speech.speak(newNumber.toString(), {
        language: "en-US",
        pitch: 1.0,
        rate: 0.5,
      });
    }

    if (changeColor) {
      setTextColor(getRandomColor());
    }
  };

  // Ensure number has exact number of digits (e.g. 100-999 for 3 digits)
  const generateNumber = (digits: number) => {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getRandomColor = () => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC300", "#900C3F"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      {/* Header-like row for Exit button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text style={styles.backButtonText}>Exit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, { width }]} />
        </View>

        <Text style={styles.countText}>Number {count} of {rows}</Text>

        <View style={styles.numberWrapper}>
          <Text style={[styles.number, { color: textColor }]}>{currentNumber}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    height: 100,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  progressContainer: {
    width: "80%",
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressBar: {
    height: "100%",
    backgroundColor: BASE_COLOR,
  },
  countText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#888",
    marginBottom: 40,
  },
  numberWrapper: {
    backgroundColor: "#FFF",
    width: 250,
    height: 250,
    borderRadius: 125,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  number: {
    fontSize: 90,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: BASE_COLOR + "15", // Light version of base color
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BASE_COLOR + "30",
  },
  backButtonText: {
    color: BASE_COLOR,
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});

export default NumberDisplayScreen;
