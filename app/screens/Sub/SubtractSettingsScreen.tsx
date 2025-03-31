import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { SubtractStackParamList } from "@/types/types";
import Input from "../../components/Input";
import Button from "../../components/Button";

type Props = StackScreenProps<SubtractStackParamList, "SubtractSettings">;

const SubtractSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [digit, setDigit] = useState("");
  const [rows, setRows] = useState("");
  const [time, setTime] = useState("");
  const [speak, setSpeak] = useState(false);
  const [changeColor, setChangeColor] = useState(false);

  return (
    <View style={styles.container}>
      <Input 
        placeholder="Enter number of digits (1-4)" 
        value={digit} 
        onChangeText={setDigit} 
        keyboardType="numeric" 
      />
      
      <Input 
        placeholder="Enter number of rows" 
        value={rows} 
        onChangeText={setRows} 
        keyboardType="numeric" 
      />
      
      <Input 
        placeholder="Time interval (seconds)" 
        value={time} 
        onChangeText={setTime} 
        keyboardType="numeric" 
      />

      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>🔊 Speak Numbers</Text>
        <Switch 
          value={speak} 
          onValueChange={setSpeak} 
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>🎨 Change Number Color</Text>
        <Switch 
          value={changeColor} 
          onValueChange={setChangeColor} 
        />
      </View>

      <Button
        title="▶ Start Game"
        onPress={() => navigation.navigate("SubtractNumberDisplay", { digit, rows, time, speak, changeColor })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#f5f5f5" },
  switchContainer: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, marginBottom: 10 },
  switchText: { fontSize: 18, fontWeight: "500", color: "#333" },
});

export default SubtractSettingsScreen;
