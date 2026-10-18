import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/colors/Colors";
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './TableNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BASE_COLOR } from '@/colors/Colors';
import Button from '../../components/Button';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const { colors: c } = useTheme();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handlePress = (num: number) => {
    navigation.navigate('TableDisplay', { number: num });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Learning Tables</Text>
          <Text style={styles.subtitle}>Select a table to start learning or enter a custom one</Text>

          <TouchableOpacity
            style={styles.customInputRow}
            onPress={() => navigation.navigate('CustomInput')}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.plusIcon}>+</Text>
            </View>
            <Text style={styles.customInputText}>Enter Custom Table Number</Text>
          </TouchableOpacity>

          <View style={styles.buttonGrid}>
            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.numButton}
                onPress={() => handlePress(num)}
                activeOpacity={0.7}
              >
                <Text style={styles.numButtonText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.moreTablesText}>More tables up to 100 available via custom input</Text>
        </View>

        <View style={styles.quizCard}>
          <Text style={styles.sectionTitle}>Dodging Tables</Text>
          <Text style={styles.subtitle}>Test your knowledge with random table questions</Text>

          <View style={styles.buttonWrapper}>
            <Button
              title="Start Table Quiz"
              onPress={() => navigation.navigate('DodgingTableSettings')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: c.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  quizCard: {
    backgroundColor: c.surface,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: c.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: c.textMuted,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.background,
    padding: 12,
    borderRadius: 15,
    marginBottom: 20,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: c.button,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  plusIcon: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  customInputText: {
    fontSize: 16,
    fontWeight: '600',
    color: c.text,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  numButton: {
    width: '18%',
    aspectRatio: 1,
    marginVertical: 6,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: c.surface,
    borderWidth: 2,
    borderColor: c.border,
  },
  numButtonText: {
    color: c.primary,
    fontWeight: '800',
    fontSize: 18,
  },
  moreTablesText: {
    marginTop: 15,
    fontSize: 12,
    color: c.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 10,
  },
});
