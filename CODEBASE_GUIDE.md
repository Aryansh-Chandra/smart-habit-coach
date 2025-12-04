# Smart Habit Coach - Complete Code Guide for Beginners

## Part 1: React Native Basics

### What is React Native?
React Native is a framework that lets you build mobile apps (Android/iOS) using JavaScript and React. Instead of writing native Java/Kotlin, you write JavaScript that runs on the phone.

### Key Concepts

#### 1. **Components**
A component is a reusable piece of UI. Think of it like a building block.

```javascript
// This is a component - a function that returns UI
function HomeScreen() {
  return (
    <View>
      <Text>Hello World</Text>
    </View>
  );
}
```

#### 2. **State (useState Hook)**
State is data that can change. When state changes, the UI updates automatically.

```javascript
const [count, setCount] = useState(0);
// count = current value (0)
// setCount = function to update count
// useState(0) = initial value is 0

// To update:
setCount(count + 1); // Now count = 1 and UI re-renders
```

#### 3. **Hooks**
Hooks are special functions that let you "hook into" React features. They all start with `use`.

**Common hooks:**
- `useState` - store and update data
- `useEffect` - run code when component loads or data changes
- `useCallback` - optimize functions (prevent unnecessary re-renders)
- `useNavigation` - navigate between screens
- `useRoute` - get parameters from navigation

#### 4. **Props**
Props are arguments passed to a component. They flow from parent to child.

```javascript
// Parent component
<HomeScreen navigation={navigation} />

// HomeScreen component receives navigation as a prop
function HomeScreen({ navigation }) {
  return <Button onPress={() => navigation.navigate('AddHabit')} />;
}
```

#### 5. **Navigation**
Navigation lets you move between screens. Your app uses stack navigation (screen stacking like a deck of cards).

---

## Part 2: Project Structure & File-by-File Breakdown

### Folder Structure
```
smart-habit-coach/
├── App.js                    # Entry point - sets up navigation
├── index.js                  # Registers the app
├── app.json                  # App configuration
├── package.json              # Dependencies
├── src/
│   ├── navigation/
│   │   ├── AppNavigator.js   # Navigation setup
│   │   └── SwipeTabs.js      # Bottom tab bar + floating add button
│   ├── screens/              # Each screen is a component
│   │   ├── HomeScreen.js     # Shows all habits
│   │   ├── AddHabitScreen.js # Form to create new habit
│   │   ├── EditHabitScreen.js# Form to edit habit
│   │   ├── InsightsScreen.js # Shows charts/stats
│   │   └── SettingsScreen.js # App settings
│   ├── storage/
│   │   └── HabitStorage.js   # Database (saves to phone)
│   └── utils/
│       └── NotificationService.js  # Notifications (reminders)
```

---

## Part 3: Code Breakdown by File

### 1. **App.js** - The Entry Point

```javascript
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./src/navigation/AppNavigator";
import { NotificationService } from "./src/utils/NotificationService";

// This is the root component - the top level of your app
export default function App() {
  React.useEffect(() => {
    // Code here runs once when app starts
    // We could request notification permissions here, but we do it when user enables reminders
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* GestureHandlerRootView = enables touch gestures (swiping, tapping) */}
      {/* AppNavigator = the navigation system (screens) */}
      <AppNavigator />
    </GestureHandlerRootView>
  );
}
```

**What it does:** Sets up the app foundation and loads the navigation system.

---

### 2. **src/navigation/AppNavigator.js** - Navigation Setup

