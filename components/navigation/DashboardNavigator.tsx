import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StyleSheet } from "react-native";
import Dashboard from "@/app/(tabs)/dashboard";
import Settings from "@/app/(tabs)/settings";

const Drawer = createDrawerNavigator();

export default function DashboardNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "blue" },
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTintColor: 'white',
        drawerStyle: {
            backgroundColor: 'white'
        },
        drawerInactiveTintColor: 'black'
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ title: "DASHBOARD" }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{ title: "SETTINGS" }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
});
