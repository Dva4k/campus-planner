import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Task } from '../types/task';
import { useTheme } from '../context/ThemeContext';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({
  task,
  onToggle,
  onDelete,
}: TaskCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const openDetails = () => {
    router.push({
      pathname: '/task/[id]',
      params: { id: task.id },
    });
  };

  return (
    <View
      style={[
        styles.card,
        isDark && styles.darkCard,
        task.isCompleted && styles.completedCard,
      ]}
    >
      <Pressable onPress={openDetails} style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              isDark && styles.darkText,
              task.isCompleted && styles.completedTitle,
            ]}
          >
            {task.title}
          </Text>
        </View>

        <View style={styles.priorityRow}>
          <Text
            style={[
              styles.priorityLabel,
              isDark && styles.darkSecondaryText,
            ]}
          >
            Сложность:
          </Text>

          <View
            style={[
              styles.priorityDot,
              task.priority === 'high' && styles.high,
              task.priority === 'medium' && styles.medium,
              task.priority === 'low' && styles.low,
            ]}
          />

          <Text
            style={[
              styles.priorityText,
              isDark && styles.darkSecondaryText,
            ]}
          >
            {task.priority === 'high'
              ? 'Высокая'
              : task.priority === 'medium'
                ? 'Средняя'
                : 'Низкая'}
          </Text>
        </View>

        <Text
          style={[
            styles.subject,
            isDark && styles.darkSecondaryText,
          ]}
        >
          {task.subject}
        </Text>

        <Text style={styles.status}>
          {task.isCompleted ? '✓ Выполнено' : '● Активно'}
        </Text>
      </Pressable>

      <View style={styles.actions}>
        <Pressable
          onPress={() => onToggle(task.id)}
          style={styles.actionButton}
        >
          <Text style={styles.toggleText}>
            {task.isCompleted ? 'Вернуть' : 'Выполнить'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onDelete(task.id)}
          style={styles.actionButton}
        >
          <Text style={styles.delete}>Удалить</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },

  darkCard: {
    backgroundColor: '#1F2937',
  },

  completedCard: {
    opacity: 0.65,
  },

  content: {
    marginBottom: 14,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    flex: 1,
    marginRight: 12,
    fontSize: 17,
    fontWeight: '700',
    color: '#172033',
  },

  darkText: {
    color: '#F9FAFB',
  },

  completedTitle: {
    color: '#9AA3B2',
    textDecorationLine: 'line-through',
  },

  subject: {
    marginTop: 7,
    fontSize: 14,
    color: '#718096',
  },

  darkSecondaryText: {
    color: '#9CA3AF',
  },

  status: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
  },

  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  priorityLabel: {
    marginRight: 6,
    fontSize: 13,
    color: '#718096',
  },

  priorityText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#5B6577',
  },

  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  high: {
    backgroundColor: '#EF4444',
  },

  medium: {
    backgroundColor: '#F59E0B',
  },

  low: {
    backgroundColor: '#22A06B',
  },

  actions: {
    flexDirection: 'row',
    gap: 16,
  },

  actionButton: {
    paddingVertical: 4,
  },

  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
  },

  delete: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
});