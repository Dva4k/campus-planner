import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  loadTheme,
  saveTheme,
} from '../storage/themeStorage';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    const restoreTheme = async () => {
      const savedTheme = await loadTheme();

      if (savedTheme) {
        setTheme(savedTheme);
      }
    };

    restoreTheme(); //восстановление темы при запуске приложения
  }, []); //один раз при появлении компонента

  const toggleTheme = () => {//переключение темы между светлой и темной
    setTheme((currentTheme) => {
      const newTheme =
        currentTheme === 'light' ? 'dark' : 'light';

      saveTheme(newTheme);//сохранение выбранной темы в AsyncStorage

      return newTheme; 
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
}