import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/colors/Colors";
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { getOperations } from "@/context/options";
import { radius, withAlpha, lighten } from "@/colors/Colors";

export default function CustomDrawer(props: any) {
  const { colors: c, isDark, toggleDark } = useTheme();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const { navigation, state } = props;
  const operations = getOperations(navigation);
  const activeRoute: string = state?.routes?.[state.index]?.name;

  const renderItem = (key: string, label: string, icon: string, screen: string, baseColor: string) => {
    const color = isDark && baseColor.length === 7 ? lighten(baseColor, 0.4) : baseColor;
    const active = activeRoute === screen;
    return (
      <TouchableOpacity
        key={key}
        activeOpacity={0.7}
        onPress={() => navigation.navigate(screen)}
        style={[styles.item, active && { backgroundColor: withAlpha(color, isDark ? 0.16 : 0.12) }]}
      >
        <View style={[styles.itemIcon, { backgroundColor: active ? color : withAlpha(color, isDark ? 0.16 : 0.12) }]}>
          <Icon name={icon} size={20} color={active ? (isDark ? "#0C1210" : "#fff") : color} />
        </View>
        <Text style={[styles.itemLabel, active && { color, fontWeight: "800" }]}>{label}</Text>
        {active && <View style={[styles.activeDot, { backgroundColor: color }]} />}
      </TouchableOpacity>
    );
  };

  const practice = operations.filter((o) => o.group === "Practice");
  const tools = operations.filter((o) => o.group === "Tools");

  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.heroRow}>
            <View style={styles.logoWrap}>
              <Image source={require("../../assets/img/Sprouting_Minds_Abacus_(1).png")} style={styles.logo} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.brand}>Abacus</Text>
              <Text style={styles.tagline}>Sharpen your mental math</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {renderItem("home", "Home", "home-variant", "Home", c.primary)}

        <Text style={styles.section}>Practice</Text>
        {practice.map((o) => renderItem(o.id, o.name, o.icon, o.screen, o.color))}

        <Text style={styles.section}>Tools</Text>
        {tools.map((o) => renderItem(o.id, o.name, o.icon, o.screen, o.color))}
      </DrawerContentScrollView>

      <SafeAreaView edges={["bottom"]} style={styles.footer}>
        <View style={styles.themeRow}>
          <View style={styles.themeIcon}>
            <Icon name={isDark ? "weather-night" : "white-balance-sunny"} size={20} color={c.primary} />
          </View>
          <Text style={styles.themeLabel}>Dark mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleDark}
            trackColor={{ false: c.border, true: c.button }}
            thumbColor="#fff"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: c.surface,
  },
  hero: {
    backgroundColor: c.header,
    paddingHorizontal: 20,
    paddingBottom: 22,
    paddingTop: 8,
    borderBottomRightRadius: 28,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: c.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 52,
    height: 52,
    resizeMode: "contain",
  },
  heroText: {
    marginLeft: 14,
    flex: 1,
  },
  brand: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  tagline: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 24,
  },
  section: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: c.textMuted,
    textTransform: "uppercase",
    marginTop: 18,
    marginBottom: 6,
    marginLeft: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    marginVertical: 1,
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "600",
    color: c.text,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: c.border,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: c.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  themeLabel: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "600",
    color: c.text,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
