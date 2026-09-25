import { router } from 'expo-router';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import TaskForm from '../../src/components/TaskForm';
import { useTasks } from '../../src/context/TaskContext';
import { useTheme } from '../../src/context/ThemeContext';
import type { TaskPriority } from '../../src/types/task';

export default function NewTaskScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { addTask } = useTasks();

  const handleAdd = (
    title: string,
    subject: string,
    priority: TaskPriority
  ) => {
    addTask(title, subject, priority);
    router.back();
  };

  return (
    <View
      style={[
        styles.container,
        isDark && styles.darkContainer,
      ]}
    >
      <Text
        style={[
          styles.title,
          isDark && styles.darkText,
        ]}
      >
        Новая задача
      </Text>

      <TaskForm onAdd={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F5F7FB',
  },

  darkContainer: {
    backgroundColor: '#111827',
  },

  title: {
    marginBottom: 20,
    fontSize: 28,
    fontWeight: '800',
    color: '#172033',
  },

  darkText: {
    color: '#F9FAFB',
  },
});