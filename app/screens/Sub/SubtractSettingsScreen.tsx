import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { SubtractStackParamList } from "@/types/types";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { BASE_COLOR } from "@/colors/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Props = StackScreenProps<SubtractStackParamList, "SubtractSettings">;

const SubtractSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [digit, setDigit] = useState("");
  const [rows, setRows] = useState("");
  const [time, setTime] = useState("");
  const [speak, setSpeak] = useState(false);
  const [changeColor, setChangeColor] = useState(false);

  const isSpeakDisabled = parseFloat(time) < 1;

  React.useEffect(() => {
    if (isSpeakDisabled) {
      setSpeak(false);
    }
  }, [time]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Subtraction Settings</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Digits (1-4)</Text>
          <Input
            placeholder="e.g. 2"
            value={digit}
            onChangeText={setDigit}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Rows</Text>
          <Input
            placeholder="e.g. 10"
            value={rows}
            onChangeText={setRows}
            keyboardType="numeric"
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
            <Icon name="volume-high" size={24} color={BASE_COLOR} />
            <Text style={styles.switchText}>Speak Numbers</Text>
          </View>
          <Switch
            value={speak}
            onValueChange={setSpeak}
            disabled={isSpeakDisabled}
            trackColor={{ false: "#ddd", true: isSpeakDisabled ? "#eee" : BASE_COLOR + "80" }}
            thumbColor={speak ? BASE_COLOR : "#f4f3f4"}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Icon name="palette" size={24} color={BASE_COLOR} />
            <Text style={styles.switchText}>Dynamic Colors</Text>
          </View>
          <Switch
            value={changeColor}
            onValueChange={setChangeColor}
            trackColor={{ false: "#ddd", true: BASE_COLOR + "80" }}
            thumbColor={changeColor ? BASE_COLOR : "#f4f3f4"}
          />
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title="Start Practice"
          onPress={() => navigation.navigate("SubtractNumberDisplay", { digit, rows, time, speak, changeColor })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
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
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 25,
    textAlign: "center",
  },
  inputGroup: {
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
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
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
    color: "#333",
    marginLeft: 12,
  },
  buttonWrapper: {
    paddingVertical: 30,
  },
});

export default SubtractSettingsScreen;
