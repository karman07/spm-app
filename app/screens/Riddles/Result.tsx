import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { BASE_COLOR } from '@/colors/Colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './RiddlesNavigator';
import Button from "../../components/Button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export default function Result({ navigation, route }: Props) {
  const { correct, wrong, total } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Icon name="trophy-outline" size={40} color={BASE_COLOR} />
          </View>

          <Text style={styles.sectionTitle}>Quiz Results</Text>
          <Text style={styles.subtitle}>
            Great job! You've completed the AI Math Riddle challenge. Here's how you performed.
          </Text>

          <View style={styles.finalScoreBoard}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>{correct}</Text>
              <Text style={styles.scoreLabel}>Correct</Text>
            </View>
            <View style={styles.scoreDivider} />
            <View style={styles.scoreItem}>
              <Text style={[styles.scoreValue, { color: "#D32F2F" }]}>{wrong}</Text>
              <Text style={styles.scoreLabel}>Missed</Text>
            </View>
          </View>

          <View style={styles.accuracyContainer}>
            <Text style={styles.accuracyText}>Accuracy: {Math.round((correct / total) * 100)}%</Text>
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="Try New Riddles"
            onPress={() => navigation.replace('Quiz', { totalQuestions: total })}
          />
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.secondaryButtonText}>Back to Main</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: BASE_COLOR + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  finalScoreBoard: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    alignItems: "center",
  },
  scoreItem: {
    flex: 1,
    alignItems: "center",
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#2E7D32",
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
  },
  scoreDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#DDD",
  },
  accuracyContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
    backgroundColor: BASE_COLOR + '10',
    borderRadius: 15,
  },
  accuracyText: {
    fontSize: 14,
    fontWeight: '800',
    color: BASE_COLOR,
    textTransform: 'uppercase',
  },
  buttonWrapper: {
    paddingVertical: 30,
    width: '100%',
  },
  secondaryButton: {
    marginTop: 15,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#EEE",
  },
  secondaryButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "700",
  },
});
