import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
import CustomDrawer from "../components/CustomDrawer";
import { BASE_COLOR } from "@/colors/Colors";
import AddNavigator from "./Add/AddNavigator";
import SubtractNavigator from "./Sub/SubtractNavigator";
import MultiplicationNavigator from "./Mul/MultiplicationNavigator";
import DivisionNavigator from "./Div/DivisionNavigator";
import Stopwatch from "./Stopwatch/Stopwatch";
import CountdownTimer from "./Timer/Timer";
import SquareRootNavigator from "./Square/SquareRootNavigator";
import NativeAdComponent from "../components/BannerAd";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <>
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
      <Drawer.Screen name="Div" component={DivisionNavigator} />
      <Drawer.Screen name="StopWatch" component={Stopwatch} />
      <Drawer.Screen name="Timer" component={CountdownTimer} />
      <Drawer.Screen name="Square" component={SquareRootNavigator} />
      <Drawer.Screen name="Cube" component={SquareRootNavigator} />
    
    </Drawer.Navigator>
    <NativeAdComponent/>
    </>
  );
};

export default DrawerNavigator;
