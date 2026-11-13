
import { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';

import Animated, {
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

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
  const [remainingSeconds, setRemainingSeconds] = useState(5);

  const {
    tasks,
    toggleTaskStatus,
    removeTask,
    lastCreatedTaskId,
    clearLastCreatedTaskId,
    deletedTask,
    restoreDeletedTask,
    clearDeletedTask,
  } = useTasks();

  const totalTasks = tasks.length;
  const completedTasks = countTasksByStatus(tasks, 'completed');

  // Рассчитываем прогресс от 0 до 1
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

  // Анимация таймера отмены удаления
  const undoProgress = useSharedValue(1);

  const animatedUndoProgressStyle = useAnimatedStyle(() => ({
    width: `${undoProgress.value * 100}%`,
  }));

  // Обратный отсчёт и автоматическое удаление уведомления через 5 секунд
  useEffect(() => {
    if (!deletedTask) {
      setRemainingSeconds(5);
      undoProgress.value = 1;
      return;
    }

    setRemainingSeconds(5);
    undoProgress.value = 1;

    undoProgress.value = withTiming(0, {
      duration: 5000,
    });

    const intervalId = setInterval(() => {
      setRemainingSeconds((previous) =>
        Math.max(0, previous - 1)
      );
    }, 1000);

    const timeoutId = setTimeout(() => {
      clearDeletedTask();
    }, 5000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [deletedTask?.id, clearDeletedTask, undoProgress]);

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

      {/* Индикатор прогресса */}
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

          <Text
            style={[
              styles.progressPercent,
              { color: palette.primary },
            ]}
          >
            {Math.round(progressValue * 100)}%
          </Text>
        </View>

        <View
          style={[
            styles.progressTrack,
            { backgroundColor: palette.muted },
          ]}
        >
          <Animated.View
            style={[
              styles.progressFill,
              { backgroundColor: palette.primary },
              animatedProgressStyle,
            ]}
          />
        </View>

        <Text
          style={[
            styles.progressDescription,
            { color: palette.secondaryText },
          ]}
        >
          {completedTasks} из {totalTasks} задач выполнено
        </Text>
      </View>

      {/* Поиск */}
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

      {/* Фильтры */}
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

      {/* Список задач */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={toggleTaskStatus}
            onDelete={removeTask}
            isNew={item.id === lastCreatedTaskId}
            onHighlightComplete={clearLastCreatedTaskId}
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

      {/* Нижнее уведомление в стиле Telegram */}
      {deletedTask && (
        <Animated.View
          entering={FadeInDown.duration(250)}
          exiting={FadeOutDown.duration(250)}
          style={[
            styles.undoContainer,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}
        >
          <View style={styles.undoMessageRow}>
            <View style={styles.undoMessage}>
              <Text style={[styles.undoTitle, { color: palette.text }]}>
                Задача удалена
              </Text>

              <Text
                style={[
                  styles.undoDescription,
                  { color: palette.secondaryText },
                ]}
              >
                Отмена доступна ещё {remainingSeconds} сек.
              </Text>
            </View>

            <Pressable
              onPress={restoreDeletedTask}
              accessibilityRole="button"
              hitSlop={10}
              style={styles.undoButton}
            >
              <Text style={[styles.undoButtonText, { color: palette.primary }]}>
                ОТМЕНИТЬ
              </Text>
            </Pressable>
          </View>

          {/* Полоска обратного отсчёта */}
          <View
            style={[
              styles.undoTimerTrack,
              { backgroundColor: palette.muted },
            ]}
          >
            <Animated.View
              style={[
                styles.undoTimerFill,
                { backgroundColor: palette.primary },
                animatedUndoProgressStyle,
              ]}
            />
          </View>
        </Animated.View>
      )}
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
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    marginBottom: spacing.lg,
  },
  listContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  undoContainer: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  undoMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  undoMessage: {
    flex: 1,
  },
  undoTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  undoDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  undoButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  undoButtonText: {
    fontWeight: '700',
    fontSize: 13,
  },
  undoTimerTrack: {
    height: 3,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  undoTimerFill: {
    height: '100%',
    borderRadius: 3,
  },
});
