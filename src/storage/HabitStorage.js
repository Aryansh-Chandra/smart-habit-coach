import AsyncStorage from '@react-native-async-storage/async-storage';

// Generate a simple unique ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Get user-specific storage key
const getHabitsKey = (userId) => `@habits_${userId}`;
const getLogsKey = (userId) => `@habit_logs_${userId}`;

export const HabitStorage = {
  // --- Habits CRUD ---

  async getHabits(userId) {
    if (!userId) {
      console.warn("HabitStorage.getHabits called without userId");
      return [];
    }
    try {
      const key = getHabitsKey(userId);
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("Error reading habits", e);
      return [];
    }
  },

  async saveHabit(userId, habit) {
    if (!userId) throw new Error("userId is required");
    try {
      const habits = await this.getHabits(userId);
      const newHabit = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        streak: 0,
        completedDates: [], // Array of ISO date strings (YYYY-MM-DD)
        category: 'daily', // Default to daily
        reminderWeekday: null, // For weekly reminders: 1=Sun .. 7=Sat
        ...habit,
      };
      const updatedHabits = [...habits, newHabit];
      const key = getHabitsKey(userId);
      await AsyncStorage.setItem(key, JSON.stringify(updatedHabits));
      return newHabit;
    } catch (e) {
      console.error("Error saving habit", e);
      throw e;
    }
  },

  async updateHabit(userId, updatedHabit) {
    if (!userId) throw new Error("userId is required");
    try {
      const habits = await this.getHabits(userId);
      const index = habits.findIndex(h => h.id === updatedHabit.id);
      if (index !== -1) {
        habits[index] = { ...habits[index], ...updatedHabit };
        const key = getHabitsKey(userId);
        await AsyncStorage.setItem(key, JSON.stringify(habits));
        return habits[index];
      }
      return null;
    } catch (e) {
      console.error("Error updating habit", e);
      throw e;
    }
  },

  async deleteHabit(userId, habitId) {
    if (!userId) throw new Error("userId is required");
    try {
      const habits = await this.getHabits(userId);
      const updatedHabits = habits.filter(h => h.id !== habitId);
      const key = getHabitsKey(userId);
      await AsyncStorage.setItem(key, JSON.stringify(updatedHabits));
    } catch (e) {
      console.error("Error deleting habit", e);
      throw e;
    }
  },

  // --- Logic & Logs ---

  async markHabitCompleted(userId, habitId, dateString) {
    // dateString should be YYYY-MM-DD
    if (!userId) throw new Error("userId is required");
    try {
      const habits = await this.getHabits(userId);
      const index = habits.findIndex(h => h.id === habitId);
      
      if (index !== -1) {
        const habit = habits[index];
        
        // Avoid duplicates
        if (!habit.completedDates.includes(dateString)) {
          habit.completedDates.push(dateString);
          habit.completedDates.sort(); // Keep sorted
          
          // Recalculate streak
          habit.streak = this.calculateStreak(habit.completedDates);
          
          habits[index] = habit;
          const key = getHabitsKey(userId);
          await AsyncStorage.setItem(key, JSON.stringify(habits));
          
          // Also save to a separate log if needed for easier analytics, 
          // but keeping it in the habit object is simpler for this scale.
          await this.logCompletion(userId, habitId, dateString);
        }
        return habit;
      }
    } catch (e) {
      console.error("Error marking habit completed", e);
      throw e;
    }
  },

  async unmarkHabitCompleted(userId, habitId, dateString) {
      if (!userId) throw new Error("userId is required");
      try {
        const habits = await this.getHabits(userId);
        const index = habits.findIndex(h => h.id === habitId);
        
        if (index !== -1) {
          const habit = habits[index];
          habit.completedDates = habit.completedDates.filter(d => d !== dateString);
          
          // Recalculate streak
          habit.streak = this.calculateStreak(habit.completedDates);
          
          habits[index] = habit;
          const key = getHabitsKey(userId);
          await AsyncStorage.setItem(key, JSON.stringify(habits));
          return habit;
        }
      } catch (e) {
        console.error("Error unmarking habit", e);
        throw e;
      }
  },

  calculateStreak(completedDates) {
    if (!completedDates || completedDates.length === 0) return 0;

    // Sort dates descending
    const sortedDates = [...completedDates].sort((a, b) => new Date(b) - new Date(a));
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if the most recent completion is today or yesterday
    // If the last completion was before yesterday, streak is broken (unless we want to be lenient)
    // Actually, for a simple streak, we just count backwards from the latest consecutive chain.
    
    // However, usually "current streak" implies it's active. 
    // If I missed yesterday and today, streak is 0.
    // If I did yesterday but not today, streak is still valid (pending today).
    
    let currentDate = new Date();
    // Normalize to YYYY-MM-DD
    let checkDateStr = currentDate.toISOString().split('T')[0];
    
    // If today is not in the list, check if yesterday is.
    if (!sortedDates.includes(checkDateStr)) {
        currentDate.setDate(currentDate.getDate() - 1);
        checkDateStr = currentDate.toISOString().split('T')[0];
        
        if (!sortedDates.includes(checkDateStr)) {
            return 0; // Streak broken
        }
    }

    // Now count backwards
    // We already know checkDateStr is in sortedDates (either today or yesterday)
    streak = 1;
    
    // Iterate backwards
    while (true) {
        currentDate.setDate(currentDate.getDate() - 1);
        checkDateStr = currentDate.toISOString().split('T')[0];
        
        if (sortedDates.includes(checkDateStr)) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
  },

  async logCompletion(userId, habitId, dateString) {
      // Optional: Store a flat log for easier aggregate queries later
      if (!userId) throw new Error("userId is required");
      try {
          const logEntry = { habitId, date: dateString, timestamp: Date.now() };
          const key = getLogsKey(userId);
          const existingLogs = await AsyncStorage.getItem(key);
          const logs = existingLogs ? JSON.parse(existingLogs) : [];
          logs.push(logEntry);
          await AsyncStorage.setItem(key, JSON.stringify(logs));
      } catch (e) {
          console.error("Error logging completion", e);
      }
  },
  
  async getHabitLogs(userId) {
      if (!userId) throw new Error("userId is required");
      try {
          const key = getLogsKey(userId);
          const jsonValue = await AsyncStorage.getItem(key);
          return jsonValue != null ? JSON.parse(jsonValue) : [];
      } catch (e) {
          return [];
      }
  }
};
