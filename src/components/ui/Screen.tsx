import {
  StyleSheet,
  View,
  type ViewProps,
} from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
}

export default function Screen({
  children,
  style,
  ...rest
}: ScreenProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[theme].background },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.screenTop,
    paddingHorizontal: spacing.xl,
  },
});