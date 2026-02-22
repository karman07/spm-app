import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './TableNavigator';
import { BASE_COLOR } from '@/colors/Colors';
import Input from "../../components/Input";
import Button from "../../components/Button";

type Props = StackScreenProps<RootStackParamList, 'DodgingTableSettings'>;

const DodgingTableSettings: React.FC<Props> = ({ navigation }) => {
    const [startTable, setStartTable] = useState('2');
    const [endTable, setEndTable] = useState('20');
    const [questions, setQuestions] = useState('10');
    const [time, setTime] = useState('5');
    const scaleAnim = new Animated.Value(1);

    const startQuiz = () => {
        const start = parseInt(startTable);
        const end = parseInt(endTable);
        const qCount = parseInt(questions);
        const tPerQ = parseInt(time);

        if (isNaN(start) || isNaN(end) || isNaN(qCount) || isNaN(tPerQ)) return;
        if (start > end) return;

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
                            <Input
                                placeholder="2"
                                value={startTable}
                                onChangeText={setStartTable}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.inputGroupSmall}>
                            <Text style={styles.label}>To Table</Text>
                            <Input
                                placeholder="20"
                                value={endTable}
                                onChangeText={setEndTable}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Number of Questions</Text>
                        <Input
                            placeholder="e.g. 10"
                            value={questions}
                            onChangeText={setQuestions}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Time per Question (sec)</Text>
                        <Input
                            placeholder="e.g. 5"
                            value={time}
                            onChangeText={setTime}
                            keyboardType="numeric"
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
        color: "#1A1A1A",
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
        color: "#888",
        textTransform: "uppercase",
        marginBottom: 8,
        marginLeft: 4,
    },
    buttonWrapper: {
        paddingVertical: 30,
    },
});

export default DodgingTableSettings;
