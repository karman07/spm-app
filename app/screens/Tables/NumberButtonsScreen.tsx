import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '@/colors/theme';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './TableNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handlePress = (num: number) => {
    navigation.navigate('TableDisplay', { number: num });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('CustomInput')}>
        <Text style={styles.customButtonText}>+</Text>
      </TouchableOpacity>

      <View style={styles.buttonGrid}>
        {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
          <TouchableOpacity key={num} style={styles.numButton} onPress={() => handlePress(num)}>
            <Text style={styles.numButtonText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.background,
    padding: 10,
    alignItems: 'center',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  numButton: {
    width: '18%',
    margin: '1%',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.baseColor,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  numButtonText: {
    color: theme.baseColor,
    fontWeight: 'bold',
  },
  customButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.baseColor,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  customButtonText: {
    color: theme.baseColor,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
