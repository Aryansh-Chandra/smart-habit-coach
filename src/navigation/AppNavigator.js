import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditHabitScreen from "../screens/EditHabitScreen";
import SwipeTabs from "../navigation/SwipeTabs";
import AddHabitScreen from "../screens/AddHabitScreen";

const Stack = createNativeStackNavigator();

function MainWrapper(props) {
  // Pass navigation manually to SwipeTabs
  return <SwipeTabs navigation={props.navigation} />;
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
