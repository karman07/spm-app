import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './TableNavigator';
import { theme } from '@/colors/theme';

type CustomInputNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CustomInput'>;

export default function CustomInputScreen() {
  const [input, setInput] = useState('');
  const navigation = useNavigation<CustomInputNavigationProp>();

  const handleGenerate = () => {
    const num = parseInt(input);
    if (!isNaN(num) && num > 0) {
      navigation.navigate('TableDisplay', { number: num });
    } else {
      Alert.alert('Invalid Input', 'Enter a valid positive number.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter a number"
        keyboardType="numeric"
        value={input}
        onChangeText={setInput}
      />
      <Button title="Generate" onPress={handleGenerate} color={theme.baseColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.baseColor,
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
});
