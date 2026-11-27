import { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import TaskCard from '../../src/components/TaskCard';
import Screen from '../../src/components/ui/Screen';
import AppButton from '../../src/components/ui/AppButton';
import EmptyState from '../../src/components/ui/EmptyState';

import {
  useTasksQuery,
  useChangeTaskStatus,
  useDeleteTask,
} from '../../src/features/tasks/useTaskQuery';

import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { useTheme } from '../../src/context/ThemeContext';

import {
  countTasksByStatus,
  filterTasks,
  filterTasksByStatus,
  sortTasksByPriority,
} from '../../src/utils/task';

type TaskFilter = 'all' | 'active' | 'completed';

export default function App() {
  const { theme } = useTheme();
  const palette = colors[theme];

  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchText, setSearchText] = useState('');
  const [sortByPriority, setSortByPriority] = useState(false); 

  const tasksQuery = useTasksQuery();
  const updateMutation = useChangeTaskStatus();
  const deleteMutation = useDeleteTask();

  const tasks = tasksQuery.data ?? [];

  const totalTasks = tasks.length;
  const completedTasks = countTasksByStatus(tasks, 'completed');

  const progressValue =
    totalTasks === 0
      ? 0
      : Math.min(1, completedTasks / totalTasks);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(progressValue, {
      duration: 500,
    });
  }, [progressValue, progress]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const statusFilteredTasks = filterTasksByStatus(tasks, filter);
const filteredTasks = filterTasks(statusFilteredTasks, searchText);

const displayedTasks = sortByPriority
  ? sortTasksByPriority(filteredTasks)
  : filteredTasks;

  const handleToggle = (id: string) => {
  if (updateMutation.isPending) return;

  const task = tasks.find((item) => item.id === id);
  if (!task) return;

  updateMutation.mutate({
    id,
    status: task.status === 'active' ? 'completed' : 'active',
  });
};

  const handleDelete = (id: string) => {
  if (deleteMutation.isPending) return;

  deleteMutation.mutate(id);
};



  if (tasksQuery.isPending) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={[styles.message, { color: palette.secondaryText }]}>
            Загружаем задачи...
          </Text>
        </View>
      </Screen>
    );
  }

  if (tasksQuery.isError) {
    return (
      <Screen>
        <EmptyState
          icon="⚠️"
          title="Не удалось загрузить задачи"
          description={tasksQuery.error.message}
          actionTitle="Повторить"
          onAction={() => {
            void tasksQuery.refetch();
          }}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.heading}>
          <Text style={[styles.title, { color: palette.text }]}>
            Планировщик задач
          </Text>

          <Text style={[styles.subtitle, { color: palette.secondaryText }]}>
            Всего: {totalTasks} · Выполнено: {completedTasks}
          </Text>
        </View>

        <AppButton
          title="Настройки"
          variant="secondary"
          onPress={() => router.push('/settings')}
        />
      </View>

      <View
        style={[
          styles.progressContainer,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
          },
        ]}
      >
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTitle, { color: palette.text }]}>
            Прогресс выполнения
          </Text>

          <Text style={[styles.progressPercent, { color: palette.primary }]}>
            {Math.round(progressValue * 100)}%
          </Text>
        </View>

        <View style={[styles.progressTrack, { backgroundColor: palette.muted }]}>
          <Animated.View
            style={[
              styles.progressFill,
              { backgroundColor: palette.primary },
              animatedProgressStyle,
            ]}
          />
        </View>

        <Text style={[styles.progressDescription, { color: palette.secondaryText }]}>
          {completedTasks} из {totalTasks} задач выполнено
        </Text>
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
                  filter === item ? palette.primary : palette.muted,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === item ? '#FFFFFF' : palette.text },
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
      
          <Pressable
            onPress={() => setSortByPriority((previous) => !previous)}
            style={[
              styles.sortButton,
              {
                backgroundColor: sortByPriority
                  ? palette.primaryLight
                  : palette.muted,
                borderColor: palette.border,
              },
            ]}
          >
            <Text
              style={[
                styles.sortButtonText,
                {
                  color: sortByPriority
                    ? palette.primary
                    : palette.text,
                },
              ]}
            >
              {sortByPriority
                ? '✓ Сортировка по приоритету'
                : 'Сортировать по приоритету'}
            </Text>
          </Pressable>

      <AppButton
        title="+ Новая задача"
        onPress={() => router.push('/task/new')}
        style={styles.addButton}
      />

      <FlatList
        data={displayedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={tasksQuery.isRefetching}
            onRefresh={() => {
              void tasksQuery.refetch();
            }}
            tintColor={palette.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="🔎"
            title={tasks.length === 0 ? 'Задач пока нет' : 'Ничего не найдено'}
            description={
              tasks.length === 0
                ? 'Создай первую учебную задачу.'
                : 'Попробуй изменить поисковый запрос или фильтр.'
            }
            actionTitle={tasks.length === 0 ? 'Добавить задачу' : undefined}
            onAction={() => router.push('/task/new')}
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: spacing.md,
    fontSize: 15,
  },
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
  progressContainer: {
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 15,
    fontWeight: '700',
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressDescription: {
    fontSize: 12,
    marginTop: spacing.sm,
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
    fontSize: 13,
    fontWeight: '600',
  },
  addButton: {
    marginBottom: spacing.lg,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  sortButton: {
  padding: spacing.md,
  borderRadius: 10,
  borderWidth: 1,
  alignItems: 'center',
  marginBottom: spacing.lg,
},

sortButtonText: {
  fontSize: 14,
  fontWeight: '600',
},
});