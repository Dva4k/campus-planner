import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ThemeMode } from '../context/ThemeContext';

const THEME_KEY = '@campus_planner_theme';//ключ для хранения темы в AsyncStorage

export async function saveTheme(theme: ThemeMode) {
  await AsyncStorage.setItem(THEME_KEY, theme);
}//сохранение выбранной темы в AsyncStorage

export async function loadTheme(): Promise<ThemeMode | null> {
  const savedTheme = await AsyncStorage.getItem(THEME_KEY);//получение сохраненной темы из AsyncStorage

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return null;
}