import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { AddStackParamList } from "@/types/types";
import * as Speech from "expo-speech";

type Props = StackScreenProps<AddStackParamList, "NumberDisplay">;

const NumberDisplayScreen: React.FC<Props> = ({ navigation, route }) => {
  const { digit, rows, time, speak, changeColor } = route.params;
  const [currentNumber, setCurrentNumber] = useState("");
  const [sum, setSum] = useState(0);
  const [count, setCount] = useState(0);
  const [textColor, setTextColor] = useState("#333");

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
      }, parseInt(time) * 1000);
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

  // Ensure no number is zero
  const generateNumber = (digits: number) => {
    let number;
    do {
      number = Math.floor(Math.random() * Math.pow(10, digits));
    } while (number === 0); // Regenerate if zero
    return number;
  };

  const getRandomColor = () => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC300", "#900C3F"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.number, { color: textColor }]}>{currentNumber}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  number: {
    fontSize: 80,
    fontWeight: "bold",
  },
});

export default NumberDisplayScreen;
