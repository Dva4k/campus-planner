import { router, useLocalSearchParams } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import TaskForm from '../../../src/components/TaskForm';
import { useTasks } from '../../../src/context/TaskContext';
import { useTheme } from '../../../src/context/ThemeContext';
import type { TaskPriority } from '../../../src/types/task';

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { getTaskById, updateTask } = useTasks();

  const task = getTaskById(id);

  if (!task) {
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
          Задача не найдена
        </Text>

        <Text
          style={[
            styles.message,
            isDark && styles.darkSecondaryText,
          ]}
        >
          Возможно, задача была удалена.
        </Text>

        <Pressable
          onPress={() => router.back()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Назад
          </Text>
        </Pressable>
      </View>
    );
  }

  const handleUpdate = (
    title: string,
    subject: string,
    priority: TaskPriority
  ) => {
    updateTask(id, title, subject, priority);
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
        Редактировать задачу
      </Text>

      <TaskForm
        onAdd={handleUpdate}
        initialTitle={task.title}
        initialSubject={task.subject}
        initialPriority={task.priority}
        submitText="Сохранить изменения"
      />
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

  message: {
    marginTop: 10,
    fontSize: 15,
    color: '#718096',
  },

  darkSecondaryText: {
    color: '#9CA3AF',
  },

  button: {
    alignSelf: 'flex-start',
    marginTop: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});