import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/use-colors';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  const colors = useColors();
  const s = styles(colors);

  return (
    <View style={s.container}>
      <Text style={s.title}>{title}</Text>
      {actionLabel && onAction && (
        <Pressable onPress={onAction}>
          <Text style={s.action}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    title: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.foreground,
    },
    action: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.primary,
    },
  });
