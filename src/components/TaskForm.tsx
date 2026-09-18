import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { TaskPriority } from '../types/task';

interface TaskFormProps {
  onAdd: (
    title: string,
    subject: string,
    priority: TaskPriority
  ) => void;
}

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  const handleAdd = () => {
    if (!title.trim() || !subject.trim()) {
      Alert.alert('Ошибка', 'Заполни название и предмет');
      return;
    }

    onAdd(title.trim(), subject.trim(), priority);

    setTitle('');
    setSubject('');
    setPriority('medium');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Новая задача</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Название задачи"
        style={styles.input}
      />

      <TextInput
        value={subject}
        onChangeText={setSubject}
        placeholder="Предмет"
        style={styles.input}
      />

      <Text style={styles.label}>Приоритет</Text>

      <View style={styles.priorityRow}>
        <Pressable
          onPress={() => setPriority('low')}
          style={[
            styles.priorityButton,
            priority === 'low' && styles.activePriority,
          ]}
        >
          <Text>Низкий</Text>
        </Pressable>

        <Pressable
          onPress={() => setPriority('medium')}
          style={[
            styles.priorityButton,
            priority === 'medium' && styles.activePriority,
          ]}
        >
          <Text>Средний</Text>
        </Pressable>

        <Pressable
          onPress={() => setPriority('high')}
          style={[
            styles.priorityButton,
            priority === 'high' && styles.activePriority,
          ]}
        >
          <Text>Высокий</Text>
        </Pressable>
      </View>

      <Pressable onPress={handleAdd} style={styles.addButton}>
        <Text style={styles.addButtonText}>Добавить задачу</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  heading: {
    marginBottom: 12,
    fontSize: 20,
    fontWeight: '700',
  },
  input: {
    marginBottom: 10,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  priorityButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  activePriority: {
    backgroundColor: '#ddd',
  },
  addButton: {
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});