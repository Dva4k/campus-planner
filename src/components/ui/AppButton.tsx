import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
} from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type ButtonVariant = 'primary' | 'secondary';

interface AppButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: PressableProps['style'];
}

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  ...rest
}: AppButtonProps) {
  const { theme } = useTheme();
  const palette = colors[theme];
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isPrimary
            ? palette.primary
            : palette.primaryLight,
          borderColor: palette.primary,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      {...rest}
    >
      <Text
        style={[
          styles.title,
          {
            color: isPrimary ? '#FFFFFF' : palette.primary,
          },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
});