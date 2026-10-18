import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/colors/Colors";
import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getOperations } from "@/context/options";
import { radius, shadow, withAlpha, lighten } from "@/colors/Colors";

export default function HomeScreen({ navigation }: any) {
  const { colors: c, isDark } = useTheme();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const operations = getOperations(navigation);

  return (
    <View style={styles.container}>
      <FlatList
        data={operations}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const accent = isDark ? lighten(item.color, 0.4) : item.color;
          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={[styles.iconBubble, { backgroundColor: withAlpha(accent, isDark ? 0.18 : 0.13) }]}>
                <Icon name={item.icon} size={30} color={accent} />
              </View>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.description} numberOfLines={1}>{item.description}</Text>
              <View style={[styles.goPill, { backgroundColor: withAlpha(accent, isDark ? 0.18 : 0.13) }]}>
                <Icon name="arrow-right" size={16} color={accent} />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 28,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: c.surface,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 14,
    ...shadow.card,
  },
  iconBubble: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    color: c.text,
  },
  description: {
    fontSize: 12.5,
    color: c.textMuted,
    marginTop: 3,
    marginBottom: 14,
  },
  goPill: {
    alignSelf: "flex-start",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
