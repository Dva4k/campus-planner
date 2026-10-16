import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import TaskForm from '../../src/components/TaskForm';
import Screen from '../../src/components/ui/Screen';
import { useTasks } from '../../src/hooks/useTasks';
import { useTheme } from '../../src/context/ThemeContext';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import type { CreateTaskInput } from '../../src/types/task';

export default function NewTaskScreen() {
  const { theme } = useTheme();
  const palette = colors[theme];

  const { createTask } = useTasks();

  const handleAdd = (input: CreateTaskInput) => {
    createTask(input);
    router.back();
  };

  return (
    <Screen>
      <Text style={[styles.title, { color: palette.text }]}>
        Новая задача
      </Text>

      <TaskForm onSubmit={handleAdd} />
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