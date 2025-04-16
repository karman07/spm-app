import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import Colors from '@/colors/NewColor';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './RiddlesNavigator';

type Props =    NativeStackScreenProps<RootStackParamList, 'Home'>; 

export default function Home({ navigation }: Props ) {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Math Riddle Quiz" />
        <Card.Content>
          <Text variant="titleMedium">🎯 Total Questions: 5</Text>
          <Text variant="titleMedium">⏱️ Time: 60 seconds</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => navigation.navigate('Quiz')}>
            Start Quiz
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: Colors.background },
  card: { padding: 20 },
});
