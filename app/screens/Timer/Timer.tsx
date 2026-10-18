import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/colors/Colors";
import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "../../components/Button";
import { BASE_COLOR, colors, radius, shadow } from "@/colors/Colors";

const pad = (n: number) => String(n).padStart(2, "0");

const CountdownTimer = () => {
  const { colors: c } = useTheme();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

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
      setTotalTime(total);
      setHasStarted(true);
    }

    setIsRunning(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
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
    setTotalTime(0);
    setIsRunning(false);
    setHasStarted(false);
  };

  const display = timeLeft > 0 || hasStarted ? timeLeft : getTotalSeconds();
  const displayHours = Math.floor(display / 3600);
  const displayMinutes = Math.floor((display % 3600) / 60);
  const displaySeconds = display % 60;
  const progress = hasStarted && totalTime > 0 ? timeLeft / totalTime : 1;
  const finished = hasStarted && timeLeft === 0;

  const pickers: { label: string; type: "h" | "m" | "s"; value: number }[] = [
    { label: "Hours", type: "h", value: hours },
    { label: "Minutes", type: "m", value: minutes },
    { label: "Seconds", type: "s", value: seconds },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.displayCard}>
        <Text style={styles.displayLabel}>{finished ? "Time's up" : hasStarted ? (isRunning ? "Counting down" : "Paused") : "Set your time"}</Text>
        <Text style={[styles.timerText, finished && styles.timerFinished]} adjustsFontSizeToFit numberOfLines={1}>
          {pad(displayHours)}:{pad(displayMinutes)}:{pad(displaySeconds)}
        </Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.max(0, Math.min(1, progress)) * 100}%` }, finished && styles.fillFinished]} />
        </View>
      </View>

      {!hasStarted && (
        <View style={styles.pickerRow}>
          {pickers.map((p) => (
            <View style={styles.timePicker} key={p.label}>
              <TouchableOpacity style={styles.arrowBtn} onPress={() => increment(p.type)}>
                <Icon name="chevron-up" size={26} color={c.primary} />
              </TouchableOpacity>
              <Text style={styles.time}>{pad(p.value)}</Text>
              <TouchableOpacity style={styles.arrowBtn} onPress={() => decrement(p.type)}>
                <Icon name="chevron-down" size={26} color={c.primary} />
              </TouchableOpacity>
              <Text style={styles.label}>{p.label}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        {!hasStarted && <Button title="Start Countdown" icon="play" onPress={startCountdown} disabled={getTotalSeconds() === 0} />}

        {hasStarted && (
          <>
            {!isRunning ? (
              <Button title={finished ? "Finished" : "Resume"} icon="play" onPress={startCountdown} disabled={finished} />
            ) : (
              <Button title="Pause" icon="pause" onPress={pauseCountdown} />
            )}
            <Button title="Reset" icon="restart" variant="outline" onPress={resetCountdown} />
          </>
        )}
      </View>
    </ScrollView>
  );
};

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: c.background,
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  displayCard: {
    backgroundColor: c.surface,
    borderRadius: radius.xl,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
    ...shadow.card,
  },
  displayLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: c.textMuted,
    marginBottom: 12,
  },
  timerText: {
    width: "100%",
    textAlign: "center",
    fontSize: 64,
    fontWeight: "800",
    color: c.text,
    fontVariant: ["tabular-nums"],
  },
  timerFinished: {
    color: c.danger,
  },
  track: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    backgroundColor: c.background,
    marginTop: 22,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: c.button,
  },
  fillFinished: {
    backgroundColor: c.danger,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  timePicker: {
    flex: 1,
    alignItems: "center",
    backgroundColor: c.surface,
    borderRadius: radius.lg,
    paddingVertical: 12,
    marginHorizontal: 5,
    ...shadow.soft,
  },
  arrowBtn: {
    width: 44,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  time: {
    fontSize: 34,
    fontWeight: "800",
    color: c.primary,
    fontVariant: ["tabular-nums"],
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: c.textMuted,
  },
  actions: {
    marginTop: 24,
  },
});

export default CountdownTimer;