```javascript
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditHabitScreen from "../screens/EditHabitScreen";
import SwipeTabs from "./SwipeTabs";
import AddHabitScreen from "../screens/AddHabitScreen";

const Stack = createNativeStackNavigator();
// Stack = a way to organize screens (like a deck of cards)

function MainWrapper(props) {
  // Wrapper that passes navigation to SwipeTabs
  return <SwipeTabs navigation={props.navigation} />;
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      {/* The main navigation system */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* headerShown: false = hide the default header */}
        
        {/* Main screen with tabs and floating button */}
        <Stack.Screen name="Main" component={MainWrapper} />

        {/* Add Habit screen - shown when user taps + button */}
        <Stack.Screen
          name="AddHabit"
          component={AddHabitScreen}
          options={{ headerShown: true, title: "Add Habit" }}
        />

        {/* Edit Habit screen - shown when user taps a habit */}
        <Stack.Screen
          name="EditHabit"
          component={EditHabitScreen}
          options={{ headerShown: true, title: "Edit Habit" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**What it does:** Defines all screens and how to navigate between them.

---

### 3. **src/navigation/SwipeTabs.js** - Bottom Tabs + Floating Button

```javascript
import { TabView } from "react-native-tab-view";
import HomeScreen from "../screens/HomeScreen";
import InsightsScreen from "../screens/InsightsScreen";
import SettingsScreen from "../screens/SettingsScreen";

