import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';
import type { TaskPriority } from '../types/task';

interface TaskFormProps {
  onAdd: (
    title: string,
    subject: string,
    priority: TaskPriority
  ) => void;
  initialTitle?: string;
  initialSubject?: string;
  initialPriority?: TaskPriority;
  submitText?: string;
}

export default function TaskForm({
  onAdd,
  initialTitle = '',
  initialSubject = '',
  initialPriority = 'medium',
  submitText = 'Добавить задачу',
}: TaskFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [title, setTitle] = useState(initialTitle);
  const [subject, setSubject] = useState(initialSubject);
  const [priority, setPriority] =
    useState<TaskPriority>(initialPriority);

  const handleSubmit = () => {
    if (!title.trim() || !subject.trim()) {
      Alert.alert('Ошибка', 'Заполни название и предмет');
      return;
    }

    onAdd(title.trim(), subject.trim(), priority);

    if (submitText === 'Добавить задачу') {
      setTitle('');
      setSubject('');
      setPriority('medium');
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.heading,
          isDark && styles.darkText,
        ]}
      >
        {submitText === 'Добавить задачу'
          ? 'Новая задача'
          : 'Редактирование'}
      </Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Название задачи"
        placeholderTextColor={isDark ? '#9CA3AF' : '#9AA3B2'}
        style={[
          styles.input,
          isDark && styles.darkInput,
          isDark && styles.darkText,
        ]}
      />

      <TextInput
        value={subject}
        onChangeText={setSubject}
        placeholder="Предмет"
        placeholderTextColor={isDark ? '#9CA3AF' : '#9AA3B2'}
        style={[
          styles.input,
          isDark && styles.darkInput,
          isDark && styles.darkText,
        ]}
      />

      <Text
        style={[
          styles.label,
          isDark && styles.darkText,
        ]}
      >
        Приоритет
      </Text>

      <View style={styles.priorityRow}>
        <Pressable
          onPress={() => setPriority('low')}
          style={[
            styles.priorityButton,
            isDark && styles.darkPriorityButton,
            priority === 'low' && styles.activePriority,
          ]}
        >
          <Text
            style={[
              styles.priorityText,
              isDark && styles.darkText,
            ]}
          >
            Низкий
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setPriority('medium')}
          style={[
            styles.priorityButton,
            isDark && styles.darkPriorityButton,
            priority === 'medium' && styles.activePriority,
          ]}
        >
          <Text
            style={[
              styles.priorityText,
              isDark && styles.darkText,
            ]}
          >
            Средний
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setPriority('high')}
          style={[
            styles.priorityButton,
            isDark && styles.darkPriorityButton,
            priority === 'high' && styles.activePriority,
          ]}
        >
          <Text
            style={[
              styles.priorityText,
              isDark && styles.darkText,
            ]}
          >
            Высокий
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={handleSubmit}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>
          {submitText}
        </Text>
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
    color: '#172033',
  },

  darkText: {
    color: '#F9FAFB',
  },

  input: {
    marginBottom: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D9DEEA',
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },

  darkInput: {
    borderColor: '#374151',
    backgroundColor: '#1F2937',
  },

  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#172033',
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
    borderColor: '#D9DEEA',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },

  darkPriorityButton: {
    borderColor: '#374151',
    backgroundColor: '#1F2937',
  },

  activePriority: {
    backgroundColor: '#E8E7FF',
    borderColor: '#4F46E5',
  },

  priorityText: {
    color: '#172033',
  },

  addButton: {
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#4F46E5',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});