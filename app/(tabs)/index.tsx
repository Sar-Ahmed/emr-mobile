import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './login';
import DashboardNavigator from '@/components/navigation/DashboardNavigator';

const Stack = createNativeStackNavigator();

export default function HomeScreen() {
  return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'LOGIN', headerStyle: { backgroundColor: 'blue' }, headerTitleStyle: { fontWeight: 'bold' } }}
        />
        <Stack.Screen
          name="DashboardNavigator"
          component={DashboardNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
  );
}
