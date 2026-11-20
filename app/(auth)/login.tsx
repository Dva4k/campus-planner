import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Screen from '../../src/components/ui/Screen';
import AppInput from '../../src/components/ui/AppInput';
import AppButton from '../../src/components/ui/AppButton';
import { useAuth } from '../../src/auth/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

export default function LoginScreen() {
  const { theme } = useTheme();
  const palette = colors[theme];
  const { signIn, authError, retrySession } = useAuth();

  const [login, setLogin] = useState(''); 
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [requestError, setRequestError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    const normalizedLogin = login.trim();
    const normalizedPassword = password.trim(); 

    setLoginError(normalizedLogin ? '' : 'Введите логин.'); 
    setPasswordError(normalizedPassword ? '' : 'Введите пароль.');
    setRequestError('');

    if (!normalizedLogin || !normalizedPassword) return;

    setIsSubmitting(true);

    try {
      await signIn({
        login: normalizedLogin,
        password: normalizedPassword,
      });
      setPassword('');
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : 'Не удалось выполнить вход. Попробуйте ещё раз.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={[styles.title, { color: palette.text }]}>
              Campus Planner
            </Text>
            <Text style={[styles.subtitle, { color: palette.secondaryText }]}>
              Войдите, чтобы открыть планировщик задач
            </Text>

            {authError ? (
              <View
                style={[
                  styles.notice,
                  {
                    backgroundColor: palette.surface,
                    borderColor: palette.border,
                  },
                ]}
              >
                <Text style={[styles.errorText, { color: palette.danger }]}>
                  Не удалось проверить сохранённую сессию: {authError}
                </Text>
                <AppButton
                  title="Повторить проверку"
                  variant="secondary"
                  onPress={retrySession}
                  style={styles.retryButton}
                />
              </View>
            ) : null}

            <AppInput
              label="Логин"
              value={login}
              onChangeText={(value) => {
                setLogin(value);
                if (value.trim()) setLoginError('');
              }}
              placeholder="Введите логин"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
              error={loginError}
              returnKeyType="next"
            />

            <AppInput
              label="Пароль"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (value.trim()) setPasswordError('');
              }}
              placeholder="Введите пароль"
              secureTextEntry //скрытие пароля при вводе
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
              error={passwordError}
              returnKeyType="done"
              onSubmitEditing={handleSignIn}
            />

            {requestError ? (
              <Text
                accessibilityRole="alert"
                style={[styles.requestError, { color: palette.danger }]}
              >
                {requestError}
              </Text>
            ) : null}

            <AppButton
              title={isSubmitting ? 'Выполняется вход...' : 'Войти'}
              onPress={handleSignIn}
              disabled={isSubmitting}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
  },
  keyboard: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    width: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    fontSize: 14,
    textAlign: 'center',
  },
  notice: {
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderRadius: 10,
  },
  errorText: {
    fontSize: 13,
    lineHeight: 19,
  },
  retryButton: {
    marginTop: spacing.md,
  },
  requestError: {
    marginBottom: spacing.md,
    fontSize: 13,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
});
