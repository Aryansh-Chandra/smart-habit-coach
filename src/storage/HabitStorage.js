import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = '@habits';
const HABIT_LOGS_KEY = '@habit_logs';

// Generate a simple unique ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const HabitStorage = {
  // --- Habits CRUD ---

  async getHabits() {
    try {
      const jsonValue = await AsyncStorage.getItem(HABITS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("Error reading habits", e);
      return [];
    }
  },

  async saveHabit(habit) {
    try {
      const habits = await this.getHabits();
      const newHabit = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        streak: 0,
        completedDates: [], // Array of ISO date strings (YYYY-MM-DD)
        ...habit,
      };
      const updatedHabits = [...habits, newHabit];
      await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
      return newHabit;
    } catch (e) {
      console.error("Error saving habit", e);
      throw e;
    }
  },

  async updateHabit(updatedHabit) {
    try {
      const habits = await this.getHabits();
      const index = habits.findIndex(h => h.id === updatedHabit.id);
      if (index !== -1) {
        habits[index] = { ...habits[index], ...updatedHabit };
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
    try {
      const habits = await this.getHabits();
      const updatedHabits = habits.filter(h => h.id !== habitId);
      await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
    } catch (e) {
      console.error("Error deleting habit", e);
      throw e;
    }
  },

  // --- Logic & Logs ---

  async markHabitCompleted(habitId, dateString) {
    // dateString should be YYYY-MM-DD
    try {
      const habits = await this.getHabits();
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
          await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
          
          // Also save to a separate log if needed for easier analytics, 
          // but keeping it in the habit object is simpler for this scale.
          await this.logCompletion(habitId, dateString);
        }
        return habit;
      }
    } catch (e) {
      console.error("Error marking habit completed", e);
      throw e;
    }
  },

  async unmarkHabitCompleted(habitId, dateString) {
      try {
        const habits = await this.getHabits();
        const index = habits.findIndex(h => h.id === habitId);
        
        if (index !== -1) {
          const habit = habits[index];
          habit.completedDates = habit.completedDates.filter(d => d !== dateString);
          
          // Recalculate streak
          habit.streak = this.calculateStreak(habit.completedDates);
          
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

  async logCompletion(habitId, dateString) {
      // Optional: Store a flat log for easier aggregate queries later
      try {
          const logEntry = { habitId, date: dateString, timestamp: Date.now() };
          const existingLogs = await AsyncStorage.getItem(HABIT_LOGS_KEY);
          const logs = existingLogs ? JSON.parse(existingLogs) : [];
          logs.push(logEntry);
          await AsyncStorage.setItem(HABIT_LOGS_KEY, JSON.stringify(logs));
      } catch (e) {
          console.error("Error logging completion", e);
      }
  },
  
  async getHabitLogs() {
      try {
          const jsonValue = await AsyncStorage.getItem(HABIT_LOGS_KEY);
          return jsonValue != null ? JSON.parse(jsonValue) : [];
      } catch (e) {
          return [];
      }
  }
};
