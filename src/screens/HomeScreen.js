import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [habits, setHabits] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadHabits = async () => {
        const stored = await AsyncStorage.getItem("habits");
        if (stored) setHabits(JSON.parse(stored));
      };
      loadHabits();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Habits</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {habits.length > 0 ? (
          habits.map(item => (
            <Text key={item.id} style={styles.habitItem}>
              {item.name}
            </Text>
          ))
        ) : (
          <Text style={styles.empty}>No habits added yet.</Text>
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate("AddHabit")}
        style={styles.fab}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },
  habitItem: {
    fontSize: 20,
    marginBottom: 12,
  },
  empty: {
    fontSize: 18,
    color: "#999",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007bff", // SAME AS SAVE HABIT
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  fabText: {
    color: "#fff",
    fontSize: 32,
    marginTop: -4,
  },
});
