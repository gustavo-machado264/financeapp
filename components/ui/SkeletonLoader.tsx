import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useColors } from '@/hooks/use-colors';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
  const colors = useColors();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 600, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SkeletonTransactionItem() {
  const colors = useColors();
  return (
    <View style={[skeletonStyles.txItem, { backgroundColor: colors.surface }]}>
      <Skeleton width={44} height={44} borderRadius={12} />
      <View style={skeletonStyles.txInfo}>
        <Skeleton width="60%" height={14} borderRadius={7} style={{ marginBottom: 6 }} />
        <Skeleton width="40%" height={11} borderRadius={5} />
      </View>
      <Skeleton width={70} height={14} borderRadius={7} />
    </View>
  );
}

export function SkeletonCard({ height = 120 }: { height?: number }) {
  const colors = useColors();
  return (
    <View style={[skeletonStyles.card, { backgroundColor: colors.surface, height }]}>
      <Skeleton width="50%" height={14} borderRadius={7} style={{ marginBottom: 12 }} />
      <Skeleton width="80%" height={28} borderRadius={8} style={{ marginBottom: 8 }} />
      <Skeleton width="40%" height={12} borderRadius={6} />
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  txInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
});
