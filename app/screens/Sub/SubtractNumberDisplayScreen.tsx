import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { SubtractStackParamList } from "@/types/types";
import * as Speech from "expo-speech";

type Props = StackScreenProps<SubtractStackParamList, "SubtractNumberDisplay">;

const SubtractNumberDisplayScreen: React.FC<Props> = ({ navigation, route }) => {
  const { digit, rows, time, speak, changeColor } = route.params;
  const [currentNumber, setCurrentNumber] = useState("");
  const [sum, setSum] = useState(0);
  const [count, setCount] = useState(0);
  const [textColor, setTextColor] = useState("#333");

  useEffect(() => {
    if (count === 0) {
      generateAndDisplayNumber(true);
      setCount(1);
      return;
    }

    if (count < parseInt(rows)) {
      const interval = setTimeout(() => {
        generateAndDisplayNumber();
        setCount((prev) => prev + 1);
      }, parseInt(time) * 1000);

      return () => clearTimeout(interval);
    } else {
      setTimeout(() => {
        navigation.replace("SubtractAnswer", { sum, digit, rows, time, speak, changeColor });
      }, 1000);
    }
  }, [count]);

  const generateAndDisplayNumber = (isFirst = false) => {
    let newNumber = generateValidNumber(parseInt(digit), isFirst);
    
    if (sum + newNumber < 0) {
      newNumber = Math.abs(newNumber); // Prevent negative sum
    }

    setCurrentNumber(newNumber.toString());
    setSum((prevSum) => prevSum + newNumber);

    if (speak) Speech.speak(newNumber.toString());

    if (changeColor) setTextColor(getRandomColor());
  };

  const generateValidNumber = (digits: number, isFirst: boolean) => {
    let num;
    do {
      num = Math.floor(Math.random() * (Math.pow(10, digits) - 1) + 1) * (Math.random() > 0.5 ? 1 : -1);
    } while (
      num === 0 || // Ensure no zero
      (isFirst && num < 0) // Ensure first number is positive
    );
    return num;
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
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  number: { fontSize: 80, fontWeight: "bold" },
});

export default SubtractNumberDisplayScreen;
