import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/colors/Colors";
import SelectInput, { numberOptions } from "../../components/SelectInput";
import { checkFields, validateInteger, validateSecondsField, MAX_QUESTIONS, MAX_QUIZ_SECONDS, MAX_INTERVAL_SECONDS, MIN_SECONDS } from "@/utils/validation";
import { parseSeconds, QUIZ_TICK_SECONDS } from "@/utils/time";
import React, { useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { DivRootStackParamList } from "@/types/types";
import { BASE_COLOR } from "@/colors/Colors";
import Input from "../../components/Input";
import Button from "../../components/Button";

type Props = StackScreenProps<DivRootStackParamList, "Home">;

const DivisionHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors: c } = useTheme();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const [questions, setQuestions] = useState("");
  const [time, setTime] = useState("");
  const [dividendDigits, setDividendDigits] = useState("");
  const [divisorDigits, setDivisorDigits] = useState("");
  const scaleAnim = new Animated.Value(1);

  const startQuiz = () => {
    if (
      !checkFields([
        validateInteger("Number of questions", questions, 1, MAX_QUESTIONS),
        validateSecondsField("Time per question", time, MIN_SECONDS, MAX_QUIZ_SECONDS, 1),
        validateInteger("Dividend digits", dividendDigits, 2, 7),
        validateInteger("Divisor digits", divisorDigits, 1, 6),
        parseInt(divisorDigits) >= parseInt(dividendDigits)
          ? "Divisor digits must be fewer than dividend digits."
          : null,
      ])
    ) {
      return;
    }
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      navigation.navigate("Division", {
        questions: parseInt(questions),
        time: parseSeconds(time, QUIZ_TICK_SECONDS),
        dividendDigits: parseInt(dividendDigits),
        divisorDigits: parseInt(divisorDigits),
      });
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Division Hero</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Questions</Text>
          <SelectInput
  placeholder="e.g. 10"
  value={questions}
  onChange={setQuestions}
  options={numberOptions(1, 100)}
  allowCustom={{ min: 1, max: 100000 }}
/>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time per Question (sec)</Text>
          <Input
            placeholder="e.g. 5"
            value={time}
            onChangeText={setTime}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.inputGroupSmall}>
            <Text style={styles.label}>Dividend Digits</Text>
            <SelectInput
  placeholder="2-7"
  value={dividendDigits}
  onChange={(v) => {
    setDividendDigits(v);
    if (divisorDigits && parseInt(divisorDigits) >= parseInt(v)) setDivisorDigits("");
  }}
  options={numberOptions(2, 7)}
/>
          </View>
          <View style={styles.inputGroupSmall}>
            <Text style={styles.label}>Divisor Digits</Text>
            <SelectInput
  placeholder="1-6"
  value={divisorDigits}
  onChange={setDivisorDigits}
  options={numberOptions(1, dividendDigits ? Math.max(1, parseInt(dividendDigits) - 1) : 6)}
/>
          </View>
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Button
            title="Start Division"
            onPress={startQuiz}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: c.background,
  },
  card: {
    backgroundColor: c.surface,
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
    color: c.text,
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
    color: c.textMuted,
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

export default DivisionHomeScreen;
