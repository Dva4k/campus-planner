
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

import Animated, {
  Extrapolation,
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

// Порог срабатывания 
const SWIPE_ACTION_THRESHOLD = 80;

// Максимальное смещение 
const MAX_SWIPE_DISTANCE = 140;

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

  // Название действия зависит от статуса задачи
  const swipeActionTitle = isCompleted ? 'Вернуть\nв активные' : 'Выполнить';


  const swipeActionIcon = isCompleted ? '↶' : '✓';

  const [isExpanded, setIsExpanded] = useState(false);

  // Анимация изменения статуса
  const progress = useSharedValue(isCompleted ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(isCompleted ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isCompleted, progress]);

  // Анимация раскрытия информации
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

  // Анимация подсветки новой задачи
  const highlightProgress = useSharedValue(0);

  useEffect(() => {
    if (!isNew) return;

    highlightProgress.value = withSequence(
      withTiming(1, { duration: 250 }),
      withDelay(
        900,
        withTiming(0, { duration: 500 }, (finished) => {
          if (finished && onHighlightComplete) {
            runOnJS(onHighlightComplete)();
          }
        })
      )
    );
  }, [isNew, highlightProgress, onHighlightComplete]);

  const animatedHighlightStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      highlightProgress.value,
      [0, 1],
      [palette.surface, palette.primaryLight],
    ),
  }));

  // Горизонтальное смещение карточки
  const translateX = useSharedValue(0);

  // Прозрачность зелёной области
  const rightActionStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_ACTION_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  // Прозрачность красной области
  const leftActionStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SWIPE_ACTION_THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  // Анимация карточки: смещение и масштаб в одном transform
  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [1, 0.75]),
    transform: [
      { translateX: translateX.value },
      {
        scale: interpolate(progress.value, [0, 1], [1, 0.98]),
      },
    ],
  }));

  // Обычное открытие подробностей
  const openDetails = () => {
    router.push({
      pathname: '/task/[id]',
      params: { id: task.id },
    });
  };

  // Подтверждение удаления
  const confirmDelete = () => {
    Alert.alert(
      'Удалить задачу?',
      `Вы действительно хотите удалить «${task.title}»?`,
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => onDelete(task.id),
        },
      ],
    );
  };

  // Переключение статуса в обе стороны
  const toggleTask = () => {
    onToggle(task.id);
  };

  // Обработка жеста
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate((event) => {
      translateX.value = Math.max(
        -MAX_SWIPE_DISTANCE,
        Math.min(MAX_SWIPE_DISTANCE, event.translationX),
      );
    })
    .onEnd(() => {
      if (translateX.value >= SWIPE_ACTION_THRESHOLD) {
        runOnJS(toggleTask)();
      } else if (translateX.value <= -SWIPE_ACTION_THRESHOLD) {
        runOnJS(confirmDelete)();
      }

      // Возвращаем карточку на исходную позицию
      translateX.value = withSpring(0, {
        damping: 18,
        stiffness: 150,
      });
    });

  const toggleDetails = () => {
    setIsExpanded((previous) => !previous);
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
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutUp.duration(200)}
      style={styles.wrapper}
    >
      <View style={styles.swipeContainer}>

        {/* Фоновая область при свайпе вправо */}
        <Animated.View
          style={[
            styles.actionBackground,
            styles.rightBackground,
            { backgroundColor: '#0ed35a' },
            rightActionStyle,
          ]}
        >
          <Text style={styles.actionText}>
            {swipeActionIcon} {swipeActionTitle}
          </Text>
        </Animated.View>

        {/* Фоновая область при свайпе влево */}
        <Animated.View
          style={[
            styles.actionBackground,
            styles.leftBackground,
            { backgroundColor: palette.danger },
            leftActionStyle,
          ]}
        >
          <Text style={styles.actionText}>
            Удалить ✕
          </Text>
        </Animated.View>

        {/* Карточка с обработчиком жестов */}
        <GestureDetector gesture={panGesture}>
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

            {/* Раскрытие дополнительной информации */}
            <Pressable
              onPress={toggleDetails}
              accessibilityRole="button"
              style={styles.detailsButton}
            >
              <Text
                style={[
                  styles.detailsButtonText,
                  { color: palette.primary },
                ]}
              >
                {isExpanded ? 'Свернуть ▲' : 'Подробнее ▼'}
              </Text>
            </Pressable>

            <Animated.View style={animatedDetailsStyle}>
              <View
                style={[
                  styles.details,
                  { borderTopColor: palette.border },
                ]}
              >
                <Text
                  style={[
                    styles.detailText,
                    { color: palette.secondaryText },
                  ]}
                >
                  Предмет: {task.subject}
                </Text>

                <Text
                  style={[
                    styles.detailText,
                    { color: palette.secondaryText },
                  ]}
                >
                  Создано: {createdDate}
                </Text>

                <Text
                  style={[
                    styles.detailText,
                    { color: palette.secondaryText },
                  ]}
                >
                  Срок выполнения: {dueDate}
                </Text>
              </View>
            </Animated.View>

            {/* Кнопки действий */}
            <View style={styles.actions}>
              <Pressable
                onPress={toggleTask}
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
        </GestureDetector>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  swipeContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
  },
  actionBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  rightBackground: {
    alignItems: 'flex-start',
  },
  leftBackground: {
    alignItems: 'flex-end',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
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
