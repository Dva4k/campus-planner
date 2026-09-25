import { Stack } from 'expo-router';

import { TaskProvider } from '../src/context/TaskContext';
import { ThemeProvider } from '../src/context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </TaskProvider>
    </ThemeProvider>
  );
}