export default function SwipeTabs({ navigation }) {
  const [index, setIndex] = useState(0);
  // index = which tab is active (0=Home, 1=Insights, 2=Settings)

  const renderScene = ({ route }) => {
    // renderScene = which component to show based on which tab
    switch (route.key) {
      case "home":
        return <HomeScreen navigation={navigation} />;
      case "insights":
        return <InsightsScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return null;
    }
  };

  const bottomTabs = [
    { key: "home", label: "Home", icon: require("../../assets/icons/home.png") },
    { key: "insights", label: "Insights", icon: require("../../assets/icons/insights.png") },
    { key: "settings", label: "Settings", icon: require("../../assets/icons/settings.png") },
  ];
  // This array defines the 3 bottom tabs

  return (
    <View style={{ flex: 1 }}>
      {/* TabView = swipeable tabs */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        // When user swipes or taps a tab, setIndex updates which tab is active
      />

      {/* FLOATING ADD BUTTON - only shows on Home tab */}
      {index === 0 && (
        <TouchableOpacity
          onPress={() => navigation.navigate("AddHabit")}
          style={{
            position: "absolute",  // Position at bottom-right
            bottom: 90,
            right: 25,
            backgroundColor: "#007bff",
            width: 65,
            height: 65,
            borderRadius: 40,  // Makes it circular
          }}
        >
          <Text style={{ color: "white", fontSize: 35 }}>+</Text>
        </TouchableOpacity>
      )}

      {/* CUSTOM BOTTOM TAB BAR */}
      <View style={{ height: 65, backgroundColor: "#fff" }}>
        {bottomTabs.map((tab, i) => {
          const focused = index === i;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setIndex(i)}  // When tapped, switch to this tab
            >
              <Image source={tab.icon} />
              <Text>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
```

**What it does:** Creates 3 swipeable tabs at the bottom and a floating "+" button.

---

### 4. **src/screens/HomeScreen.js** - Shows All Habits

```javascript
import { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { HabitStorage } from '../storage/HabitStorage';

export default function HomeScreen() {
  const navigation = useNavigation();
  // navigation = object with functions like navigate(), goBack()
  
  const [habits, setHabits] = useState([]);
  // habits = array of all habit objects
  
  const [today, setToday] = useState(new Date().toISOString().split('T')[0]);
  // today = today's date in YYYY-MM-DD format (e.g., "2025-12-04")

  const loadHabits = useCallback(async () => {
    // useCallback = optimize this function so it doesn't re-create every render
    // async = this function uses await (waits for promises)
    
    const loadedHabits = await HabitStorage.getHabits();
    // Get all habits from storage (phone database)
    
    setHabits(loadedHabits);
    // Update state, which triggers UI re-render
  }, []);

  useFocusEffect(
    useCallback(() => {
      // useFocusEffect = runs when this screen comes into focus (user navigates here)
      loadHabits();
      setToday(new Date().toISOString().split('T')[0]);
      // Update today's date (in case it's a new day)
    }, [loadHabits])
  );

  const toggleCompletion = async (habit) => {
    // When user taps checkbox, toggle habit completion for today
    try {
      if (habit.completedDates.includes(today)) {
        // If habit already done today, mark as incomplete
        await HabitStorage.unmarkHabitCompleted(habit.id, today);
      } else {
        // If habit not done today, mark as complete
        await HabitStorage.markHabitCompleted(habit.id, today);
      }
      loadHabits();
      // Reload UI to show updated checkbox
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update habit status.");
    }
  };

  const renderItem = ({ item }) => {
    // item = one habit object
    const isCompleted = item.completedDates.includes(today);
    // Check if this habit is completed today

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('EditHabit', { habitId: item.id })}
        // When user taps habit card, go to edit screen and pass habit ID
      >
        <View>
          <Text>{item.name}</Text>
          {item.description && <Text>{item.description}</Text>}
          <Text>{item.streak} day streak</Text>

          <TouchableOpacity onPress={() => toggleCompletion(item)}>
            <Icon
              name={isCompleted ? "checkbox" : "square-outline"}
              // Show filled or empty checkbox based on completion
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Text>My Habits</Text>
      <FlatList
        data={habits}
        // FlatList = efficient list that only renders visible items
        renderItem={renderItem}
        // For each habit, call renderItem to create UI
        keyExtractor={item => item.id}
        // Each item needs unique key for React to track it
      />
    </View>
  );
}
```

**What it does:** Displays all habits, shows checkboxes, handles checkbox taps, navigates to edit screen.

---

### 5. **src/screens/AddHabitScreen.js** - Create New Habit

```javascript
import { Formik } from 'formik';
import * as Yup from 'yup';

const HabitSchema = Yup.object().shape({
  // Yup = validation library
  // Define what data is valid
  name: Yup.string()
    .min(2, 'Too Short!')  // Name must be at least 2 characters
    .required('Required'),
  description: Yup.string().max(100, 'Too Long!'),
  reminderEnabled: Yup.boolean(),
  reminderTime: Yup.string().when('reminderEnabled', {
    // .when() = conditional validation
    is: true,
    // If reminderEnabled is true...
    then: (schema) => schema.required('Reminder time is required'),
    // ...then reminderTime is required
  }),
});

export default function AddHabitScreen() {
  const navigation = useNavigation();

  const handleSave = async (values) => {
    // values = form data from Formik
    // { name: "Drink Water", description: "...", reminderEnabled: true, reminderTime: "09:00" }
    try {
      const habit = await HabitStorage.saveHabit({
        name: values.name,
        description: values.description,
        reminderEnabled: values.reminderEnabled,
        reminderTime: values.reminderTime,
      });
      // Save to phone storage

      if (values.reminderEnabled && values.reminderTime) {
        // If user enabled reminder
        const [hours, minutes] = values.reminderTime.split(':').map(Number);
        // Split "09:00" into [9, 0]
        
        const notificationId = await NotificationService.scheduleHabitReminder(
          habit.id,
          `Time for ${habit.name}!`,
          habit.description || "Keep up the streak!",
          hours,
          minutes
        );
        // Schedule daily notification at that time

        if (notificationId) {
          await HabitStorage.updateHabit({ ...habit, notificationId });
          // Save notification ID so we can cancel it later
        }
      }

      Alert.alert("Success", "Habit created successfully!");
      navigation.goBack();
      // Go back to home screen
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save habit.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>New Habit</Text>

      <Formik
        initialValues={{ 
          name: '', 
          description: '', 
          reminderEnabled: false, 
          reminderTime: '09:00' 
        }}
        // initialValues = default form values
        validationSchema={HabitSchema}
        // Use the Yup schema above to validate
        onSubmit={handleSave}
        // When "Create Habit" button pressed, call handleSave
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          // Formik provides these functions:
          // handleChange = update field when user types
          // handleBlur = called when user leaves field
          // handleSubmit = called when form submitted
          // values = current form values
          // errors = validation errors
          // touched = which fields user has edited
          // setFieldValue = programmatically set field value
          <View>
            <Text>Habit Name</Text>
            <TextInput
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder="e.g., Drink Water"
            />
            {errors.name && touched.name ? (
              <Text style={styles.error}>{errors.name}</Text>
            ) : null}
            {/* Show error only if field has error AND user has touched it */}

            {/* Similar for other fields... */}

            <Switch
              onValueChange={(value) => setFieldValue('reminderEnabled', value)}
              value={values.reminderEnabled}
              // Toggle switch for reminders
            />

            {values.reminderEnabled && (
              // Only show time picker if reminder is enabled
              <TextInput
                onChangeText={handleChange('reminderTime')}
                value={values.reminderTime}
                placeholder="09:00"
              />
            )}

            <TouchableOpacity onPress={handleSubmit}>
              <Text>Create Habit</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}
```

**What it does:** Form to create a new habit with validation, optional reminder, and saves to storage.

---

### 6. **src/screens/EditHabitScreen.js** - Edit Existing Habit

```javascript
export default function EditHabitScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { habitId } = route.params;
  // route.params = data passed during navigation
  // habitId = the ID of habit to edit

  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHabit();
  }, []);
  // useEffect with empty dependency array = runs once on component mount

  const loadHabit = async () => {
    const habits = await HabitStorage.getHabits();
    const found = habits.find(h => h.id === habitId);
    // Find this specific habit by ID
    
    if (found) {
      setHabit(found);
    } else {
      Alert.alert("Error", "Habit not found");
      navigation.goBack();
    }
    setLoading(false);
  };

  const handleSave = async (values) => {
    try {
      // Cancel old notification if it exists
      if (habit.notificationId) {
        await NotificationService.cancelNotification(habit.notificationId);
      }

      let notificationId = null;
      if (values.reminderEnabled && values.reminderTime) {
        const [hours, minutes] = values.reminderTime.split(':').map(Number);
        notificationId = await NotificationService.scheduleHabitReminder(
          habit.id,
          `Time for ${values.name}!`,
          values.description || "Keep up the streak!",
          hours,
          minutes
        );
      }

      await HabitStorage.updateHabit({
        id: habitId,
        name: values.name,
        description: values.description,
        reminderEnabled: values.reminderEnabled,
        reminderTime: values.reminderTime,
        notificationId: notificationId
      });

      Alert.alert("Success", "Habit updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update habit.");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Habit",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (habit.notificationId) {
                await NotificationService.cancelNotification(habit.notificationId);
              }
              await HabitStorage.deleteHabit(habitId);
              Alert.alert("Success", "Habit deleted successfully!");
              navigation.navigate('Home');
              // Navigate to Home instead of goBack
            } catch (error) {
              console.error("Error deleting habit:", error);
              Alert.alert("Error", "Failed to delete habit.");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <Formik
      initialValues={{
        name: habit.name,
        description: habit.description || '',
        reminderEnabled: habit.reminderEnabled || false,
        reminderTime: habit.reminderTime || '09:00'
      }}
      validationSchema={HabitSchema}
      onSubmit={handleSave}
    >
      {/* Form fields - same as AddHabitScreen */}
      {/* Plus save and delete buttons */}
    </Formik>
  );
}
```

**What it does:** Load habit data, show form to edit it, handle save/delete.

---

### 7. **src/storage/HabitStorage.js** - Phone Database

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
// AsyncStorage = simple key-value storage on the phone

const HABITS_KEY = '@habits';
// Key where habits are stored

export const HabitStorage = {
  // All database functions

  async getHabits() {
    // Get all habits from phone storage
    try {
      const jsonValue = await AsyncStorage.getItem(HABITS_KEY);
      // Get stored JSON string
      
      return jsonValue != null ? JSON.parse(jsonValue) : [];
      // Parse JSON back to array, or return empty array if none exist
    } catch (e) {
      console.error("Error reading habits", e);
      return [];
    }
  },

  async saveHabit(habit) {
    // Create new habit
    try {
      const habits = await this.getHabits();
      // Get existing habits
      
      const newHabit = {
        id: generateId(),
        // Generate unique ID (using timestamp + random)
        createdAt: new Date().toISOString(),
        streak: 0,
        completedDates: [],
        // Array to store dates when habit was completed
        // Example: ["2025-12-04", "2025-12-03"]
        ...habit,
        // Spread other properties (name, description, etc.)
      };
      
      const updatedHabits = [...habits, newHabit];
      // Add new habit to array
      
      await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
      // Save back to storage as JSON
      
      return newHabit;
    } catch (e) {
      console.error("Error saving habit", e);
      throw e;
    }
  },

  async updateHabit(updatedHabit) {
    // Update existing habit
    try {
      const habits = await this.getHabits();
      const index = habits.findIndex(h => h.id === updatedHabit.id);
      // Find position of habit to update
      
      if (index !== -1) {
        habits[index] = { ...habits[index], ...updatedHabit };
        // Merge old and new data
        
        await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
        return habits[index];
      }
      return null;
    } catch (e) {
      console.error("Error updating habit", e);
      throw e;
    }
  },

  async deleteHabit(habitId) {
    // Delete a habit
    try {
      const habits = await this.getHabits();
      const updatedHabits = habits.filter(h => h.id !== habitId);
      // Keep all habits EXCEPT the one with matching ID
      
      await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
    } catch (e) {
      console.error("Error deleting habit", e);
      throw e;
    }
  },

  async markHabitCompleted(habitId, dateString) {
    // Mark habit as completed for a specific date
    try {
      const habits = await this.getHabits();
      const index = habits.findIndex(h => h.id === habitId);
      
      if (index !== -1) {
        const habit = habits[index];
        
        if (!habit.completedDates.includes(dateString)) {
          // Avoid duplicates
          habit.completedDates.push(dateString);
          habit.completedDates.sort();
          // Add date and keep sorted
          
          habit.streak = this.calculateStreak(habit.completedDates);
          // Recalculate streak
          
          habits[index] = habit;
          await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
        }
        return habit;
      }
    } catch (e) {
      console.error("Error marking habit completed", e);
      throw e;
    }
  },

  async unmarkHabitCompleted(habitId, dateString) {
    // Mark habit as NOT completed for a specific date
    try {
      const habits = await this.getHabits();
      const index = habits.findIndex(h => h.id === habitId);
      
      if (index !== -1) {
        const habit = habits[index];
        habit.completedDates = habit.completedDates.filter(d => d !== dateString);
        // Remove this date from completed dates
        
        habit.streak = this.calculateStreak(habit.completedDates);
        // Recalculate streak
        
        habits[index] = habit;
        await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
        return habit;
      }
    } catch (e) {
      console.error("Error unmarking habit", e);
      throw e;
    }
  },

  calculateStreak(completedDates) {
    // Calculate how many consecutive days habit was done
    if (!completedDates || completedDates.length === 0) return 0;
    // No dates = no streak

    const sortedDates = [...completedDates].sort((a, b) => new Date(b) - new Date(a));
    // Sort dates descending (newest first)

    let streak = 0;
    let currentDate = new Date();
    let checkDateStr = currentDate.toISOString().split('T')[0];
    // Today's date

    if (!sortedDates.includes(checkDateStr)) {
      // If today not completed, check yesterday
      currentDate.setDate(currentDate.getDate() - 1);
      checkDateStr = currentDate.toISOString().split('T')[0];
      
      if (!sortedDates.includes(checkDateStr)) {
        // If yesterday also not completed, streak is broken
        return 0;
      }
    }

    // Count backwards from today/yesterday
    streak = 1;
    while (true) {
      currentDate.setDate(currentDate.getDate() - 1);
      checkDateStr = currentDate.toISOString().split('T')[0];
      
      if (sortedDates.includes(checkDateStr)) {
        streak++;
        // Found another consecutive day
      } else {
        break;
        // Streak broken
      }
    }
    
    return streak;
  }
};
```

**What it does:** Saves, loads, updates, deletes habits from phone storage. Calculates streaks.

---

### 8. **src/utils/NotificationService.js** - Reminders

```javascript
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  // Configure how notifications behave
  handleNotification: async () => ({
    shouldShowAlert: true,  // Show notification popup
    shouldPlaySound: true,  // Play sound
    shouldSetBadge: false,  // Don't show badge number
  }),
});

export const NotificationService = {
  async requestPermissions() {
    // Ask user "Can we send you notifications?"
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        // Create notification channel (Android requirement)
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        // Vibration pattern
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      // Ask user permission
      finalStatus = status;
    }

    return finalStatus === 'granted';
  },

  async scheduleHabitReminder(habitId, title, body, hour, minute) {
    // Schedule a daily notification
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      console.log("Permission not granted for notifications");
      return null;
    }

    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,  // "Time for Drink Water!"
          body,   // "Keep up the streak!"
          sound: true,
        },
        trigger: {
          hour,   // 9
          minute, // 0
          repeats: true,  // EVERY DAY at this time
        },
      });
      // Returns a notification ID
      return identifier;
    } catch (e) {
      console.error("Error scheduling notification", e);
      return null;
    }
  },

  async cancelNotification(notificationId) {
    // Cancel a specific notification
    if (!notificationId) return;
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      // Stop the scheduled notification
    } catch (e) {
      console.error("Error cancelling notification", e);
    }
  },

  async cancelAll() {
    // Cancel all notifications
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (e) {
      console.error(e);
    }
  }
};
```

**What it does:** Schedule and cancel daily reminders for habits.

---

## Part 4: How Data Flows Through the App

### Example: Creating a Habit

1. **User taps "+"** → `SwipeTabs.js` navigates to `AddHabitScreen`
2. **User fills form** → Formik stores values (name, description, reminder time)
3. **User taps "Create Habit"** → `handleSave` called
4. **Save to storage** → `HabitStorage.saveHabit()` saves to phone
5. **Schedule notification** → `NotificationService.scheduleHabitReminder()` sets up daily reminder
6. **Navigate home** → `navigation.goBack()` returns to `HomeScreen`
7. **Reload habits** → `useFocusEffect` calls `loadHabits()` when HomeScreen comes into focus
8. **Display updated list** → FlatList renders all habits including new one

### Example: Checking Off a Habit

1. **User taps checkbox** → `toggleCompletion()` called
2. **Check if done today** → Look in `habit.completedDates` for today's date
3. **Mark completed** → Add today's date to `completedDates`
4. **Calculate streak** → `calculateStreak()` counts consecutive days
5. **Save to storage** → Update habit in phone storage
6. **Reload UI** → `loadHabits()` refreshes list, checkbox shows filled

---

## Part 5: Key Concepts Summary

| Concept | What It Does | Example |
|---------|--------------|---------|
| **Component** | A reusable piece of UI | `HomeScreen`, `AddHabitScreen` |
| **State** | Data that changes and triggers re-render | `const [habits, setHabits] = useState([])` |
| **Props** | Data passed from parent to child | `<HomeScreen navigation={navigation} />` |
| **Hook** | Function that lets you use React features | `useState`, `useEffect`, `useCallback` |
| **Navigation** | Moving between screens | `navigation.navigate('AddHabit')` |
| **AsyncStorage** | Save data on phone | `AsyncStorage.setItem('key', JSON.stringify(data))` |
| **Formik** | Form validation and handling | Manages form state and validation |
| **useEffect** | Run code at specific times | `useEffect(() => {...}, [])` runs once on mount |
| **useCallback** | Optimize functions | Prevent unnecessary re-creation |
| **FlatList** | Efficient list rendering | Only renders visible items |

---

## Part 6: Common React Native Components

```javascript
// View - container (like div)
<View style={{ padding: 10 }}>...</View>

// Text - for displaying text
<Text>Hello</Text>

// TextInput - input field
<TextInput placeholder="Enter text" />

// TouchableOpacity - button (tappable)
<TouchableOpacity onPress={() => ...}>
  <Text>Tap me</Text>
</TouchableOpacity>

// Switch - toggle on/off
<Switch value={isOn} onValueChange={setIsOn} />

// FlatList - efficient list
<FlatList data={items} renderItem={renderItem} keyExtractor={item => item.id} />

// ScrollView - scrollable container
<ScrollView>...</ScrollView>

// Alert - popup
Alert.alert("Title", "Message", [{ text: "OK" }])

// Image - display image
<Image source={require('./icon.png')} />
```

---

## You Now Know:
✅ What React Native is
✅ How hooks work (useState, useEffect, useCallback)
✅ How navigation works
✅ How data flows through the app
✅ What each file does
✅ How to read any function in the codebase

**Next step:** Pick any screen and try to understand what it does by re-reading this guide!
