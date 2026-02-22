import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { BASE_COLOR } from '@/colors/Colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './RiddlesNavigator';
import Button from "../../components/Button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: Props) {
  const scaleAnim = new Animated.Value(1);

  const startQuiz = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      navigation.navigate('Quiz');
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Icon name="brain" size={40} color={BASE_COLOR} />
          </View>

          <Text style={styles.sectionTitle}>Math Riddles</Text>
          <Text style={styles.subtitle}>
            Challenge your mind with AI-generated math puzzles. Each session features unique problems designed to test your lateral thinking!
          </Text>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Icon name="help-circle-outline" size={24} color="#666" />
              <Text style={styles.statLabel}>Questions</Text>
              <Text style={styles.statValue}>5</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.statBox}>
              <Icon name="timer-outline" size={24} color="#666" />
              <Text style={styles.statLabel}>Time Limit</Text>
              <Text style={styles.statValue}>60s</Text>
            </View>
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
    marginBottom: 25,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F1F3F5',
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
    color: '#888',
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: BASE_COLOR,
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#EEE',
  },
  buttonWrapper: {
    paddingVertical: 30,
  },
});
