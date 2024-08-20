import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types"; // Import the type
import LoginScreen from "../screens/LoginScreen";
import DoctorListScreen from "../screens/DoctorListScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileScreenSettings from "../screens/ProfileScreenSettings";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    
      <Stack.Navigator>
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DoctorListScreen"
          component={DoctorListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreenSettings"
          component={ProfileScreenSettings}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
   
  );
};

export default AppNavigator;
