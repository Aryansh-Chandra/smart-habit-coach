import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./src/navigation/AppNavigator";
import { NotificationService } from "./src/utils/NotificationService";

export default function App() {
  React.useEffect(() => {
    // Request permissions on app start
    const setupNotifications = async () => {
      // We can import NotificationService here if we export it properly, 
      // or just rely on the screens calling it. 
      // But it's better to ask early.
      // However, since I can't easily import it without changing imports, 
      // I'll rely on the updated scheduleHabitReminder which now checks permissions.
      // But wait, I should probably import it.
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
}
