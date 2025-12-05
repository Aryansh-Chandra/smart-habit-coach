import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { HabitStorage } from '../storage/HabitStorage';
import { NotificationService } from '../utils/NotificationService';
import { useAuth } from '../utils/AuthContext';
import { useNavigation } from '@react-navigation/native';

const HabitSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  description: Yup.string()
    .max(100, 'Too Long!'),
  category: Yup.string()
    .required('Select a category'),
  reminderEnabled: Yup.boolean(),
  reminderTime: Yup.string().when('reminderEnabled', {
    is: true,
    then: (schema) => schema.required('Reminder time is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default function AddHabitScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  // Category options with default reminder times
  const categoryOptions = {
    daily: { label: 'Daily Habit', defaultTime: '09:00' },
    weekly: { label: 'Weekly Habit', defaultTime: '10:00' },
  };

  // Helper to parse "HH:MM" string to Date
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
  };

  const handleSave = async (values) => {
    try {
      const habit = await HabitStorage.saveHabit(user.uid, {
        name: values.name,
        description: values.description,
        category: values.category,
        reminderEnabled: values.reminderEnabled,
        reminderTime: values.reminderTime, // Store as string "HH:MM"
        reminderWeekday: values.reminderWeekday || null,
      });

      if (values.reminderEnabled && values.reminderTime) {
        const [hours, minutes] = values.reminderTime.split(':').map(Number);
        const notificationId = await NotificationService.scheduleHabitReminder(
          habit.id,
          `Time for ${habit.name}!`,
          habit.description || "Keep up the streak!",
          hours,
          minutes,
          values.category,
          values.reminderWeekday || null
        );
        if (notificationId) {
          await HabitStorage.updateHabit(user.uid, { ...habit, notificationId });
        }
      }

      Alert.alert("Success", "Habit created successfully!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save habit.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>New Habit</Text>

      <Formik
        initialValues={{ name: '', description: '', category: 'daily', reminderEnabled: false, reminderTime: '09:00', reminderWeekday: 2 }}
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

            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
              {Object.keys(categoryOptions).map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.categoryButton,
                    values.category === key && styles.categoryButtonActive
                  ]}
                  onPress={() => {
                    setFieldValue('category', key);
                    setFieldValue('reminderTime', categoryOptions[key].defaultTime);
                    setFieldValue('reminderWeekday', key === 'weekly' ? 2 : null);
                  }}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    values.category === key && styles.categoryButtonTextActive
                  ]}>
                    {categoryOptions[key].label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.category && touched.category ? (
              <Text style={styles.error}>{errors.category}</Text>
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

                {values.category === 'weekly' && (
                  <View style={styles.dayPickerContainer}>
                    <Text style={[styles.label, { marginBottom: 8 }]}>Choose day</Text>
                    <View style={styles.dayRow}>
                      {[
                        { label: 'Sun', value: 1 },
                        { label: 'Mon', value: 2 },
                        { label: 'Tue', value: 3 },
                        { label: 'Wed', value: 4 },
                        { label: 'Thu', value: 5 },
                        { label: 'Fri', value: 6 },
                        { label: 'Sat', value: 7 },
                      ].map(d => (
                        <TouchableOpacity
                          key={d.value}
                          style={[styles.dayButton, values.reminderWeekday === d.value && styles.dayButtonActive]}
                          onPress={() => setFieldValue('reminderWeekday', d.value)}
                        >
                          <Text style={[styles.dayText, values.reminderWeekday === d.value && styles.dayTextActive]}>{d.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                <Text style={styles.helperText}>
                  {values.category === 'daily' 
                    ? 'You will be reminded daily at this time' 
                    : `You will be reminded every ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][ (values.reminderWeekday||2) -1 ]} at this time`}
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Create Habit</Text>
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
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  categoryButtonActive: {
    borderColor: '#4A90E2',
    backgroundColor: '#E8F0FE',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  categoryButtonTextActive: {
    color: '#4A90E2',
  },
  helperText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
    fontStyle: 'italic',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  dayText: {
    color: '#555',
    fontWeight: '600',
  },
  dayTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
