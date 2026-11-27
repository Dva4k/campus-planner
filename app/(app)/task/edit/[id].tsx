import { router, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import TaskForm from '../../../../src/components/TaskForm';
import Screen from '../../../../src/components/ui/Screen';
import AppButton from '../../../../src/components/ui/AppButton';
import EmptyState from '../../../../src/components/ui/EmptyState';

import {
  useTaskQuery,
  useUpdateTask,
} from '../../../../src/features/tasks/useTaskQuery';

import { useTheme } from '../../../../src/context/ThemeContext';
import { colors } from '../../../../src/theme/colors';
import { spacing } from '../../../../src/theme/spacing';
import type { CreateTaskInput } from '../../../../src/types/task';

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { theme } = useTheme();
  const palette = colors[theme];

  const taskQuery = useTaskQuery(id);
  const updateMutation = useUpdateTask(id);

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

  if (taskQuery.isError || !taskQuery.data) {
    return (
      <Screen>
        <EmptyState
          icon="🔎"
          title="Не удалось открыть задачу"
          description={
            taskQuery.error?.message ?? 'Задача не найдена.'
          }
          actionTitle="Назад"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  const task = taskQuery.data;

  const handleUpdate = async (input: CreateTaskInput) => {
    try {
      await updateMutation.mutateAsync(input);
      router.back();
    } catch (error) {
      Alert.alert(
        'Не удалось сохранить изменения',
        error instanceof Error ? error.message : 'Попробуй ещё раз.',
      );
    }
  };

  return (
    <Screen>
      <Text style={[styles.title, { color: palette.text }]}>
        Редактировать задачу
      </Text>

      <TaskForm
        onSubmit={handleUpdate}
        initialTitle={task.title}
        initialSubject={task.subject}
        initialPriority={task.priority}
        isSubmitting={updateMutation.isPending}
        submitText={
          updateMutation.isPending
            ? 'Сохранение...'
            : 'Сохранить изменения'
        }
      />

      <AppButton
        title="Отмена"
        variant="secondary"
        onPress={() => router.back()}
        style={styles.cancelButton}
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
  title: {
    marginBottom: spacing.xl,
    fontSize: 26,
    fontWeight: '700',
  },
  cancelButton: {
    marginTop: spacing.sm,
  },
});