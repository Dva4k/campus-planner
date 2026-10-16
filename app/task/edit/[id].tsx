import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import TaskForm from '../../../src/components/TaskForm';
import Screen from '../../../src/components/ui/Screen';
import AppButton from '../../../src/components/ui/AppButton';
import EmptyState from '../../../src/components/ui/EmptyState';
import { useTasks } from '../../../src/hooks/useTasks';
import { useTheme } from '../../../src/context/ThemeContext';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import type { CreateTaskInput } from '../../../src/types/task';

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { theme } = useTheme();
  const palette = colors[theme];

  const { getTaskById, updateTask } = useTasks();
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

  const handleUpdate = (input: CreateTaskInput) => {
    updateTask(id, input);
    router.back();
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
        submitText="Сохранить изменения"
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
  title: {
    marginBottom: spacing.xl,
    fontSize: 26,
    fontWeight: '700',
  },
  cancelButton: {
    marginTop: spacing.sm,
  },
});