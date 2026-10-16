import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface AppInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function AppInput({
  label,
  error,
  style,
  ...rest
}: AppInputProps) {
  const { theme } = useTheme();
  const palette = colors[theme];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: palette.text }]}>
        {label}
      </Text>

      <TextInput
        {...rest}
        accessibilityLabel={label}
        placeholderTextColor={palette.secondaryText}
        style={[
          styles.input,
          {
            color: palette.text,
            backgroundColor: palette.surface,
            borderColor: error
              ? palette.danger
              : palette.inputBorder,
          },
          style,
        ]}
      />

      {error ? (
        <Text
          accessibilityRole="alert"
          style={[styles.error, { color: palette.danger }]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.sm,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    minHeight: 48,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
  },
  error: {
    marginTop: spacing.xs,
    fontSize: 13,
  },
});