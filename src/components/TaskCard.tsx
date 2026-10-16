
import { router } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { Task } from '../types/task';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

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
  const palette = colors[theme];
  const isCompleted = task.status === 'completed';

  const openDetails = () => {
    router.push({
      pathname: '/task/[id]',
      params: { id: task.id },
    });
  };

  const priorityText =
    task.priority === 'high'
      ? 'Высокий'
      : task.priority === 'medium'
        ? 'Средний'
        : 'Низкий';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: palette.surface,
          borderColor: palette.border,
          opacity: isCompleted ? 0.75 : 1,
        },
      ]}
    >
      <Pressable onPress={openDetails} style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: palette.text,
              textDecorationLine: isCompleted
                ? 'line-through'
                : 'none',
            },
          ]}
        >
          {task.title}
        </Text>

        <Text
          style={[
            styles.subject,
            { color: palette.secondaryText },
          ]}
        >
          {task.subject}
        </Text>

        <Text
          style={[
            styles.priority,
            { color: palette.primary },
          ]}
        >
          Приоритет: {priorityText}
        </Text>

        <Text
          style={[
            styles.status,
            { color: palette.secondaryText },
          ]}
        >
          {isCompleted ? 'Выполнено' : 'Активно'}
        </Text>
      </Pressable>

      <View style={styles.actions}>
        <Pressable
          onPress={() => onToggle(task.id)}
          accessibilityRole="button"
          style={[
            styles.actionButton,
            { backgroundColor: palette.primaryLight },
          ]}
        >
          <Text
            style={[
              styles.toggleText,
              { color: palette.primary },
            ]}
          >
            {isCompleted ? 'Вернуть' : 'Выполнить'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onDelete(task.id)}
          accessibilityRole="button"
          style={[
            styles.actionButton,
            { backgroundColor: palette.muted },
          ]}
        >
          <Text
            style={[
              styles.deleteText,
              { color: palette.danger },
            ]}
          >
            Удалить
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
  },
  content: {
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.sm - spacing.xs,
    fontSize: 17,
    fontWeight: '700',
  },
  subject: {
    marginBottom: spacing.sm - spacing.xs,
  },
  priority: {
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  status: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
  },
  toggleText: {
    fontWeight: '600',
  },
  deleteText: {
    fontWeight: '600',
  },
});
