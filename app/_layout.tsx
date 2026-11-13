
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { TasksProvider } from '../src/context/TaskContext';
import { ThemeProvider } from '../src/context/ThemeContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <TasksProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </TasksProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
