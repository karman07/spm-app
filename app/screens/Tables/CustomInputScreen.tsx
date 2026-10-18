import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/colors/Colors";
import SelectInput, { numberOptions } from "../../components/SelectInput";
import { checkFields, validateInteger } from "@/utils/validation";
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './TableNavigator';
import { BASE_COLOR } from '@/colors/Colors';
import Input from "../../components/Input";
import Button from "../../components/Button";

type CustomInputNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CustomInput'>;

export default function CustomInputScreen() {
  const { colors: c } = useTheme();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const [input, setInput] = useState('');
  const navigation = useNavigation<CustomInputNavigationProp>();

  const handleGenerate = () => {
    const num = parseInt(input, 10);
    if (!checkFields([validateInteger("Table number", input, 1, 100000)])) return;
    navigation.navigate('TableDisplay', { number: num });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Custom Table</Text>
          <Text style={styles.subtitle}>Pick or type a number to generate its multiplication table up to 1000</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Table Number</Text>
            <SelectInput
  placeholder="e.g. 29"
  value={input}
  onChange={setInput}
  options={numberOptions(1, 1000)}
  allowCustom={{ min: 1, max: 100000 }}
/>
          </View>

          <View style={styles.buttonWrapper}>
            <Button title="Generate Table" onPress={handleGenerate} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: c.surface,
    borderRadius: 25,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: c.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: c.textMuted,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  inputGroup: {
    marginBottom: 20,
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
    marginTop: 10,
  },
});
