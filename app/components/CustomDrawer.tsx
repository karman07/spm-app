import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getOperations } from '@/context/options';

export default function CustomDrawer(props: any) {
  const { navigation } = props; 
  const operations = getOperations(navigation);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/img/Sprouting_Minds_Abacus_(1).png')} style={styles.logo} />
      </View>

      {operations.map((operation) => (
        <DrawerItem
          key={operation.id}
          label={operation.name}
          icon={({ color, size }) => (
            <Icon name={operation.icon} size={size} color={color} />
          )}
          onPress={() => navigation.navigate(operation.screen)} 
        />
      ))}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 150, 
    height: 150, 
    resizeMode: 'contain',
  },
});
