import { View, Text, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColors } from '@/hooks/use-colors';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = 'inbox', title, description, actionLabel, onAction }: EmptyStateProps) {
  const colors = useColors();
  const s = styles(colors);

  return (
    <View style={s.container}>
      <View style={s.iconContainer}>
        <MaterialIcons name={icon as any} size={48} color={colors.muted} />
      </View>
      <Text style={s.title}>{title}</Text>
      {description && <Text style={s.description}>{description}</Text>}
      {actionLabel && onAction && (
        <Pressable
          style={({ pressed }) => [s.actionButton, pressed && s.pressed]}
          onPress={onAction}
        >
          <Text style={s.actionText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: 48,
      paddingHorizontal: 32,
    },
    iconContainer: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: colors.surface2,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.foreground,
      marginBottom: 8,
      textAlign: 'center',
    },
    description: {
      fontSize: 14,
      color: colors.muted,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 24,
    },
    actionButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 999,
    },
    actionText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    pressed: {
      opacity: 0.8,
      transform: [{ scale: 0.97 }],
    },
  });
