import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './SquareRootNavigator';
import { BASE_COLOR } from '@/colors/Colors';

type Props = StackScreenProps<RootStackParamList, 'SquareRootQuiz'>;

const SquareRootQuizScreen: React.FC<Props> = ({ route, navigation }) => {
  const { digit, time, questions } = route.params;

  const [timer, setTimer] = useState(time);
  const [answer, setAnswer] = useState('');
  const [quizOver, setQuizOver] = useState(false);
  const [status, setStatus] = useState('');
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [squareRoot, setSquareRoot] = useState(0);
  const [square, setSquare] = useState(0);

  // Generate a new question
  const generateQuestion = () => {
    const min = Math.pow(10, digit - 1);
    const max = Math.pow(10, digit) - 1;
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    setSquareRoot(num);
    setSquare(num * num);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAnswer(false); // Time up counts as wrong
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion]);

  const handleAnswer = (submitted: boolean) => {
    const correctAnswer = squareRoot;
    const userAnswer = parseInt(answer);
    const isCorrect = submitted && userAnswer === correctAnswer;

    if (isCorrect) {
      setStatus('Correct 🎉');
      setScore((prev) => prev + 1);
    } else {
      setStatus(`Wrong ❌ (Answer: ${correctAnswer})`);
    }

    if (currentQuestion === questions) {
      setQuizOver(true);
    } else {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
        setTimer(time);
        setAnswer('');
        setStatus('');
        generateQuestion();
      }, 1500); // Small delay before next question
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>

        {!quizOver ? (
          <>
            <Text style={styles.timer}>⏱ Time Left: {timer}s</Text>
            <Text style={styles.question}>
              Question {currentQuestion} of {questions}
            </Text>
            <Text style={styles.question}>
            √{square}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your answer"
              keyboardType="numeric"
              value={answer}
              onChangeText={setAnswer}
              placeholderTextColor="#888"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleAnswer(true)}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            {status !== '' && <Text style={styles.result}>{status}</Text>}
          </>
        ) : (
          <>
            <Text style={styles.result}>
              Quiz Over! Your Score: {score} / {questions}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.buttonText}>Go Home</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f7ff',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: BASE_COLOR,
    textAlign: 'center',
    marginBottom: 30,
  },
  timer: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  question: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 15,
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: BASE_COLOR,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  result: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
});

export default SquareRootQuizScreen;
