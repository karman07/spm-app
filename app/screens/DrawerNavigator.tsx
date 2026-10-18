import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
import CustomDrawer from "../components/CustomDrawer";
import { useTheme } from "@/context/ThemeContext";
import AddNavigator from "./Add/AddNavigator";
import SubtractNavigator from "./Sub/SubtractNavigator";
import MultiplicationNavigator from "./Mul/MultiplicationNavigator";
import DivisionNavigator from "./Div/DivisionNavigator";
import Stopwatch from "./Stopwatch/Stopwatch";
import CountdownTimer from "./Timer/Timer";
import SquareRootNavigator from "./Square/SquareRootNavigator";
import TableNavigator from "./Tables/TableNavigator";
import RiddlesNavigator from "./Riddles/RiddlesNavigator";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { colors: c } = useTheme();
  return (
    <>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: c.header, elevation: 0, shadowOpacity: 0 },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "800", fontSize: 18, letterSpacing: 0.3 },
          drawerStyle: { width: 310, backgroundColor: c.surface },
          sceneStyle: { backgroundColor: c.background },
          overlayColor: "rgba(10,25,16,0.45)",
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} options={{ title: "Abacus" }} />
        <Drawer.Screen name="Add" component={AddNavigator} options={{ title: "Addition" }} />
        <Drawer.Screen name="Sub" component={SubtractNavigator} options={{ title: "Subtraction" }} />
        <Drawer.Screen name="Mul" component={MultiplicationNavigator} options={{ title: "Multiplication" }} />
        <Drawer.Screen name="Div" component={DivisionNavigator} options={{ title: "Division" }} />
        <Drawer.Screen name="StopWatch" component={Stopwatch} options={{ title: "Stopwatch" }} />
        <Drawer.Screen name="Timer" component={CountdownTimer} />
        <Drawer.Screen name="Square" options={{ title: "Square Root" }}>
          {() => <SquareRootNavigator mode="square" />}
        </Drawer.Screen>
        <Drawer.Screen name="Cube" options={{ title: "Cube Root" }}>
          {() => <SquareRootNavigator mode="cube" />}
        </Drawer.Screen>
        <Drawer.Screen name="Table" component={TableNavigator} options={{ title: "Tables" }} />
        <Drawer.Screen name="Riddles" component={RiddlesNavigator} options={{ title: "Math Riddles" }} />
      </Drawer.Navigator>
    </>
  );
};

export default DrawerNavigator;
