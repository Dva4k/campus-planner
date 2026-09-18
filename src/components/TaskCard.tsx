import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({
  task,
  onToggle,
  onDelete,
}: TaskCardProps) {
  return (
    <View style={[styles.card, task.isCompleted && styles.completedCard]}>
      <Pressable onPress={() => onToggle(task.id)} style={styles.content}>
        <Text
          style={[
            styles.title,
            task.isCompleted && styles.completedTitle,
          ]}
        >
          {task.title}
        </Text>

        <Text style={styles.subject}>{task.subject}</Text>

        <Text style={styles.priority}>
          Приоритет: {task.priority}
        </Text>

        <Text style={styles.status}>
          {task.isCompleted ? 'Выполнено' : 'Активно'}
        </Text>
      </Pressable>

      <Pressable onPress={() => onDelete(task.id)}>
        <Text style={styles.delete}>Удалить</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  completedCard: {
    opacity: 0.6,
  },
  content: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  subject: {
    marginTop: 6,
    fontSize: 14,
  },
  priority: {
    marginTop: 6,
    fontSize: 14,
  },
  status: {
    marginTop: 6,
    fontSize: 14,
  },
  delete: {
    fontSize: 14,
    fontWeight: '600',
  },
});