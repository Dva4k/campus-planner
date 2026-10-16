
import { Stack } from 'expo-router';

import { TasksProvider } from '../src/context/TaskContext';
import { ThemeProvider } from '../src/context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TasksProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </TasksProvider>
    </ThemeProvider>
  );
}
