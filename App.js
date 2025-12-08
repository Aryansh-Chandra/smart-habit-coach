import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/utils/AuthContext";
import { HabitProvider } from "./src/utils/HabitContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <HabitProvider>
          <AppNavigator />
        </HabitProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

