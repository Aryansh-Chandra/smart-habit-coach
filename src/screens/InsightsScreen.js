import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { HabitStorage } from '../storage/HabitStorage';
import { BarChart, ContributionGraph } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

export default function InsightsScreen() {
  const [habits, setHabits] = useState([]);
  const [completionData, setCompletionData] = useState([]);
  const [weeklyData, setWeeklyData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
  });

  const loadData = useCallback(async () => {
    const loadedHabits = await HabitStorage.getHabits();
    setHabits(loadedHabits);

    // Process data for Contribution Graph (Heatmap)
    const commits = [];
    loadedHabits.forEach(habit => {
      habit.completedDates.forEach(date => {
        // Check if date already exists in commits
        const existing = commits.find(c => c.date === date);
        if (existing) {
          existing.count += 1;
        } else {
          commits.push({ date: date, count: 1 });
        }
      });
    });
    setCompletionData(commits);

    // Process data for Weekly Bar Chart
    // Get last 7 days
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const last7Days = [];
    const dataPoints = [];
    const labels = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = days[d.getDay()];

      labels.push(dayName);

      // Count completions for this day
      let count = 0;
      loadedHabits.forEach(habit => {
        if (habit.completedDates.includes(dateStr)) {
          count++;
        }
      });
      dataPoints.push(count);
    }

    setWeeklyData({
      labels: labels,
      datasets: [{ data: dataPoints }]
    });

  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Insights</Text>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Performance</Text>
        <BarChart
          data={weeklyData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          fromZero={true}
          showBarTops={false}
          showValuesOnTopOfBars={true}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Consistency Heatmap</Text>
        <Text style={styles.subTitle}>Total completions per day</Text>
        <ContributionGraph
          values={completionData}
          endDate={new Date()}
          numDays={90}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{habits.length}</Text>
          <Text style={styles.statLabel}>Active Habits</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {habits.reduce((acc, curr) => acc + curr.streak, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Streak Days</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  subTitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 5,
  },
});
