import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { HabitStorage } from '../storage/HabitStorage';
import { NotificationService } from '../utils/NotificationService';
import { useNavigation, useRoute } from '@react-navigation/native';

const HabitSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  description: Yup.string()
    .max(100, 'Too Long!'),
  reminderEnabled: Yup.boolean(),
  reminderTime: Yup.string().when('reminderEnabled', {
    is: true,
    then: (schema) => schema.required('Reminder time is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default function EditHabitScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { habitId } = route.params;
  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHabit();
  }, []);

  const loadHabit = async () => {
    const habits = await HabitStorage.getHabits();
    const found = habits.find(h => h.id === habitId);
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
      "Are you sure you want to delete this habit?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive", onPress: async () => {
            try {
              if (habit.notificationId) {
                await NotificationService.cancelNotification(habit.notificationId);
              }
              await HabitStorage.deleteHabit(habitId);
              Alert.alert("Success", "Habit deleted successfully!");
              navigation.navigate('Main');
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
    return <ActivityIndicator size="large" color="#4A90E2" style={{ flex: 1 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Habit</Text>

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
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View>
            <Text style={styles.label}>Habit Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder="e.g., Drink Water"
              placeholderTextColor="#999"
            />
            {errors.name && touched.name ? (
              <Text style={styles.error}>{errors.name}</Text>
            ) : null}

            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
              placeholder="e.g., 8 glasses a day"
              placeholderTextColor="#999"
            />
            {errors.description && touched.description ? (
              <Text style={styles.error}>{errors.description}</Text>
            ) : null}

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Enable Reminder</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={values.reminderEnabled ? "#f5dd4b" : "#f4f3f4"}
                onValueChange={(value) => setFieldValue('reminderEnabled', value)}
                value={values.reminderEnabled}
              />
            </View>

            {values.reminderEnabled && (
              <View>
                <Text style={styles.label}>Reminder Time (HH:MM 24h)</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('reminderTime')}
                  onBlur={handleBlur('reminderTime')}
                  value={values.reminderTime}
                  placeholder="09:00"
                  keyboardType="numbers-and-punctuation"
                  placeholderTextColor="#999"
                />
                {errors.reminderTime && touched.reminderTime ? (
                  <Text style={styles.error}>{errors.reminderTime}</Text>
                ) : null}
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
              <Text style={styles.buttonText}>Delete Habit</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
