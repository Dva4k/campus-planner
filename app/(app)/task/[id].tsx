import { router, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Screen from '../../../src/components/ui/Screen';
import AppButton from '../../../src/components/ui/AppButton';
import EmptyState from '../../../src/components/ui/EmptyState';

import {
  useTaskQuery,
  useUpdateTask,
  useDeleteTask,
} from '../../../src/features/tasks/useTaskQuery';

import { useTheme } from '../../../src/context/ThemeContext';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { theme } = useTheme();
  const palette = colors[theme];

  const taskQuery = useTaskQuery(id);
  const updateMutation = useUpdateTask(id);
  const deleteMutation = useDeleteTask();

  if (taskQuery.isPending) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={{ color: palette.secondaryText }}>
            Загружаем задачу...
          </Text>
        </View>
      </Screen>
    );
  }

  if (taskQuery.isError) {
    return (
      <Screen>
        <EmptyState
          icon="⚠️"
          title="Не удалось загрузить задачу"
          description={taskQuery.error.message}
          actionTitle="Повторить"
          onAction={() => {
            void taskQuery.refetch();
          }}
        />
        <AppButton title="Назад" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  const task = taskQuery.data;

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

  const handleDelete = () => {
    Alert.alert(
      'Удалить задачу?',
      `Вы действительно хотите удалить «${task.title}»?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            deleteMutation.mutate(task.id, {
              onSuccess: () => router.back(),
            });
          },
        },
      ],
    );
  };

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
          {new Date(task.createdAt).toLocaleDateString('ru-RU')}
        </Text>

        {task.dueDate ? (
          <>
            <Text style={[styles.label, { color: palette.secondaryText }]}>
              Срок выполнения
            </Text>
            <Text style={[styles.value, { color: palette.text }]}>
              {new Date(task.dueDate).toLocaleDateString('ru-RU')}
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
        title={updateMutation.isPending ? 'Обновление...' : isCompleted ? 'Вернуть в активные' : 'Отметить выполненной'}
        variant="secondary"
        disabled={updateMutation.isPending}
        onPress={() =>
          updateMutation.mutate({
            status: isCompleted ? 'active' : 'completed',
          })
        }
        style={styles.actionButton}
      />

      <AppButton
        title={deleteMutation.isPending ? 'Удаление...' : 'Удалить задачу'}
        disabled={deleteMutation.isPending}
        onPress={handleDelete}
        style={styles.actionButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
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