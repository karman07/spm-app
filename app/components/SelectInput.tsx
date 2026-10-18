import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/colors/Colors";
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BASE_COLOR, colors, radius, shadow } from "@/colors/Colors";

export const numberOptions = (min: number, max: number): string[] =>
  Array.from({ length: max - min + 1 }, (_, i) => String(min + i));

interface SelectInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  title?: string;
  // Lets the user type a whole number that is not in `options`, within [min, max].
  allowCustom?: { min: number; max: number };
}

// Searchable dropdown. Values come from `options`, or from a typed number inside `allowCustom` limits,
// so the stored value is always a valid whole number.
const SelectInput: React.FC<SelectInputProps> = ({ placeholder, value, onChange, options, title, allowCustom }) => {
  const { colors: c } = useTheme();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim();
    return q ? options.filter((o) => o.includes(q)) : options;
  }, [options, query]);

  const typed = query.trim();
  const typedNumber = typed ? parseInt(typed, 10) : NaN;
  const hasExactOption = options.includes(String(typedNumber));
  const showCustom =
    !!allowCustom && !isNaN(typedNumber) && !hasExactOption &&
    typedNumber >= allowCustom.min && typedNumber <= allowCustom.max;
  const customTooBig = !!allowCustom && !isNaN(typedNumber) && typedNumber > allowCustom.max;
  const customTooSmall = !!allowCustom && !isNaN(typedNumber) && typedNumber < allowCustom.min;

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const select = (option: string) => {
    onChange(option);
    close();
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.field, open && styles.fieldOpen]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.fieldText, !value && styles.placeholder]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <Icon name="chevron-down" size={22} color={c.textMuted} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide" onRequestClose={close}>
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={close} />
          <View style={styles.sheet}>
            <View style={styles.grabber} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{title || "Select a number"}</Text>
              <TouchableOpacity onPress={close} style={styles.closeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="close" size={20} color={c.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchBox}>
              <Icon name="magnify" size={20} color={c.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder={allowCustom ? "Search or type your own number" : "Search"}
                placeholderTextColor={c.inputPlaceholder}
                value={query}
                onChangeText={(t) => setQuery(t.replace(/[^0-9]/g, ""))}
                keyboardType="number-pad"
                maxLength={9}
              />
            </View>

            {showCustom && (
              <TouchableOpacity style={styles.customRow} onPress={() => select(String(typedNumber))}>
                <View style={styles.customIcon}>
                  <Icon name="plus" size={18} color="#fff" />
                </View>
                <Text style={styles.customText}>Use {typedNumber}</Text>
              </TouchableOpacity>
            )}
            {(customTooBig || customTooSmall) && allowCustom && (
              <Text style={styles.hint}>
                {customTooBig ? `Maximum allowed is ${allowCustom.max}` : `Minimum allowed is ${allowCustom.min}`}
              </Text>
            )}

            <FlatList
              data={filtered}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={20}
              ListEmptyComponent={showCustom ? null : <Text style={styles.empty}>No matching option</Text>}
              renderItem={({ item }) => {
                const selected = item === value;
                return (
                  <TouchableOpacity style={[styles.option, selected && styles.optionActive]} onPress={() => select(item)}>
                    <Text style={[styles.optionText, selected && styles.optionSelected]}>{item}</Text>
                    {selected && <Icon name="check-circle" size={20} color={c.primary} />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const createStyles = (c: ThemeColors) => StyleSheet.create({
  field: {
    width: "100%",
    height: 52,
    borderColor: c.border,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: c.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldOpen: {
    borderColor: c.primary,
  },
  fieldText: {
    flex: 1,
    fontSize: 16,
    color: c.text,
  },
  placeholder: {
    color: c.inputPlaceholder,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,25,16,0.45)",
  },
  sheet: {
    backgroundColor: c.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: "68%",
    paddingBottom: 28,
    ...shadow.raised,
  },
  grabber: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: c.border,
    marginTop: 10,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: c.text,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: c.background,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 12,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: c.background,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: c.text,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 22,
  },
  optionActive: {
    backgroundColor: c.primarySoft,
  },
  optionText: {
    fontSize: 17,
    color: c.text,
  },
  optionSelected: {
    color: c.primary,
    fontWeight: "800",
  },
  customRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 6,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: c.primarySoft,
    borderWidth: 1,
    borderColor: c.primary,
    borderStyle: "dashed",
  },
  customIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: c.button,
    alignItems: "center",
    justifyContent: "center",
  },
  customText: {
    marginLeft: 12,
    fontSize: 17,
    fontWeight: "800",
    color: c.primary,
  },
  hint: {
    color: c.danger,
    paddingHorizontal: 22,
    paddingBottom: 8,
  },
  empty: {
    textAlign: "center",
    color: c.textMuted,
    padding: 24,
  },
});

export default SelectInput;
