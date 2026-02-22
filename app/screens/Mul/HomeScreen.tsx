import React, { useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { MulRootStackParamList } from "@/types/types";
import { BASE_COLOR } from "@/colors/Colors";
import Input from "../../components/Input";
import Button from "../../components/Button";

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
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Multiplication Master</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Questions</Text>
          <Input
            placeholder="e.g. 10"
            value={questions}
            onChangeText={setQuestions}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time per Question (sec)</Text>
          <Input
            placeholder="e.g. 5"
            value={time}
            onChangeText={setTime}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.inputGroupSmall}>
            <Text style={styles.label}>Multiplier Digits</Text>
            <Input
              placeholder="1-3"
              value={multiplier}
              onChangeText={setMultiplier}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroupSmall}>
            <Text style={styles.label}>Multiplied Digits</Text>
            <Input
              placeholder="1-3"
              value={multiplied}
              onChangeText={setMultiplied}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Button
            title="Start Challenge"
            onPress={startQuiz}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 25,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputGroupSmall: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  buttonWrapper: {
    paddingVertical: 30,
  },
});

export default HomeScreen;
