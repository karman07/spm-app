import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import PieChartWebView from './PieChartWebView';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './RiddlesNavigator';
import { ScrollView } from 'react-native-gesture-handler';
import { BASE_COLOR } from '@/colors/Colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export default function Result({ route, navigation }: Props) {
  const { correct, wrong } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quiz Result</Text>

      <PieChartWebView correct={correct} wrong={wrong} />

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Correct Answers: {correct}</Text>
        <Text style={styles.scoreText}>Wrong Answers: {wrong}</Text>
      </View>

      <TouchableOpacity style={styles.tryAgainBtn} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.tryAgainText}>Try Again</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { textAlign: 'center', fontSize: 22, fontWeight: 'bold', color: '#000' },
  scoreContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    marginVertical: 5,
    color: '#000',
    fontWeight: '500',
  },
  tryAgainBtn: {
    marginTop: 30,
    backgroundColor: BASE_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: 'center',
  },
  tryAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
