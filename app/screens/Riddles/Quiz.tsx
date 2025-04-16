import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { fetchRiddle } from '@/utils/api';
import Colors from '@/colors/NewColor';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './RiddlesNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

export default function Quiz({ navigation }: Props) {
  const [riddle, setRiddle] = useState<any>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState<number>(0);
  const [wrong, setWrong] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);

  useEffect(() => {
    loadNew();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigation.replace('Result', { correct, wrong });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [correct, wrong]);

  const loadNew = async () => {
    const data = await fetchRiddle();
    setRiddle(data);
    setSelected(null);
    setShowAnswer(false);
  };

  const handleSelect = (option: string) => {
    setSelected(option);
    const isCorrect = option === riddle.answer;

    if (isCorrect) {
      setCorrect(prev => prev + 1);
    } else {
      setWrong(prev => prev + 1);
      setShowAnswer(true);
    }

    setTimeout(() => {
      const totalAnswered = correct + wrong + 1;

      if (totalAnswered === 5) {
        navigation.replace('Result', {
          correct: isCorrect ? correct + 1 : correct,
          wrong: !isCorrect ? wrong + 1 : wrong,
        });
      } else {
        loadNew();
      }
    }, 2000);
  };

  if (!riddle) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>Time Left: {timeLeft}s</Text>

      <Text variant="titleLarge" style={styles.question}>
        {riddle.riddle}
      </Text>

      {riddle.options.map((opt: string, index: number) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            selected === opt && {
              backgroundColor: opt === riddle.answer ? Colors.correct : Colors.wrong,
            },
          ]}
          onPress={() => handleSelect(opt)}
          disabled={!!selected}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}

      {showAnswer && selected !== riddle.answer && (
        <View style={styles.correctAnswerCard}>
          <Text style={styles.correctAnswerText}>Correct Answer: {riddle.answer}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  timer: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  question: {
    marginBottom: 20,
    color: '#000',
  },
  option: {
    backgroundColor: Colors.card,
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  correctAnswerCard: {
    backgroundColor: Colors.correct,
    padding: 15,
    marginTop: 30,
    borderRadius: 10,
    elevation: 2,
    alignItems: 'center',
  },
  correctAnswerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
