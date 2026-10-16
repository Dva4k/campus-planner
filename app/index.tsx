import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';

import TaskCard from '../src/components/TaskCard';
import Screen from '../src/components/ui/Screen';
import AppButton from '../src/components/ui/AppButton';
import EmptyState from '../src/components/ui/EmptyState';
import { useTasks } from '../src/hooks/useTasks';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { useTheme } from '../src/context/ThemeContext';
import {
  countTasksByStatus,
  filterTasks,
  filterTasksByStatus,
} from '../src/utils/task';

type TaskFilter = 'all' | 'active' | 'completed';

export default function App() {
  const { theme } = useTheme();
  const palette = colors[theme];

  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchText, setSearchText] = useState('');

  const { tasks, toggleTaskStatus, removeTask } = useTasks();

  const totalTasks = tasks.length;
  const completedTasks = countTasksByStatus(tasks, 'completed');

  const statusFilteredTasks = filterTasksByStatus(tasks, filter);
  const filteredTasks = filterTasks(statusFilteredTasks, searchText);

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.heading}>
          <Text style={[styles.title, { color: palette.text }]}>
            Планировщик задач
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: palette.secondaryText },
            ]}
          >
            Всего: {totalTasks} · Выполнено: {completedTasks}
          </Text>
        </View>

        <AppButton
          title="Настройки"
          variant="secondary"
          onPress={() => router.push('/settings')}
        />
      </View>

      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Поиск по задаче или предмету"
        placeholderTextColor={palette.secondaryText}
        style={[
          styles.searchInput,
          {
            color: palette.text,
            backgroundColor: palette.surface,
            borderColor: palette.border,
          },
        ]}
      />

      <View style={styles.filterRow}>
        {(['all', 'active', 'completed'] as const).map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  filter === item
                    ? palette.primary
                    : palette.muted,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: filter === item ? '#FFFFFF' : palette.text,
                },
              ]}
            >
              {item === 'all'
                ? 'Все'
                : item === 'active'
                  ? 'Активные'
                  : 'Выполненные'}
            </Text>
          </Pressable>
        ))}
      </View>

      <AppButton
        title="+ Новая задача"
        onPress={() => router.push('/task/new')}
        style={styles.addButton}
      />

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={toggleTaskStatus}
            onDelete={removeTask}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="🔎"
            title="Ничего не найдено"
            description={
              searchText.trim()
                ? 'Попробуй изменить поисковый запрос.'
                : 'В этой категории пока нет задач.'
            }
            actionTitle="Добавить задачу"
            onAction={() => router.push('/task/new')}
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  heading: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  searchInput: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    marginBottom: spacing.lg,
  },
  listContent: {
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
});