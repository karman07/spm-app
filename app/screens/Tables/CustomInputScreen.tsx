import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './TableNavigator';
import { BASE_COLOR } from '@/colors/Colors';
import Input from "../../components/Input";
import Button from "../../components/Button";

type CustomInputNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CustomInput'>;

export default function CustomInputScreen() {
  const [input, setInput] = useState('');
  const navigation = useNavigation<CustomInputNavigationProp>();

  const handleGenerate = () => {
    const num = parseInt(input);
    if (!isNaN(num) && num > 0) {
      navigation.navigate('TableDisplay', { number: num });
    } else {
      Alert.alert('Invalid Input', 'Please enter a valid positive number (e.g., 25).');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Custom Table</Text>
          <Text style={styles.subtitle}>Enter any number to generate its multiplication table up to infinity</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Table Number</Text>
            <Input
              placeholder="e.g. 29"
              keyboardType="numeric"
              value={input}
              onChangeText={setInput}
              autoFocus={true}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button title="Generate Table" onPress={handleGenerate} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },
  buttonWrapper: {
    marginTop: 10,
  },
});
