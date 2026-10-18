import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/colors/Colors";
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BASE_COLOR, colors, radius } from "@/colors/Colors";

interface InputProps extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  icon?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, icon, error, onFocus, onBlur, style, ...rest }) => {
  const { colors: c } = useTheme();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, focused && styles.focused, !!error && styles.errored]}>
        {icon ? <Icon name={icon} size={20} color={focused ? c.primary : c.textMuted} style={styles.icon} /> : null}
        <TextInput
          {...rest}
          style={[styles.input, style]}
          placeholderTextColor={c.inputPlaceholder}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const createStyles = (c: ThemeColors) => StyleSheet.create({
  wrap: {
    width: "100%",
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: c.textMuted,
    marginBottom: 6,
    marginLeft: 2,
  },
  field: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  focused: {
    borderColor: c.primary,
    backgroundColor: c.surface,
  },
  errored: {
    borderColor: c.danger,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: c.text,
    height: "100%",
  },
  error: {
    color: c.danger,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
});

export default Input;
