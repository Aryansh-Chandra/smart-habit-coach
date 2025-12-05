import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import EditHabitScreen from "../screens/EditHabitScreen";
import SwipeTabs from "../navigation/SwipeTabs";
import AddHabitScreen from "../screens/AddHabitScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import { useAuth } from "../utils/AuthContext";

const Stack = createNativeStackNavigator();

function MainWrapper(props) {
  // Pass navigation manually to SwipeTabs
  return <SwipeTabs navigation={props.navigation} />;
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Authenticated user
          <>
            {/* Main screen */}
            <Stack.Screen name="Main" component={MainWrapper} />

            {/* Add Habit screen */}
            <Stack.Screen
              name="AddHabit"
              component={AddHabitScreen}
              options={{
                headerShown: true,
                title: "Add Habit",
              }}
            />
            <Stack.Screen
              name="EditHabit"
              component={EditHabitScreen}
              options={{
                headerShown: true,
                title: "Edit Habit",
              }}
            />
          </>
        ) : (
          // Unauthenticated user
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
