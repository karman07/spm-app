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
  const { mode } = route.params;
  const [digit, setDigit] = useState('');
  const [time, setTime] = useState('');
  const [questions, setQuestions] = useState('');
  const scaleAnim = new Animated.Value(1);

  const startQuiz = () => {
    const digitNum = parseInt(digit);
    const timeNum = parseInt(time);
    const questionsNum = parseInt(questions);

    if (
      !digit ||
      !time ||
      !questions ||
      isNaN(digitNum) ||
      isNaN(timeNum) ||
      isNaN(questionsNum)
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
            <Text style={styles.label}>Root Digits (1-3)</Text>
            <Input
              placeholder="e.g. 2"
              value={digit}
              onChangeText={setDigit}
              keyboardType="numeric"
            />
          </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
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
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },
  buttonWrapper: {
    paddingVertical: 30,
  },
});

export default HomeScreen;
