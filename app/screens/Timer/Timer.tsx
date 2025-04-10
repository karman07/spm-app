import { BASE_COLOR } from "@/colors/Colors";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const pad = (n: number) => String(n).padStart(2, "0");

const CountdownTimer = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const increment = (type: "h" | "m" | "s") => {
    if (type === "h") setHours((prev) => (prev + 1) % 24);
    if (type === "m") setMinutes((prev) => (prev + 1) % 60);
    if (type === "s") setSeconds((prev) => (prev + 1) % 60);
  };

  const decrement = (type: "h" | "m" | "s") => {
    if (type === "h") setHours((prev) => (prev - 1 + 24) % 24);
    if (type === "m") setMinutes((prev) => (prev - 1 + 60) % 60);
    if (type === "s") setSeconds((prev) => (prev - 1 + 60) % 60);
  };

  const getTotalSeconds = () => hours * 3600 + minutes * 60 + seconds;

  const startCountdown = () => {
    const total = hasStarted ? timeLeft : getTotalSeconds();
    if (total <= 0) return;

    if (!hasStarted) {
      setTimeLeft(total);
      setHasStarted(true);
    }

    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          intervalRef.current = null;
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };

  const resetCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setTimeLeft(0);
    setIsRunning(false);
    setHasStarted(false);
  };

  const display = timeLeft > 0 || hasStarted ? timeLeft : getTotalSeconds();
  const displayHours = Math.floor(display / 3600);
  const displayMinutes = Math.floor((display % 3600) / 60);
  const displaySeconds = display % 60;

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {!hasStarted && (
        <View style={styles.pickerRow}>
          {["Hours", "Minutes", "Seconds"].map((label, index) => (
            <View style={styles.timePicker} key={label}>
              <TouchableOpacity
                onPress={() =>
                  increment(index === 0 ? "h" : index === 1 ? "m" : "s")
                }
              >
                <Text style={styles.arrow}>▲</Text>
              </TouchableOpacity>
              <Text style={styles.time}>
                {pad(index === 0 ? hours : index === 1 ? minutes : seconds)}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  decrement(index === 0 ? "h" : index === 1 ? "m" : "s")
                }
              >
                <Text style={styles.arrow}>▼</Text>
              </TouchableOpacity>
              <Text style={styles.label}>{label}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.timerDisplay}>
        <Text style={styles.timerText}>
          {pad(displayHours)}:{pad(displayMinutes)}:{pad(displaySeconds)}
        </Text>
      </View>

      {!hasStarted && (
        <TouchableOpacity style={styles.startButton} onPress={startCountdown}>
          <Text style={styles.startText}>Start Countdown</Text>
        </TouchableOpacity>
      )}

      {hasStarted && (
        <View style={styles.controls}>
          {!isRunning ? (
            <TouchableOpacity style={styles.startButton} onPress={startCountdown}>
              <Text style={styles.startText}>Start</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.pauseButton} onPress={pauseCountdown}>
              <Text style={styles.pauseText}>Pause</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.resetButton} onPress={resetCountdown}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 30,
  },
  timePicker: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  arrow: {
    fontSize: 24,
    color: BASE_COLOR,
  },
  time: {
    fontSize: 36,
    fontWeight: "bold",
    color: BASE_COLOR,
  },
  label: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  startButton: {
    backgroundColor: BASE_COLOR,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  startText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  timerDisplay: {
    marginTop: 10,
    marginBottom: 10,
  },
  timerText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#111",
  },
  pauseButton: {
    backgroundColor: "#FBC02D",
    padding: 14,
    borderRadius: 10,
    marginRight: 10,
  },
  pauseText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  resetButton: {
    backgroundColor: "#D32F2F",
    padding: 14,
    borderRadius: 10,
    marginLeft: 10,
  },
  resetText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  controls: {
    flexDirection: "row",
    marginTop: 20,
    gap: 20,
  },
});

export default CountdownTimer;
