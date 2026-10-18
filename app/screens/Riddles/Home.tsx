import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/colors/Colors";
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { BASE_COLOR } from '@/colors/Colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './RiddlesNavigator';
import Button from "../../components/Button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: Props) {
  const { colors: c } = useTheme();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const [selectedQuestions, setSelectedQuestions] = React.useState(5);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const startQuiz = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      navigation.navigate('Quiz', { totalQuestions: selectedQuestions });
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Icon name="brain" size={40} color={c.primary} />
          </View>

          <Text style={styles.sectionTitle}>Math Riddles</Text>
          <Text style={styles.subtitle}>
            Challenge your mind with AI-generated math puzzles. Each session features unique problems designed to test your lateral thinking!
          </Text>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Icon name="timer-outline" size={24} color={c.textMuted} />
              <Text style={styles.statLabel}>Time Limit</Text>
              <Text style={styles.statValue}>60s</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.selectionTitle}>Select Question Count</Text>
          <View style={styles.optionsGrid}>
            {[5, 10, 15, 20].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.countOption,
                  selectedQuestions === num && styles.countOptionSelected
                ]}
                onPress={() => setSelectedQuestions(num)}
              >
                <Text style={[
                  styles.countText,
                  selectedQuestions === num && styles.countTextSelected
                ]}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Button
              title="Start AI Challenge"
              onPress={startQuiz}
            />
          </Animated.View>
        </View>
      </ScrollView >
    </View >
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: c.surface,
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
    backgroundColor: c.button + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: c.text,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: c.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: c.background,
    marginBottom: 25,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: c.textMuted,
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: c.primary,
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: c.border,
  },
  buttonWrapper: {
    paddingVertical: 30,
  },
  selectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: c.text,
    textTransform: 'uppercase',
    marginBottom: 15,
    letterSpacing: 1,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  countOption: {
    width: 60,
    height: 50,
    borderRadius: 15,
    backgroundColor: c.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: c.border,
  },
  countOptionSelected: {
    backgroundColor: c.button + '10',
    borderColor: c.primary,
  },
  countText: {
    fontSize: 16,
    fontWeight: '800',
    color: c.textMuted,
  },
  countTextSelected: {
    color: c.primary,
  },
});
