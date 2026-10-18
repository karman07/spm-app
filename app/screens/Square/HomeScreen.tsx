import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/colors/Colors";
import SelectInput, { numberOptions } from "../../components/SelectInput";
import { checkFields, validateInteger, validateSecondsField, MAX_QUESTIONS, MAX_QUIZ_SECONDS, MAX_INTERVAL_SECONDS, MIN_SECONDS } from "@/utils/validation";
import { parseSeconds, QUIZ_TICK_SECONDS } from "@/utils/time";
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './SquareRootNavigator';
import { BASE_COLOR } from '@/colors/Colors';
import Input from "../../components/Input";
import Button from "../../components/Button";

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors: c } = useTheme();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const { mode } = route.params;
  const [digit, setDigit] = useState('');
  const [time, setTime] = useState('');
  const [questions, setQuestions] = useState('');
  const scaleAnim = new Animated.Value(1);

  // Square: 7 digits (7-digit root squared < 9e15). Cube: 5 digits (cube must stay below Number.MAX_SAFE_INTEGER).
  const maxDigits = mode === 'square' ? 7 : 5;

  const startQuiz = () => {
    const digitNum = parseInt(digit);
    const timeNum = parseSeconds(time, QUIZ_TICK_SECONDS);
    const questionsNum = parseInt(questions);

    if (
      !checkFields([
        validateInteger("Root digits", digit, 1, maxDigits),
        validateInteger("Number of questions", questions, 1, MAX_QUESTIONS),
        validateSecondsField("Time per question", time, MIN_SECONDS, MAX_QUIZ_SECONDS, 1),
      ])
    ) {
      return;
    }

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate('SquareRootQuiz', {
        digit: digitNum,
        time: timeNum,
        questions: questionsNum,
        mode: mode,
      });
    });
  };

  const title = mode === 'square' ? 'Square Root Master' : 'Cube Root Expert';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{title}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Root Digits (1-{maxDigits})</Text>
            <SelectInput
  placeholder="e.g. 2"
  value={digit}
  onChange={setDigit}
  options={numberOptions(1, maxDigits)}
/>
          </View>

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
        </View>

        <View style={styles.buttonWrapper}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Button
              title="Start Challenge"
              onPress={startQuiz}
            />
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
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
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: c.textMuted,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },
  buttonWrapper: {
    paddingVertical: 30,
  },
});

export default HomeScreen;
