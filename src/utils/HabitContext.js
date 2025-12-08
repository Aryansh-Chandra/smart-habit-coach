import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { HabitStorage } from '../storage/HabitStorage';
import { useAuth } from './AuthContext';

const HabitContext = createContext();

export function HabitProvider({ children }) {
    const { user } = useAuth();
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load habits from storage
    const loadHabits = useCallback(async () => {
        if (!user) {
            setHabits([]);
            setLoading(false);
            return;
        }
        try {
            const loadedHabits = await HabitStorage.getHabits(user.uid);
            setHabits(loadedHabits);
        } catch (error) {
            console.error('Error loading habits:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Load habits when user changes
    useEffect(() => {
        loadHabits();
    }, [loadHabits]);

    // Refresh habits - can be called from any screen
    const refreshHabits = useCallback(async () => {
        await loadHabits();
    }, [loadHabits]);

    // Mark habit as completed
    const markHabitCompleted = useCallback(async (habitId, date) => {
        if (!user) return;
        await HabitStorage.markHabitCompleted(user.uid, habitId, date);
        await loadHabits(); // Refresh all data
    }, [user, loadHabits]);

    // Unmark habit as completed
    const unmarkHabitCompleted = useCallback(async (habitId, date) => {
        if (!user) return;
        await HabitStorage.unmarkHabitCompleted(user.uid, habitId, date);
        await loadHabits(); // Refresh all data
    }, [user, loadHabits]);

    // Add new habit
    const addHabit = useCallback(async (habitData) => {
        if (!user) return;
        await HabitStorage.saveHabit(user.uid, habitData);
        await loadHabits(); // Refresh all data
    }, [user, loadHabits]);

    // Update habit
    const updateHabit = useCallback(async (habitData) => {
        if (!user) return;
        await HabitStorage.saveHabit(user.uid, habitData);
        await loadHabits(); // Refresh all data
    }, [user, loadHabits]);

    // Delete habit
    const deleteHabit = useCallback(async (habitId) => {
        if (!user) return;
        await HabitStorage.deleteHabit(user.uid, habitId);
        await loadHabits(); // Refresh all data
    }, [user, loadHabits]);

    const value = {
        habits,
        loading,
        refreshHabits,
        markHabitCompleted,
        unmarkHabitCompleted,
        addHabit,
        updateHabit,
        deleteHabit,
    };

    return (
        <HabitContext.Provider value={value}>
            {children}
        </HabitContext.Provider>
    );
}

export function useHabits() {
    const context = useContext(HabitContext);
    if (!context) {
        throw new Error('useHabits must be used within a HabitProvider');
    }
    return context;
}
