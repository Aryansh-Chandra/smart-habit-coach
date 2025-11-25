import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import InsightsScreen from "../screens/InsightsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AddHabitScreen from "../screens/AddHabitScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        {/* Bottom Tabs */}
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />

        {/* Add Habit Page */}
        <Stack.Screen
          name="AddHabit"
          component={AddHabitScreen}
          options={{ title: "Add Habit" }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
