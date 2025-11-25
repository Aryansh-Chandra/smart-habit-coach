import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddHabitScreen({ navigation }) {
  const [habit, setHabit] = useState("");

  const saveHabit = async () => {
    if (!habit.trim()) {
      Alert.alert("Error", "Please enter a habit name.");
      return;
    }

    const newHabit = {
      id: Date.now().toString(),  // UNIQUE ID
      name: habit,
      createdAt: new Date().toISOString(),
      streak: 0,
    };

    const stored = await AsyncStorage.getItem("habits");
    const habits = stored ? JSON.parse(stored) : [];

    habits.push(newHabit);
    await AsyncStorage.setItem("habits", JSON.stringify(habits));

    Alert.alert("Success", "Habit added!");
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: "700", marginBottom: 20 }}>
        Add a New Habit
      </Text>

      <TextInput
        placeholder="Enter habit name"
        value={habit}
        onChangeText={setHabit}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 8,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={saveHabit}
        style={{
          backgroundColor: "#007bff",
          padding: 15,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Save Habit</Text>
      </TouchableOpacity>
    </View>
  );
}
