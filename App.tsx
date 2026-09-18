import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import TaskCard from './src/components/TaskCard';
import type { Task, TaskPriority } from './src/types/task';
import TaskForm from './src/components/TaskForm';

type TaskFilter = 'all' | 'active' | 'completed';

export default function App() {
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Подготовить лабораторную работу №1',
      subject: 'React Native',
      priority: 'high',
      isCompleted: false,
    },
    {
      id: '2',
      title: 'Повторить TypeScript',
      subject: 'Программирование',
      priority: 'medium',
      isCompleted: true,
    },
    {
      id: '3',
      title: 'Прочитать главу учебника',
      subject: 'Базы данных',
      priority: 'low',
      isCompleted: false,
    },
    {
      id: '4',
      title: 'Подготовиться к тесту',
      subject: 'Математика',
      priority: 'high',
      isCompleted: false,
    },
  ]);

  const handleToggle = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    );
  };

  const handleDelete = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  const handleAdd = (
  title: string,
  subject: string,
  priority: TaskPriority
) => {
  const newTask: Task = {
    id: String(Date.now()),
    title,
    subject,
    priority,
    isCompleted: false,
  };

  setTasks((currentTasks) => [newTask, ...currentTasks]);
};

const filteredTasks = tasks.filter((task) => {
  if (filter === 'active') {
    return !task.isCompleted;
  }

  if (filter === 'completed') {
    return task.isCompleted;
  }

  return true;
});

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.isCompleted).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Campus Planner</Text>
      <Text style={styles.subtitle}>Учебные задачи</Text>

<View style={styles.stats}>
  <Text style={styles.stat}>Всего: {totalTasks}</Text>
  <Text style={styles.stat}>Выполнено: {completedTasks}</Text>
</View>

  <TaskForm onAdd={handleAdd} />

  <View style={styles.filterRow}>
  <Pressable
    onPress={() => setFilter('all')}
    style={[
      styles.filterButton,
      filter === 'all' && styles.activeFilter,
    ]}
  >
    <Text>Все</Text>
  </Pressable>

  <Pressable
    onPress={() => setFilter('active')}
    style={[
      styles.filterButton,
      filter === 'active' && styles.activeFilter,
    ]}
  >
    <Text>Активные</Text>
  </Pressable>

  <Pressable
    onPress={() => setFilter('completed')}
    style={[
      styles.filterButton,
      filter === 'completed' && styles.activeFilter,
    ]}
  >
    <Text>Выполненные</Text>
  </Pressable>
</View>

      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>Список пока пуст</Text>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

//стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 18,
  },
  list: {
    paddingBottom: 24,
  },
  empty: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 16,
  },
  stats: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 20,
},
stat: {
  fontSize: 16,
  fontWeight: '600',
},
filterRow: {
  flexDirection: 'row',
  gap: 8,
  marginBottom: 16,
},
filterButton: {
  flex: 1,
  alignItems: 'center',
  padding: 10,
  borderWidth: 1,
  borderRadius: 8,
},
activeFilter: {
  backgroundColor: '#ddd',
},
});