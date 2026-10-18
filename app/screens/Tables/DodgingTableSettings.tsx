import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/colors/Colors";
import SelectInput, { numberOptions } from "../../components/SelectInput";
import { checkFields, validateInteger, validateSecondsField, MAX_QUESTIONS, MAX_QUIZ_SECONDS, MAX_INTERVAL_SECONDS, MIN_SECONDS } from "@/utils/validation";
import { parseSeconds, QUIZ_TICK_SECONDS } from "@/utils/time";
import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './TableNavigator';
import { BASE_COLOR } from '@/colors/Colors';
import Input from "../../components/Input";
import Button from "../../components/Button";

type Props = StackScreenProps<RootStackParamList, 'DodgingTableSettings'>;

const DodgingTableSettings: React.FC<Props> = ({ navigation }) => {
  const { colors: c } = useTheme();
  const styles = React.useMemo(() => createStyles(c), [c]);
    const [startTable, setStartTable] = useState('2');
    const [endTable, setEndTable] = useState('20');
    const [questions, setQuestions] = useState('10');
    const [time, setTime] = useState('5');
    const scaleAnim = new Animated.Value(1);

    const startQuiz = () => {
        const start = parseInt(startTable);
        const end = parseInt(endTable);
        const qCount = parseInt(questions);
        const tPerQ = parseSeconds(time, QUIZ_TICK_SECONDS);

        if (
            !checkFields([
                validateInteger("From table", startTable, 1, 10000),
                validateInteger("To table", endTable, 1, 10000),
                start > end ? "From table must not be greater than To table." : null,
                validateInteger("Number of questions", questions, 1, MAX_QUESTIONS),
                validateSecondsField("Time per question", time, MIN_SECONDS, MAX_QUIZ_SECONDS, 1),
            ])
        ) {
            return;
        }

        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start(() => {
            navigation.navigate('DodgingTableQuiz', {
                startTable: start,
                endTable: end,
                questions: qCount,
                time: tPerQ,
            });
        });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Table Quiz Settings</Text>

                    <View style={styles.row}>
                        <View style={styles.inputGroupSmall}>
                            <Text style={styles.label}>From Table</Text>
                            <SelectInput
  placeholder="2"
  value={startTable}
  onChange={setStartTable}
  options={numberOptions(1, 100)}
  allowCustom={{ min: 1, max: 10000 }}
/>
                        </View>
                        <View style={styles.inputGroupSmall}>
                            <Text style={styles.label}>To Table</Text>
                            <SelectInput
  placeholder="20"
  value={endTable}
  onChange={setEndTable}
  options={numberOptions(1, 100)}
  allowCustom={{ min: 1, max: 10000 }}
/>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Number of Questions</Text>
                        <SelectInput
  placeholder="e.g. 10"
  value={questions}
  onChange={setQuestions}
  options={numberOptions(1, 100)}
  allowCustom={{ min: 1, max: 100000 }}
/>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Time per Question (sec)</Text>
                        <Input
                            placeholder="e.g. 5"
                            value={time}
                            onChangeText={setTime}
                            keyboardType="decimal-pad"
                        />
                    </View>
                </View>

                <View style={styles.buttonWrapper}>
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <Button
                            title="Start Quiz"
                            onPress={startQuiz}
                        />
                    </Animated.View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

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
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: c.text,
        marginBottom: 25,
        textAlign: "center",
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    inputGroup: {
        marginBottom: 15,
    },
    inputGroupSmall: {
        flex: 1,
        marginHorizontal: 5,
        marginBottom: 15,
    },
    label: {
        fontSize: 12,
        fontWeight: "700",
        color: c.textMuted,
        textTransform: "uppercase",
        marginBottom: 8,
        marginLeft: 4,
    },
    buttonWrapper: {
        paddingVertical: 30,
    },
});

export default DodgingTableSettings;
