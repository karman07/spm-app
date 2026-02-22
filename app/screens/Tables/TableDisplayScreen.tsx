import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './TableNavigator';
import * as Speech from 'expo-speech';
import { BASE_COLOR } from '@/colors/Colors';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type TableScreenRouteProp = RouteProp<RootStackParamList, 'TableDisplay'>;

export default function TableDisplayScreen() {
  const route = useRoute<TableScreenRouteProp>();
  const navigation = useNavigation();
  const [number, setNumber] = useState(route.params?.number || 1);
  const [startIndex, setStartIndex] = useState(0); // 0 corresponds to 1-10

  const multiplicativeFactors = Array.from({ length: 10 }, (_, i) => (startIndex * 10) + i + 1);

  useEffect(() => {
    setNumber(route.params?.number || 1);
    setStartIndex(0);
  }, [route.params]);

  const speakTable = () => {
    const text = multiplicativeFactors.map(n => {
      return `${number} times ${n} is ${number * n}`;
    }).join(', ');
    Speech.speak(text, { rate: 0.8 });
  };

  const handleForward = () => {
    setStartIndex(prev => prev + 1);
  };

  const handleBackward = () => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Table of {number}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.tableScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {multiplicativeFactors.map((n, i) => (
            <View key={n} style={[styles.row, i === multiplicativeFactors.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.formula}>
                <Text style={styles.numText}>{number}</Text>
                <Text style={styles.opText}>×</Text>
                <Text style={styles.multText}>{n}</Text>
              </View>
              <Text style={styles.equalText}>=</Text>
              <Text style={styles.resultText}>{number * n}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Currently viewing range: {multiplicativeFactors[0]} - {multiplicativeFactors[9]}</Text>
        </View>
      </ScrollView>

      {/* Control Bar */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, startIndex === 0 && styles.disabledBtn]}
          onPress={handleBackward}
          disabled={startIndex === 0}
        >
          <Icon name="chevron-left" size={30} color={startIndex === 0 ? "#CCC" : BASE_COLOR} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.speakButton} onPress={speakTable}>
          <Icon name="volume-high" size={28} color="#FFF" />
          <Text style={styles.speakText}>Listen</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={handleForward}>
          <Icon name="chevron-right" size={30} color={BASE_COLOR} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F1F3F5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  tableScroll: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  formula: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  numText: {
    fontSize: 22,
    fontWeight: '800',
    color: BASE_COLOR,
    width: 40,
    textAlign: 'center',
  },
  opText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginHorizontal: 10,
  },
  multText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    width: 40,
    textAlign: 'center',
  },
  equalText: {
    fontSize: 20,
    color: '#999',
    marginHorizontal: 15,
  },
  resultText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1A1A1A',
    width: 70,
    textAlign: 'right',
  },
  infoBox: {
    marginTop: 20,
    alignItems: 'center',
  },
  infoText: {
    color: '#888',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F1F3F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: BASE_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  speakText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
    marginLeft: 10,
  },
});

