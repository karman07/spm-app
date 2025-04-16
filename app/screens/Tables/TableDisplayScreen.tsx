import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from './TableNavigator';
import * as Speech from 'expo-speech';
import { theme } from '@/colors/theme';

type TableScreenRouteProp = RouteProp<RootStackParamList, 'TableDisplay'>;

export default function TableDisplayScreen() {
  const route = useRoute<TableScreenRouteProp>();
  const [number, setNumber] = useState(route.params?.number || 1);
  const [startIndex, setStartIndex] = useState(1);

  useEffect(() => {
    setNumber(route.params?.number || 1);
    setStartIndex(1);
  }, [route.params]);

  const speakTable = () => {
    const text = Array.from({ length: 10 }, (_, i) => {
      const n = startIndex + i;
      return `${number} times ${n} is ${number * n}`;
    }).join(', ');
    Speech.speak(text);
  };

  const handleForward = () => {
    setStartIndex(startIndex + 10);
  };

  const handleBackward = () => {
    if (startIndex > 10) {
      setStartIndex(startIndex - 10);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.table}>
        {Array.from({ length: 10 }, (_, i) => (
          <Text key={i} style={styles.text}>
            {number} x {startIndex + i} = {number * (startIndex + i)}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={handleBackward}>
          <Text style={styles.controlText}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={speakTable}>
          <Text style={styles.controlText}>🔊</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={handleForward}>
          <Text style={styles.controlText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  table: {
    paddingBottom: 20,
  },
  text: {
    fontSize: 20,
    color: theme.text,
    marginVertical: 6,
    fontWeight: '500',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  controlButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.baseColor,
    marginHorizontal: 5,
    paddingVertical: 12,
    alignItems: 'center',
  },
  controlText: {
    color: theme.baseColor,
    fontWeight: 'bold',
    fontSize: 18,
  },
});
