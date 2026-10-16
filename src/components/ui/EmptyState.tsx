import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppButton from './AppButton';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionTitle,
  onAction,
}: EmptyStateProps) {
  const { theme } = useTheme();
  const palette = colors[theme];

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>

      <Text style={[styles.title, { color: palette.text }]}>
        {title}
      </Text>

      <Text
        style={[
          styles.description,
          { color: palette.secondaryText },
        ]}
      >
        {description}
      </Text>

      {actionTitle && onAction ? (
        <AppButton
          title={actionTitle}
          onPress={onAction}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  icon: {
    marginBottom: spacing.md,
    fontSize: 40,
  },
  title: {
    marginBottom: spacing.sm,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    marginBottom: spacing.lg,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});