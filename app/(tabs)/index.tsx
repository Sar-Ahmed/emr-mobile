import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./login";
import DashboardTabNavigation from "@/components/navigation/DashboardTabNavigation";
import { PaperProvider } from "react-native-paper";

const Stack = createNativeStackNavigator();

export default function HomeScreen() {
  return (
    <PaperProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "LOGIN" }}
        />
        <Stack.Screen
          name="DashboardTabNavigation"
          component={DashboardTabNavigation}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </PaperProvider>
  );
}
