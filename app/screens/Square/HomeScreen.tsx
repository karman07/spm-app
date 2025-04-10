import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './SquareRootNavigator';
import { BASE_COLOR } from '@/colors/Colors';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
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
      });
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a digit (1-20)"
          keyboardType="numeric"
          onChangeText={setDigit}
          value={digit}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Time for (in seconds)"
          keyboardType="numeric"
          onChangeText={setTime}
          value={time}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Number of Questions"
          keyboardType="numeric"
          onChangeText={setQuestions}
          value={questions}
          placeholderTextColor="#888"
        />

        <Animated.View
          style={[styles.buttonWrapper, { transform: [{ scale: scaleAnim }] }]}
        >
          <TouchableOpacity style={styles.button} onPress={startQuiz}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

//const BASE_COLO = BASE_COLOR;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    fontSize: 18,
    color: '#333',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: BASE_COLOR,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
