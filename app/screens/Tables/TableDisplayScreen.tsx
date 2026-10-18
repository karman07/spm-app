import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/colors/Colors";
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './TableNavigator';
import * as Speech from 'expo-speech';
import { BASE_COLOR } from '@/colors/Colors';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type TableScreenRouteProp = RouteProp<RootStackParamList, 'TableDisplay'>;

// Tables stop at x1000 so products stay far below the safe integer limit.
const MAX_FACTOR = 1000;
const MAX_START_INDEX = MAX_FACTOR / 10 - 1;

export default function TableDisplayScreen() {
  const { colors: c } = useTheme();
  const styles = React.useMemo(() => createStyles(c), [c]);
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
    setStartIndex(prev => Math.min(prev + 1, MAX_START_INDEX));
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
          <Icon name="arrow-left" size={24} color={c.text} />
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
          <Icon name="chevron-left" size={30} color={startIndex === 0 ? c.border : c.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.speakButton} onPress={speakTable}>
          <Icon name="volume-high" size={28} color="#FFF" />
          <Text style={styles.speakText}>Listen</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlButton, startIndex >= MAX_START_INDEX && styles.disabledBtn]} onPress={handleForward} disabled={startIndex >= MAX_START_INDEX}>
          <Icon name="chevron-right" size={30} color={c.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: c.surface,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: c.background,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: c.text,
  },
  tableScroll: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: c.surface,
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
    borderBottomColor: c.border,
  },
  formula: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  numText: {
    fontSize: 22,
    fontWeight: '800',
    color: c.primary,
    width: 40,
    textAlign: 'center',
  },
  opText: {
    fontSize: 18,
    fontWeight: '600',
    color: c.textMuted,
    marginHorizontal: 10,
  },
  multText: {
    fontSize: 22,
    fontWeight: '600',
    color: c.text,
    width: 40,
    textAlign: 'center',
  },
  equalText: {
    fontSize: 20,
    color: c.textMuted,
    marginHorizontal: 15,
  },
  resultText: {
    fontSize: 24,
    fontWeight: '900',
    color: c.text,
    width: 70,
    textAlign: 'right',
  },
  infoBox: {
    marginTop: 20,
    alignItems: 'center',
  },
  infoText: {
    color: c.textMuted,
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
    backgroundColor: c.surface,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: c.border,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: c.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.button,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: c.primary,
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

