import Dashboard from "@/app/(tabs)/dashboard";
import Settings from "@/app/(tabs)/settings";
import Schedule from "@/app/(tabs)/schedule";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const Tab = createBottomTabNavigator();
type RootStackParamList = {
  Login: undefined;
  Schedule: undefined;
};

type LogoutNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

export default function DashboardTabNavigation() {
  const navigation = useNavigation<LogoutNavigationProp>();

  const handleLogout = () => {
    return (
      <Pressable onPress={() => navigation.navigate("Login")}>
        <Ionicons name="log-out-outline" size={30} color={"white"} />
      </Pressable>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "blue" },
        headerTitleStyle: { fontWeight: "bold" },
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "lightgray",
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        headerRight: () => handleLogout(),
      }}
    >
      <Tab.Screen
        name="DASHBOARD"
        component={Dashboard}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={20} color={color} />
          ),
          tabBarLabel: ({ color }) => <Text style={{ color }}>Dashboard</Text>,
        }}
      />
      <Tab.Screen
        name="CALENDAR"
        component={Schedule}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar" size={20} color={color} />
          ),
          tabBarLabel: ({ color }) => <Text style={{ color }}>Calendar</Text>,
        }}
      />
      <Tab.Screen
        name="SETTINGS"
        component={Settings}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={20} color={color} />
          ),
          tabBarLabel: ({ color }) => <Text style={{ color }}>Settings</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
