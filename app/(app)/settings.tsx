import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import Screen from '../../src/components/ui/Screen';
import AppButton from '../../src/components/ui/AppButton';
import { useAuth } from '../../src/auth/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const palette = colors[theme];
  const isDark = theme === 'dark';

  return (
    <Screen>
      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}
        accessibilityRole="button"
      >
        <Text style={[styles.backText, { color: palette.primary }]}>
          ← Назад
        </Text>
      </Pressable>

      <Text style={[styles.title, { color: palette.text }]}>
        Настройки
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
          },
        ]}
      >
        <View style={styles.settingRow}>
          <View style={styles.textContainer}>
            <Text style={[styles.settingTitle, { color: palette.text }]}>
              Тёмная тема
            </Text>

            <Text
              style={[
                styles.description,
                { color: palette.secondaryText },
              ]}
            >
              Использовать тёмное оформление приложения
            </Text>
          </View>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{
              false: palette.muted,
              true: palette.primary,
            }}
          />
        </View>
      </View>

      {user ? (
        <View
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}
        >
          <Text style={[styles.settingTitle, { color: palette.text }]}>
            Аккаунт
          </Text>
          <Text style={[styles.description, { color: palette.secondaryText }]}>
            {user.name} · {user.login}
          </Text>
        </View>
      ) : null}

      <AppButton
        title="Выйти"
        onPress={() => {
          Alert.alert(
            'Выйти из аккаунта?',
            'Сохранённая сессия будет удалена с устройства.',
            [
              { text: 'Отмена', style: 'cancel' },
              {
                text: 'Выйти',
                style: 'destructive',
                onPress: () => {
                  void signOut();
                },
              },
            ],
          );
        }}
        style={styles.logoutButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.xl,
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  card: {
    marginTop: spacing.xl,
    padding: spacing.xl,
    borderRadius: 16,
    borderWidth: 1,
  },
  logoutButton: {
    marginTop: spacing.xl,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.lg,
  },
  settingTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  description: {
    marginTop: spacing.xs,
    fontSize: 13,
    lineHeight: 19,
  },
});
