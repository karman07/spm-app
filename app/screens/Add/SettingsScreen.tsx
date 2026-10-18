import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/colors/Colors";
import SelectInput, { numberOptions } from "../../components/SelectInput";
import { checkFields, validateInteger, validateSecondsField, MAX_QUESTIONS, MAX_QUIZ_SECONDS, MAX_INTERVAL_SECONDS, MIN_SECONDS } from "@/utils/validation";
import { parseSeconds } from "@/utils/time";
import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { AddStackParamList } from "@/types/types";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { BASE_COLOR } from "@/colors/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Props = StackScreenProps<AddStackParamList, "Settings">;

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors: c } = useTheme();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const [digit, setDigit] = useState("");
  const [rows, setRows] = useState("");
  const [time, setTime] = useState("");
  const [speak, setSpeak] = useState(false);
  const [changeColor, setChangeColor] = useState(false);

  const isSpeakDisabled = parseSeconds(time) < 1;

  React.useEffect(() => {
    if (isSpeakDisabled) {
      setSpeak(false);
    }
  }, [time]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Game Configuration</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Digits</Text>
          <SelectInput
  placeholder="e.g. 2"
  value={digit}
  onChange={setDigit}
  options={numberOptions(1, 7)}
  allowCustom={{ min: 1, max: 10 }}
/>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Rows</Text>
          <SelectInput
  placeholder="e.g. 10"
  value={rows}
  onChange={setRows}
  options={numberOptions(1, 100)}
  allowCustom={{ min: 1, max: 100000 }}
/>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time Interval (seconds)</Text>
          <Input
            placeholder="e.g. 1.5"
            value={time}
            onChangeText={setTime}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Icon name="volume-high" size={24} color={c.primary} />
            <Text style={styles.switchText}>Speak Numbers</Text>
          </View>
          <Switch
            value={speak}
            onValueChange={setSpeak}
            disabled={isSpeakDisabled}
            trackColor={{ false: c.border, true: isSpeakDisabled ? c.border : c.primary + "80" }}
            thumbColor={speak ? c.primary : "#f4f3f4"}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Icon name="palette" size={24} color={c.primary} />
            <Text style={styles.switchText}>Dynamic Colors</Text>
          </View>
          <Switch
            value={changeColor}
            onValueChange={setChangeColor}
            trackColor={{ false: c.border, true: c.primary + "80" }}
            thumbColor={changeColor ? c.primary : "#f4f3f4"}
          />
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title="Start Practice"
          onPress={() => {
            if (
              !checkFields([
                validateInteger("Number of digits", digit, 1, 10),
                validateInteger("Number of rows", rows, 1, MAX_QUESTIONS),
                validateSecondsField("Time interval", time, MIN_SECONDS, MAX_INTERVAL_SECONDS),
              ])
            ) {
              return;
            }
            navigation.navigate("NumberDisplay", { digit, rows, time, speak, changeColor });
          }}
        />
      </View>
    </View>
  );
};

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: c.background,
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
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: c.text,
    marginBottom: 25,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: c.textMuted,
    marginBottom: 8,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: c.border,
    marginVertical: 20,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  switchLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchText: {
    fontSize: 16,
    fontWeight: "600",
    color: c.text,
    marginLeft: 12,
  },
  buttonWrapper: {
    paddingVertical: 30,
  },
});

export default SettingsScreen;
