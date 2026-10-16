import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';
import type {
  CreateTaskInput,
  TaskPriority,
} from '../types/task';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import AppInput from './ui/AppInput';
import AppButton from './ui/AppButton';

interface TaskFormProps {
  onSubmit: (input: CreateTaskInput) => void;
  initialTitle?: string;
  initialSubject?: string;
  initialPriority?: TaskPriority;
  submitText?: string;
}

export default function TaskForm({
  onSubmit,
  initialTitle = '',
  initialSubject = '',
  initialPriority = 'medium',
  submitText = 'Добавить задачу',
}: TaskFormProps) {
  const { theme } = useTheme();
  const palette = colors[theme];

  const [title, setTitle] = useState(initialTitle);
  const [subject, setSubject] = useState(initialSubject);
  const [priority, setPriority] =
    useState<TaskPriority>(initialPriority);

  const [titleError, setTitleError] = useState('');
  const [subjectError, setSubjectError] = useState('');

  const isNewTask = submitText === 'Добавить задачу';

  const handleSubmit = () => {
    const cleanTitle = title.trim();
    const cleanSubject = subject.trim();

    setTitleError(cleanTitle ? '' : 'Введи название задачи');
    setSubjectError(cleanSubject ? '' : 'Введи название предмета');

    if (!cleanTitle || !cleanSubject) {
      return;
    }

    onSubmit({
      title: cleanTitle,
      subject: cleanSubject,
      priority,
    });

    if (isNewTask) {
      setTitle('');
      setSubject('');
      setPriority('medium');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: palette.text }]}>
        {isNewTask ? 'Новая задача' : 'Редактирование'}
      </Text>

      <AppInput
        label="Название задачи"
        value={title}
        onChangeText={(value) => {
          setTitle(value);
          if (value.trim()) setTitleError('');
        }}
        placeholder="Введите название задачи"
        error={titleError}
      />

      <AppInput
        label="Предмет"
        value={subject}
        onChangeText={(value) => {
          setSubject(value);
          if (value.trim()) setSubjectError('');
        }}
        placeholder="Введите предмет"
        error={subjectError}
      />

      <Text style={[styles.label, { color: palette.text }]}>
        Приоритет
      </Text>

      <View style={styles.priorityRow}>
        {([
          ['low', 'Низкий'],
          ['medium', 'Средний'],
          ['high', 'Высокий'],
        ] as const).map(([value, label]) => (
          <Pressable
            key={value}
            onPress={() => setPriority(value)}
            style={[
              styles.priorityButton,
              {
                backgroundColor:
                  priority === value
                    ? palette.primaryLight
                    : palette.surface,
                borderColor:
                  priority === value
                    ? palette.primary
                    : palette.border,
              },
            ]}
          >
            <Text
              style={[
                styles.priorityText,
                { color: palette.text },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <AppButton
        title={submitText}
        onPress={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  heading: {
    marginBottom: spacing.md,
    fontSize: 20,
    fontWeight: '700',
  },
  label: {
    marginBottom: spacing.sm,
    fontSize: 14,
    fontWeight: '600',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  priorityButton: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 14,
  },
});