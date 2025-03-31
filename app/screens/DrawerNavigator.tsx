import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
import CustomDrawer from "../components/CustomDrawer";
import { BASE_COLOR } from "@/colors/Colors";
import AddNavigator from "./Add/AddNavigator";
import SubtractNavigator from "./Sub/SubtractNavigator";
import MultiplicationNavigator from "./Mul/MultiplicationNavigator";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: BASE_COLOR },
        headerTintColor: "#fff",
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Add" component={AddNavigator} />
      <Drawer.Screen name="Sub" component={SubtractNavigator} />
      <Drawer.Screen name="Mul" component={MultiplicationNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
