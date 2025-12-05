import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { HabitStorage } from '../storage/HabitStorage';
import { useAuth } from '../utils/AuthContext';
import { BarChart, ContributionGraph } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

const MOTIVATIONAL_QUOTES = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "The future depends on what you do today. - Mahatma Gandhi",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "Success is not final, failure is not fatal. - Winston Churchill",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The only impossible journey is the one you never begin. - Tony Robbins",
  "Great things never come from comfort zones. - Unknown",
  "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill",
  "You miss 100% of the shots you don't take. - Wayne Gretzky",
  "Start where you are, use what you have, do what you can. - Arthur Ashe",
  "The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb",
  "Don't be afraid to give up the good to go for the great. - John D. Rockefeller",
  "I am not afraid of storms, for I am learning how to sail my ship. - Louisa May Alcott",
  "One step at a time is good walking. - Chinese Proverb",
];

export default function InsightsScreen() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [completionData, setCompletionData] = useState([]);
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);
  const [weeklyData, setWeeklyData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
  });

  const loadData = useCallback(async () => {
    if (!user) return;
    const loadedHabits = await HabitStorage.getHabits(user.uid);
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

  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadData();
      // Pick a random quote when the tab is focused
      const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
      setQuote(randomQuote);
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
    <ScrollView 
      style={styles.container}
      scrollEnabled={true}
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.title}>Insights</Text>

      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>"{quote}"</Text>
      </View>

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
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  quoteCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#333',
    lineHeight: 24,
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
    marginBottom: 50,
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
