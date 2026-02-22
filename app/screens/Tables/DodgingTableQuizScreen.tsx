import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './TableNavigator';
import { BASE_COLOR } from '@/colors/Colors';
import Input from "../../components/Input";
import Button from "../../components/Button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Props = StackScreenProps<RootStackParamList, 'DodgingTableQuiz'>;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const DodgingTableQuizScreen: React.FC<Props> = ({ route, navigation }) => {
    const { startTable, endTable, questions, time } = route.params;

    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [tableNum, setTableNum] = useState(0);
    const [multiplier, setMultiplier] = useState(0);
    const [answer, setAnswer] = useState('');
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);
    const [timer, setTimer] = useState(time);
    const [quizOver, setQuizOver] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: currentQuestion / questions,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [currentQuestion, questions]);

    useEffect(() => {
        generateNewQuestion();
    }, []);

    useEffect(() => {
        if (quizOver || showAnswer) return;

        setTimer(time);
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [currentQuestion, quizOver, showAnswer]);

    const generateNewQuestion = () => {
        const table = Math.floor(Math.random() * (endTable - startTable + 1)) + startTable;
        const mult = Math.floor(Math.random() * 10) + 1; // 1 to 10
        setTableNum(table);
        setMultiplier(mult);
        setShowAnswer(false);
    };

    const handleTimeout = () => {
        setWrong((prev) => prev + 1);
        setIsCorrect(false);
        setShowAnswer(true);

        setTimeout(() => {
            if (currentQuestion < questions) {
                setCurrentQuestion((prev) => prev + 1);
                setAnswer("");
                generateNewQuestion();
            } else {
                setQuizOver(true);
            }
        }, 1500);
    };

    const handleCheckAnswer = () => {
        const isAnswerCorrect = parseInt(answer) === tableNum * multiplier;
        setIsCorrect(isAnswerCorrect);
        setShowAnswer(true);

        if (isAnswerCorrect) {
            setCorrect((prev) => prev + 1);
        } else {
            setWrong((prev) => prev + 1);
        }

        setTimeout(() => {
            if (currentQuestion < questions) {
                setCurrentQuestion((prev) => prev + 1);
                setAnswer("");
                generateNewQuestion();
            } else {
                setQuizOver(true);
            }
        }, 1500);
    };

    const restartQuiz = () => {
        setCurrentQuestion(1);
        setCorrect(0);
        setWrong(0);
        setTimer(time);
        setAnswer("");
        setQuizOver(false);
        generateNewQuestion();
    };

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.timerBadge}>
                    <Icon name="clock-outline" size={18} color="#333" />
                    <Text style={styles.timerText}>{timer}s</Text>
                </View>
                <TouchableOpacity
                    style={styles.exitButton}
                    onPress={() => navigation.navigate("Home")}
                >
                    <Text style={styles.exitButtonText}>Exit</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {!quizOver ? (
                    <>
                        <View style={styles.progressContainer}>
                            <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
                        </View>
                        <Text style={styles.countText}>Question {currentQuestion} of {questions}</Text>

                        <View style={styles.questionCard}>
                            <Text style={styles.questionText}>
                                {tableNum} <Text style={{ color: BASE_COLOR }}>×</Text> {multiplier}
                            </Text>

                            <View style={styles.divider} />

                            <Text style={styles.inputLabel}>Enter the result:</Text>
                            <Input
                                placeholder="0"
                                value={answer}
                                onChangeText={setAnswer}
                                keyboardType="numeric"
                                autoFocus={true}
                            />

                            {showAnswer ? (
                                <View style={[styles.feedbackBadge, { backgroundColor: isCorrect ? "#4CAF5020" : "#F4433620" }]}>
                                    <Icon
                                        name={isCorrect ? "check-circle" : "close-circle"}
                                        size={28}
                                        color={isCorrect ? "#4CAF50" : "#F44336"}
                                    />
                                    <Text style={[styles.feedbackText, { color: isCorrect ? "#2E7D32" : "#D32F2F" }]}>
                                        {isCorrect ? "Correct!" : `Oops! It's ${tableNum * multiplier}`}
                                    </Text>
                                </View>
                            ) : (
                                <View style={styles.buttonWrapper}>
                                    <Button title={currentQuestion < questions ? "Next" : "Finish"} onPress={handleCheckAnswer} />
                                </View>
                            )}
                        </View>
                    </>
                ) : (
                    <View style={[styles.questionCard, { paddingVertical: 40 }]}>
                        <Text style={styles.title}>Quiz Results</Text>

                        <View style={styles.finalScoreBoard}>
                            <View style={styles.scoreItem}>
                                <Text style={styles.scoreValue}>{correct}</Text>
                                <Text style={styles.scoreLabel}>Correct</Text>
                            </View>
                            <View style={styles.scoreDivider} />
                            <View style={styles.scoreItem}>
                                <Text style={[styles.scoreValue, { color: "#D32F2F" }]}>{wrong}</Text>
                                <Text style={styles.scoreLabel}>Wrong</Text>
                            </View>
                        </View>

                        <View style={{ marginTop: 30, width: "100%" }}>
                            <Button title="Try Again" onPress={restartQuiz} />
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={() => navigation.navigate("Home")}
                            >
                                <Text style={styles.secondaryButtonText}>Back to Tables</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>

            {!quizOver && (
                <View style={styles.miniScoreboard}>
                    <Text style={[styles.miniScoreText, { color: "#2E7D32" }]}>Correct: {correct}</Text>
                    <View style={styles.miniDivider} />
                    <Text style={[styles.miniScoreText, { color: "#D32F2F" }]}>Wrong: {wrong}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
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
        justifyContent: "center",
    },
    timerBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#EEE",
    },
    timerText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#333",
        marginLeft: 6,
    },
    exitButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: BASE_COLOR + "15",
        borderRadius: 20,
    },
    exitButtonText: {
        color: BASE_COLOR,
        fontSize: 14,
        fontWeight: "800",
    },
    progressContainer: {
        width: "100%",
        height: 6,
        backgroundColor: "#E0E0E0",
        borderRadius: 3,
        overflow: "hidden",
        marginBottom: 10,
    },
    progressBar: {
        height: "100%",
        backgroundColor: BASE_COLOR,
    },
    countText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#888",
        textAlign: 'center',
        marginBottom: 20,
    },
    questionCard: {
        backgroundColor: "#FFF",
        borderRadius: 25,
        padding: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
    },
    questionText: {
        fontSize: 48,
        fontWeight: "900",
        color: "#1A1A1A",
        marginVertical: 20,
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "#EEE",
        marginVertical: 20,
    },
    inputLabel: {
        alignSelf: "flex-start",
        fontSize: 14,
        fontWeight: "700",
        color: "#666",
        textTransform: "uppercase",
        marginBottom: 10,
        marginLeft: 4,
    },
    buttonWrapper: {
        width: "100%",
        marginTop: 10,
    },
    feedbackBadge: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 15,
        borderRadius: 15,
        marginTop: 10,
    },
    feedbackText: {
        fontSize: 18,
        fontWeight: "700",
        marginLeft: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        color: "#1A1A1A",
        marginBottom: 20,
        textAlign: "center",
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
        fontSize: 28,
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
    miniScoreboard: {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        flexDirection: "row",
        backgroundColor: "#FFF",
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
        color: "#444",
    },
    miniDivider: {
        width: 1,
        height: 15,
        backgroundColor: "#EEE",
        marginHorizontal: 15,
    },
});

export default DodgingTableQuizScreen;
