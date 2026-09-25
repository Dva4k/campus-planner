import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';

import TaskCard from '../src/components/TaskCard';
import { useTasks } from '../src/context/TaskContext';
import { useTheme } from '../src/context/ThemeContext';

type TaskFilter = 'all' | 'active' | 'completed';

export default function App() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [filter, setFilter] = useState<TaskFilter>('all');

  const { tasks, toggleTask, deleteTask } = useTasks();

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.isCompleted
  ).length;

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') {
      return !task.isCompleted;
    }

    if (filter === 'completed') {
      return task.isCompleted;
    }

    return true;
  });

  return (
    <View
      style={[
        styles.container,
        isDark && styles.darkContainer,
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text
            style={[
              styles.title,
              isDark && styles.darkText,
            ]}
          >
            Campus Planner
          </Text>

          <Text
            style={[
              styles.subtitle,
              isDark && styles.darkSecondaryText,
            ]}
          >
            Учебные задачи
          </Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            onPress={() => router.push('/settings')}
            style={styles.settingsButton}
          >
            <Text style={styles.settingsButtonText}>⚙</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/task/new')}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.stats}>
        <View
          style={[
            styles.statCard,
            isDark && styles.darkCard,
          ]}
        >
          <Text
            style={[
              styles.statNumber,
              isDark && styles.darkText,
            ]}
          >
            {totalTasks}
          </Text>

          <Text
            style={[
              styles.statLabel,
              isDark && styles.darkSecondaryText,
            ]}
          >
            Всего
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            isDark && styles.darkCard,
          ]}
        >
          <Text
            style={[
              styles.statNumber,
              isDark && styles.darkText,
            ]}
          >
            {completedTasks}
          </Text>

          <Text
            style={[
              styles.statLabel,
              isDark && styles.darkSecondaryText,
            ]}
          >
            Выполнено
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            isDark && styles.darkCard,
          ]}
        >
          <Text
            style={[
              styles.statNumber,
              isDark && styles.darkText,
            ]}
          >
            {totalTasks - completedTasks}
          </Text>

          <Text
            style={[
              styles.statLabel,
              isDark && styles.darkSecondaryText,
            ]}
          >
            Активных
          </Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        <Pressable
          onPress={() => setFilter('all')}
          style={[
            styles.filterButton,
            filter === 'all' && styles.activeFilter,
            isDark && styles.darkFilterButton,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.activeFilterText,
              isDark &&
                filter !== 'all' &&
                styles.darkSecondaryText,
            ]}
          >
            Все
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setFilter('active')}
          style={[
            styles.filterButton,
            filter === 'active' && styles.activeFilter,
            isDark && styles.darkFilterButton,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'active' && styles.activeFilterText,
              isDark &&
                filter !== 'active' &&
                styles.darkSecondaryText,
            ]}
          >
            Активные
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setFilter('completed')}
          style={[
            styles.filterButton,
            filter === 'completed' && styles.activeFilter,
            isDark && styles.darkFilterButton,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'completed' && styles.activeFilterText,
              isDark &&
                filter !== 'completed' &&
                styles.darkSecondaryText,
            ]}
          >
            Выполненные
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text
            style={[
              styles.empty,
              isDark && styles.darkSecondaryText,
            ]}
          >
            Список пока пуст
          </Text>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: '#F5F7FB',
  },

  darkContainer: {
    backgroundColor: '#111827',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#172033',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: '#718096',
  },

  darkText: {
    color: '#F9FAFB',
  },

  darkSecondaryText: {
    color: '#9CA3AF',
  },

  settingsButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#E8ECF4',
  },

  settingsButtonText: {
    fontSize: 22,
    color: '#4F46E5',
  },

  addButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#4F46E5',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 30,
  },

  stats: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },

  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },

  darkCard: {
    backgroundColor: '#1F2937',
  },

  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#172033',
  },

  statLabel: {
    marginTop: 3,
    fontSize: 12,
    color: '#718096',
  },

  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },

  filterButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#E8ECF4',
  },

  darkFilterButton: {
    backgroundColor: '#1F2937',
  },

  activeFilter: {
    backgroundColor: '#4F46E5',
  },

  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B6577',
  },

  activeFilterText: {
    color: '#FFFFFF',
  },

  list: {
    paddingBottom: 30,
  },

  empty: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 16,
    color: '#718096',
  },
});