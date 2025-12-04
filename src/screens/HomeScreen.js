import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { HabitStorage } from '../storage/HabitStorage';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [habits, setHabits] = useState([]);
  const [today, setToday] = useState(new Date().toISOString().split('T')[0]);

  const loadHabits = useCallback(async () => {
    const loadedHabits = await HabitStorage.getHabits();
    setHabits(loadedHabits);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHabits();
      setToday(new Date().toISOString().split('T')[0]);
    }, [loadHabits])
  );

  const toggleCompletion = async (habit) => {
    try {
      if (habit.completedDates.includes(today)) {
        await HabitStorage.unmarkHabitCompleted(habit.id, today);
      } else {
        await HabitStorage.markHabitCompleted(habit.id, today);
      }
      loadHabits();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update habit status.");
    }
  };

  const renderItem = ({ item }) => {
    const isCompleted = item.completedDates.includes(today);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('EditHabit', { habitId: item.id })}
      >
        <View style={styles.cardContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.habitName}>{item.name}</Text>
            {item.description ? <Text style={styles.habitDesc}>{item.description}</Text> : null}
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={16} color="#FF9500" />
              <Text style={styles.streakText}>{item.streak} day streak</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => toggleCompletion(item)}>
            <Ionicons
              name={isCompleted ? "checkbox" : "square-outline"}
              size={32}
              color={isCompleted ? "#4CD964" : "#C7C7CC"}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Habits</Text>
        {/* Header add button removed to avoid duplicate; use floating + button instead */}
      </View>

      <FlatList
        data={habits}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No habits yet. Start by adding one!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingTop: 50, // Safe area
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  habitDesc: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 14,
    color: '#FF9500',
    marginLeft: 4,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});
