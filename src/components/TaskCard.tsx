
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Animated, {
  FadeInDown,
  FadeOutUp,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { Task } from '../types/task';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isNew?: boolean;
  onHighlightComplete?: () => void;
}

export default function TaskCard({
  task,
  onToggle,
  onDelete,
  isNew = false,
  onHighlightComplete,
}: TaskCardProps) {
  const { theme } = useTheme();
  const palette = colors[theme];
  const isCompleted = task.status === 'completed';

  const [isExpanded, setIsExpanded] = useState(false);

  // Анимация изменения статуса задачи
  const progress = useSharedValue(isCompleted ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(isCompleted ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isCompleted, progress]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [1, 0.75]),
    transform: [
      {
        scale: interpolate(progress.value, [0, 1], [1, 0.98]),
      },
    ],
  }));

  // Анимация раскрытия доп.инфы
  const expandProgress = useSharedValue(0);

  useEffect(() => {
    expandProgress.value = withTiming(isExpanded ? 1 : 0, {
      duration: 250,
    });
  }, [isExpanded, expandProgress]);

  const animatedDetailsStyle = useAnimatedStyle(() => ({
    height: interpolate(expandProgress.value, [0, 1], [0, 100]),
    opacity: expandProgress.value,
    overflow: 'hidden',
  }));

  //  анимация новой задачи
  const highlightProgress = useSharedValue(0);

useEffect(() => {
  if (!isNew) return;

  highlightProgress.value = withSequence(
    withTiming(1, { duration: 250 }),
    withDelay(
      900,
      withTiming(0, { duration: 500 }, (finished) => {
        // Проверяем finished и безопасно вызываем коллбэк
        if (finished && onHighlightComplete) {
          runOnJS(onHighlightComplete)();
        }
      })
    )
  );
}, [isNew, onHighlightComplete]);


  const animatedHighlightStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      highlightProgress.value,
      [0, 1],
      [palette.surface, palette.primaryLight],
    ),
  }));

  const toggleDetails = () => {
    setIsExpanded((previous) => !previous);
  };

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

  const createdDate = new Date(task.createdAt).toLocaleDateString('ru-RU');

  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('ru-RU')
    : 'Не указан';

  return (
    // анимация появление и удаление
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutUp.duration(200)}
      style={styles.wrapper}
    >
      {/* Внутренний компонент отвечает за анимации карточки */}
      <Animated.View
        style={[
          styles.card,
          animatedCardStyle,
          animatedHighlightStyle,
          {
            borderColor: palette.border,
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

        {/* выпадающий список */}
        <Pressable
          onPress={toggleDetails}
          accessibilityRole="button"
          style={styles.detailsButton}
        >
          <Text style={[styles.detailsButtonText, { color: palette.primary }]}>
            {isExpanded ? 'Свернуть ▲' : 'Подробнее ▼'}
          </Text>
        </Pressable>

        {/* доп.инфа */}
        <Animated.View style={animatedDetailsStyle}>
          <View
            style={[
              styles.details,
              { borderTopColor: palette.border },
            ]}
          >
            <Text style={[styles.detailText, { color: palette.secondaryText }]}>
              Предмет: {task.subject}
            </Text>

            <Text style={[styles.detailText, { color: palette.secondaryText }]}>
              Создано: {createdDate}
            </Text>

            <Text style={[styles.detailText, { color: palette.secondaryText }]}>
              Срок выполнения: {dueDate}
            </Text>
          </View>
        </Animated.View>

    
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
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  card: {
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
  detailsButton: {
    paddingVertical: spacing.sm,
  },
  detailsButtonText: {
    fontWeight: '600',
  },
  details: {
    borderTopWidth: 1,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  detailText: {
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
