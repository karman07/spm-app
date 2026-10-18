import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/colors/Colors";
import React, { useRef } from "react";
import { Animated, Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, StyleProp } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BASE_COLOR, colors, radius, shadow } from "@/colors/Colors";

type Variant = "primary" | "outline" | "ghost" | "danger";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, variant = "primary", icon, loading, disabled, style }) => {
  const { colors: c } = useTheme();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const scale = useRef(new Animated.Value(1)).current;
  const animate = (to: number) =>
    Animated.spring(scale, { toValue: to, speed: 40, bounciness: 0, useNativeDriver: true }).start();

  const isDisabled = disabled || loading;
  const fg = variant === "primary" || variant === "danger" ? "#fff" : c.primary;

  return (
    <Animated.View style={[styles.wrap, { transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => animate(0.97)}
        onPressOut={() => animate(1)}
        disabled={isDisabled}
        style={[
          styles.button,
          variant === "primary" && [styles.primary, shadow.soft],
          variant === "danger" && styles.danger,
          variant === "outline" && styles.outline,
          variant === "ghost" && styles.ghost,
          isDisabled && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={fg} />
        ) : (
          <>
            {icon ? <Icon name={icon} size={20} color={fg} style={styles.icon} /> : null}
            <Text style={[styles.text, { color: fg }]}>{title}</Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const createStyles = (c: ThemeColors) => StyleSheet.create({
  wrap: {
    width: "100%",
    marginVertical: 8,
  },
  button: {
    minHeight: 54,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: c.button },
  danger: { backgroundColor: c.danger },
  outline: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: c.primary },
  ghost: { backgroundColor: c.primarySoft },
  disabled: { opacity: 0.5 },
  icon: { marginRight: 8 },
  text: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

export default Button;
