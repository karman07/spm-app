import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/colors/Colors";
import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Animated, Dimensions, Platform, Text, ScrollView } from 'react-native';
import { fetchRiddle } from '@/utils/api';
import { BASE_COLOR } from '@/colors/Colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './RiddlesNavigator';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Quiz({ navigation, route }: Props) {
  const { colors: c } = useTheme();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const { totalQuestions } = route.params;
  const [riddle, setRiddle] = useState<any>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState<number>(0);
  const [wrong, setWrong] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadNew();
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (correct + wrong) / totalQuestions,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [correct, wrong]);

  useEffect(() => {
    if (showAnswer || error || (correct + wrong === totalQuestions)) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          navigation.replace('Result', { correct, wrong, total: totalQuestions });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [correct, wrong, navigation, error, showAnswer, totalQuestions]);

  const loadNew = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRiddle();
      setRiddle(data);
      setSelected(null);
      setShowAnswer(false);
    } catch (err: any) {
      console.error("AI Fetch Error:", err);
      setError("Unable to connect to AI. Please check your internet or API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (option: string) => {
    if (selected || error) return; // Prevent multiple taps or actions on error

    setSelected(option);
    const isCorrect = option === riddle.answer;

    if (isCorrect) {
      setCorrect(prev => prev + 1);
    } else {
      setWrong(prev => prev + 1);
    }
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    const currentCount = correct + wrong;
    if (currentCount >= totalQuestions) {
      navigation.replace('Result', {
        correct,
        wrong,
        total: totalQuestions,
      });
    } else {
      loadNew();
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="alert-circle-outline" size={50} color={c.primary} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadNew}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButtonMinor} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonMinorText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading && !riddle) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={c.primary} />
        <Text style={styles.loadingText}>Generating a riddle...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.timerBadge}>
          <Icon name="clock-outline" size={18} color={c.text} />
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>
        <TouchableOpacity
          style={styles.exitButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.exitButtonText}>Exit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
        </View>
        <Text style={styles.countText}>Question {correct + wrong + 1} of {totalQuestions}</Text>

        <View style={styles.questionCard}>
          <View style={styles.aiBadge}>
            <Icon name="auto-fix" size={14} color={c.primary} />
            <Text style={styles.aiBadgeText}>AI Generated</Text>
          </View>

          {loading ? (
            <View style={{ height: 200, justifyContent: 'center' }}>
              <ActivityIndicator size="small" color={c.primary} />
            </View>
          ) : (
            <>
              <Text style={styles.questionText}>{riddle?.riddle}</Text>
              <View style={styles.divider} />

              <View style={styles.optionsContainer}>
                {riddle?.options.map((opt: string, index: number) => {
                  const isSelected = selected === opt;
                  const isCorrectOpt = opt === riddle.answer;

                  let bgColor = c.surface;
                  let borderColor = c.border;
                  if (isSelected) {
                    bgColor = isCorrectOpt ? "#4CAF5015" : "#F4433615";
                    borderColor = isCorrectOpt ? "#4CAF50" : "#F44336";
                  } else if (showAnswer && isCorrectOpt) {
                    bgColor = "#4CAF5015";
                    borderColor = "#4CAF50";
                  }

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.option, { backgroundColor: bgColor, borderColor: borderColor }]}
                      onPress={() => handleSelect(opt)}
                      disabled={!!selected}
                      activeOpacity={0.7}
                    >
                      <View style={styles.optionContent}>
                        <Text style={styles.optionText}>{opt}</Text>
                        {isSelected && (
                          <Icon
                            name={isCorrectOpt ? "check-circle" : "close-circle"}
                            size={20}
                            color={isCorrectOpt ? "#4CAF50" : "#F44336"}
                          />
                        )}
                        {showAnswer && isCorrectOpt && !isSelected && (
                          <Icon name="check-circle" size={20} color="#4CAF50" />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {showAnswer && (
                <View style={styles.explanationBox}>
                  <View style={styles.explanationHeader}>
                    <Icon name="lightbulb-outline" size={20} color={c.primary} />
                    <Text style={styles.explanationTitle}>Explanation</Text>
                  </View>
                  <Text style={styles.explanationText}>{riddle?.explanation}</Text>

                  <TouchableOpacity style={styles.nextBtn} onPress={nextQuestion}>
                    <Text style={styles.nextBtnText}>
                      {correct + wrong >= totalQuestions ? "See Results" : "Next Question"}
                    </Text>
                    <Icon name="arrow-right" size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.miniScoreboard}>
        <Text style={[styles.miniScoreText, { color: c.primary }]}>Correct: {correct}</Text>
        <View style={styles.miniDivider} />
        <Text style={[styles.miniScoreText, { color: c.danger }]}>Wrong: {wrong}</Text>
      </View>
    </View>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: c.background,
  },
  loadingText: {
    marginTop: 15,
    color: c.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 100, // Extra padding for miniScoreboard
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: c.border,
  },
  timerText: {
    fontSize: 16,
    fontWeight: "700",
    color: c.text,
    marginLeft: 6,
  },
  exitButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: c.button + "15",
    borderRadius: 20,
  },
  exitButtonText: {
    color: c.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  progressContainer: {
    width: "100%",
    height: 6,
    backgroundColor: c.border,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: c.button,
  },
  countText: {
    fontSize: 12,
    fontWeight: "600",
    color: c.textMuted,
    textAlign: 'center',
    marginBottom: 15,
  },
  questionCard: {
    backgroundColor: c.surface,
    borderRadius: 25,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.button + '10',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 15,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: c.primary,
    textTransform: 'uppercase',
    marginLeft: 5,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "700",
    color: c.text,
    lineHeight: 28,
    marginBottom: 15,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: c.background,
    marginVertical: 15,
  },
  optionsContainer: {
    width: '100%',
  },
  option: {
    padding: 16,
    borderRadius: 15,
    borderWidth: 2,
    marginVertical: 8,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: c.text,
    flex: 1,
  },
  miniScoreboard: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: c.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  miniScoreText: {
    fontSize: 14,
    fontWeight: "700",
  },
  miniDivider: {
    width: 1,
    height: 15,
    backgroundColor: c.border,
    marginHorizontal: 15,
  },
  errorText: {
    color: c.textMuted,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 40,
  },
  retryButton: {
    backgroundColor: c.button,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  backButtonMinor: {
    marginTop: 15,
    padding: 10,
  },
  backButtonMinorText: {
    color: c.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  explanationBox: {
    marginTop: 20,
    padding: 20,
    backgroundColor: c.button + '08',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: c.primary + '20',
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: c.primary,
    textTransform: 'uppercase',
    marginLeft: 10,
    letterSpacing: 1,
  },
  explanationText: {
    fontSize: 15,
    color: c.text,
    lineHeight: 22,
    marginBottom: 20,
  },
  nextBtn: {
    backgroundColor: c.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 15,
    shadowColor: c.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 10,
  },
});
