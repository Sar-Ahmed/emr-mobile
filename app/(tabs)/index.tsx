import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./login";
import { PaperProvider } from "react-native-paper";
import CreateEncounter from "./createEncounter";
import DashboardTabNavigation from "../../components/navigation/DashboardTabNavigation";

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
        <Stack.Screen name="CreateEncounter" component={CreateEncounter} options={{ title: "New Patient Encounter" }} />
      </Stack.Navigator>
    </PaperProvider>
  );
}
