import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/colors/Colors";
import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "../../components/Button";
import { BASE_COLOR, colors, radius, shadow } from "@/colors/Colors";

const pad = (n: number) => String(n).padStart(2, "0");

const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return hours > 0 ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
};

const Stopwatch: React.FC = () => {
  const { colors: c } = useTheme();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    setIsRunning(true);
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const resetTimer = () => {
    pauseTimer();
    setTime(0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={[styles.statusPill, isRunning && styles.statusPillActive]}>
          <View style={[styles.statusDot, isRunning && styles.statusDotActive]} />
          <Text style={[styles.statusText, isRunning && styles.statusTextActive]}>
            {isRunning ? "Running" : time > 0 ? "Paused" : "Ready"}
          </Text>
        </View>

        <Text style={styles.timer} adjustsFontSizeToFit numberOfLines={1}>
          {formatTime(time)}
        </Text>
        <Text style={styles.caption}>{time >= 3600 ? "hours : minutes : seconds" : "minutes : seconds"}</Text>
      </View>

      <View style={styles.actions}>
        {!isRunning ? (
          <Button title={time > 0 ? "Resume" : "Start"} icon="play" onPress={startTimer} />
        ) : (
          <Button title="Pause" icon="pause" onPress={pauseTimer} />
        )}
        <Button title="Reset" icon="restart" variant="outline" onPress={resetTimer} disabled={time === 0 && !isRunning} />
      </View>
    </View>
  );
};

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: c.surface,
    borderRadius: radius.xl,
    paddingVertical: 44,
    paddingHorizontal: 20,
    alignItems: "center",
    ...shadow.card,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 24,
  },
  statusPillActive: {
    backgroundColor: c.primarySoft,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: c.textMuted,
    marginRight: 8,
  },
  statusDotActive: {
    backgroundColor: c.button,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
    color: c.textMuted,
  },
  statusTextActive: {
    color: c.primary,
  },
  timer: {
    width: "100%",
    textAlign: "center",
    fontSize: 80,
    fontWeight: "800",
    color: c.text,
    fontVariant: ["tabular-nums"],
  },
  caption: {
    marginTop: 8,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: c.textMuted,
  },
  actions: {
    marginTop: 28,
  },
});

export default Stopwatch;
