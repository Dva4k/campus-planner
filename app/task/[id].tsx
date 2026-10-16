import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import Screen from '../../src/components/ui/Screen';
import AppButton from '../../src/components/ui/AppButton';
import EmptyState from '../../src/components/ui/EmptyState';
import { useTasks } from '../../src/hooks/useTasks';
import { useTheme } from '../../src/context/ThemeContext';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { theme } = useTheme();
  const palette = colors[theme];

  const { getTaskById, toggleTaskStatus, removeTask } = useTasks();
  const task = getTaskById(id);

  if (!task) {
    return (
      <Screen>
        <EmptyState
          icon="🔎"
          title="Задача не найдена"
          description="Возможно, задача была удалена."
          actionTitle="Назад"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  const isCompleted = task.status === 'completed';

  const priorityText =
    task.priority === 'high'
      ? 'Высокий'
      : task.priority === 'medium'
        ? 'Средний'
        : 'Низкий';

  return (
    <Screen>
      <AppButton
        title="← Назад"
        variant="secondary"
        onPress={() => router.back()}
        style={styles.backButton}
      />

      <Text style={[styles.title, { color: palette.text }]}>
        {task.title}
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
          },
        ]}
      >
        <Text style={[styles.label, { color: palette.secondaryText }]}>
          Предмет
        </Text>
        <Text style={[styles.value, { color: palette.text }]}>
          {task.subject}
        </Text>

        <Text style={[styles.label, { color: palette.secondaryText }]}>
          Приоритет
        </Text>
        <Text style={[styles.value, { color: palette.text }]}>
          {priorityText}
        </Text>

        <Text style={[styles.label, { color: palette.secondaryText }]}>
          Статус
        </Text>
        <Text style={[styles.value, { color: palette.text }]}>
          {isCompleted ? 'Выполнено' : 'Активно'}
        </Text>

        <Text style={[styles.label, { color: palette.secondaryText }]}>
          Дата создания
        </Text>
        <Text style={[styles.value, { color: palette.text }]}>
          {new Date(task.createdAt).toLocaleDateString()}
        </Text>

        {task.dueDate ? (
          <>
            <Text style={[styles.label, { color: palette.secondaryText }]}>
              Срок выполнения
            </Text>
            <Text style={[styles.value, { color: palette.text }]}>
              {new Date(task.dueDate).toLocaleDateString()}
            </Text>
          </>
        ) : null}
      </View>

      <AppButton
        title="Редактировать"
        onPress={() =>
          router.push({
            pathname: '/task/edit/[id]',
            params: { id: task.id },
          })
        }
        style={styles.actionButton}
      />

      <AppButton
        title={isCompleted ? 'Вернуть в активные' : 'Отметить выполненной'}
        variant="secondary"
        onPress={() => toggleTaskStatus(task.id)}
        style={styles.actionButton}
      />

      <AppButton
        title="Удалить задачу"
        onPress={() => {
          removeTask(task.id);
          router.back();
        }}
        style={styles.actionButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.lg,
    fontSize: 26,
    fontWeight: '700',
  },
  card: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderRadius: 12,
  },
  label: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    fontSize: 13,
  },
  value: {
    marginBottom: spacing.sm,
    fontSize: 16,
    fontWeight: '600',
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
});