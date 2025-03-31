import { BASE_COLOR } from '@/colors/Colors';
import { getOperations } from '@/context/options';
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeScreen({ navigation }: any) {
  const operations = getOperations(navigation); 

  return (
    <View style={styles.container}>
      <FlatList
        data={operations}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate(item.screen)} 
          >
            <Icon name={item.icon} size={50} color={BASE_COLOR} />
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    margin: 10,
    borderWidth: 2,
    borderColor: BASE_COLOR,
    borderRadius: 15,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BASE_COLOR,
    marginTop: 10,
    textAlign: 'center',
  },
});
