import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 1. Setup the handler to show notifications when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const NotificationService = {
    // 2. Request Permission ONLY
    async requestPermissions() {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        return finalStatus === 'granted';
    },

    // 3. Schedule Local Notification
    async scheduleHabitReminder(habitId, title, body, hour, minute) {
        // Check permission first
        const hasPermission = await this.requestPermissions();
        if (!hasPermission) {
            console.log("Permission not granted for notifications");
            return null;
        }

        // Schedule
        try {
            const identifier = await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    sound: true,
                },
                trigger: {
                    hour,
                    minute,
                    repeats: true, // Repeat daily
                },
            });
            return identifier;
        } catch (e) {
            console.error("Error scheduling notification", e);
            return null;
        }
    },

    // Cancel specific notification
    async cancelNotification(notificationId) {
        if (!notificationId) return;
        try {
            await Notifications.cancelScheduledNotificationAsync(notificationId);
        } catch (e) {
            console.error("Error cancelling notification", e);
        }
    },

    // Cancel all (useful for reset)
    async cancelAll() {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
        } catch (e) {
            console.error(e);
        }
    }
};
