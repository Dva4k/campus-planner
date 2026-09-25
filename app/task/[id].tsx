import { router, useLocalSearchParams } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTasks } from '../../src/context/TaskContext';
import { useTheme } from '../../src/context/ThemeContext';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { getTaskById } = useTasks();

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
          <Text style={styles.buttonText}>Назад</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        isDark && styles.darkContainer,
      ]}
    >
      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>← Назад</Text>
      </Pressable>

      <Text
        style={[
          styles.title,
          isDark && styles.darkText,
        ]}
      >
        {task.title}
      </Text>

      <View
        style={[
          styles.card,
          isDark && styles.darkCard,
        ]}
      >
        <Text
          style={[
            styles.label,
            isDark && styles.darkSecondaryText,
          ]}
        >
          Предмет
        </Text>

        <Text
          style={[
            styles.value,
            isDark && styles.darkText,
          ]}
        >
          {task.subject}
        </Text>

        <Text
          style={[
            styles.label,
            isDark && styles.darkSecondaryText,
          ]}
        >
          Приоритет
        </Text>

        <Text
          style={[
            styles.value,
            isDark && styles.darkText,
          ]}
        >
          {task.priority === 'high'
            ? 'Высокий'
            : task.priority === 'medium'
              ? 'Средний'
              : 'Низкий'}
        </Text>

        <Text
          style={[
            styles.label,
            isDark && styles.darkSecondaryText,
          ]}
        >
          Статус
        </Text>

        <Text
          style={[
            styles.value,
            isDark && styles.darkText,
          ]}
        >
          {task.isCompleted ? 'Выполнено' : 'Активно'}
        </Text>
      </View>

      <Pressable
        onPress={() =>
          router.push({
            pathname: '/task/edit/[id]',
            params: { id: task.id },
          })
        }
        style={styles.editButton}
      >
        <Text style={styles.editButtonText}>
          Редактировать
        </Text>
      </Pressable>
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

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },

  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4F46E5',
  },

  title: {
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

  card: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },

  darkCard: {
    backgroundColor: '#1F2937',
  },

  label: {
    marginTop: 14,
    fontSize: 12,
    fontWeight: '600',
    color: '#718096',
    textTransform: 'uppercase',
  },

  value: {
    marginTop: 5,
    fontSize: 17,
    fontWeight: '600',
    color: '#172033',
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

  editButton: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
  },

  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});