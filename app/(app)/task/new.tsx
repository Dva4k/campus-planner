import { router } from 'expo-router';
import { Alert, StyleSheet, Text } from 'react-native';

import TaskForm from '../../../src/components/TaskForm';
import Screen from '../../../src/components/ui/Screen';

import { useCreateTask } from '../../../src/features/tasks/useTaskQuery';

import { useTheme } from '../../../src/context/ThemeContext';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import type { CreateTaskInput } from '../../../src/types/task';

export default function NewTaskScreen() {
  const { theme } = useTheme();
  const palette = colors[theme];

  const createMutation = useCreateTask();

  const handleAdd = async (input: CreateTaskInput) => {
    try {
      await createMutation.mutateAsync(input);
      router.back();
    } catch (error) {
      Alert.alert(
        'Не удалось создать задачу',
        error instanceof Error ? error.message : 'Попробуй ещё раз.',
      );
    }
  };

  return (
    <Screen>
      <Text style={[styles.title, { color: palette.text }]}>
        Новая задача
      </Text>

      <TaskForm
        onSubmit={handleAdd}
        submitText={
          createMutation.isPending ? 'Сохранение...' : 'Добавить задачу'
        }
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
});