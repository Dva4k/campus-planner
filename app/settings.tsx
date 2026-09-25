import { router } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { useTheme } from '../src/context/ThemeContext';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <View
      style={[
        styles.container,
        isDark && styles.darkContainer,
      ]}
    >
      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text
          style={[
            styles.backText,
            isDark && styles.darkText,
          ]}
        >
          ← Назад
        </Text>
      </Pressable>

      <Text
        style={[
          styles.title,
          isDark && styles.darkText,
        ]}
      >
        Настройки
      </Text>

      <View
        style={[
          styles.card,
          isDark && styles.darkCard,
        ]}
      >
        <View style={styles.settingRow}>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.settingTitle,
                isDark && styles.darkText,
              ]}
            >
              Тёмная тема
            </Text>

            <Text
              style={[
                styles.description,
                isDark && styles.darkSecondaryText,
              ]}
            >
              Использовать тёмное оформление приложения
            </Text>
          </View>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F5F7FB',
  },

  darkContainer: {
    backgroundColor: '#111827',
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },

  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4F46E5',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#172033',
  },

  card: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },

  darkCard: {
    backgroundColor: '#1F2937',
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  textContainer: {
    flex: 1,
    marginRight: 16,
  },

  settingTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#172033',
  },

  description: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    color: '#718096',
  },

  darkText: {
    color: '#F9FAFB',
  },

  darkSecondaryText: {
    color: '#9CA3AF',
  },
});