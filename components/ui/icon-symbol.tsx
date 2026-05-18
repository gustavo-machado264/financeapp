import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  // Navigation
  'house.fill': 'home',
  'list.bullet': 'list',
  'target': 'flag',
  'person.fill': 'person',
  'gearshape.fill': 'settings',
  // Actions
  'plus': 'add',
  'plus.circle.fill': 'add-circle',
  'pencil': 'edit',
  'trash': 'delete',
  'magnifyingglass': 'search',
  'xmark': 'close',
  'xmark.circle.fill': 'cancel',
  'checkmark': 'check',
  'checkmark.circle.fill': 'check-circle',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'chevron.down': 'expand-more',
  'chevron.up': 'expand-less',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  // Finance
  'dollarsign.circle.fill': 'attach-money',
  'arrow.up.circle.fill': 'arrow-upward',
  'arrow.down.circle.fill': 'arrow-downward',
  'chart.bar.fill': 'bar-chart',
  'chart.pie.fill': 'pie-chart',
  'chart.line.uptrend.xyaxis': 'trending-up',
  'banknote.fill': 'account-balance-wallet',
  'creditcard.fill': 'credit-card',
  // Categories
  'fork.knife': 'restaurant',
  'car.fill': 'directions-car',
  'house.fill.badge': 'home',
  'book.fill': 'school',
  'heart.fill': 'favorite',
  'gamecontroller.fill': 'sports-esports',
  'laptopcomputer': 'laptop',
  'arrow.up.right.circle.fill': 'trending-up',
  // UI
  'bell.fill': 'notifications',
  'eye.fill': 'visibility',
  'eye.slash.fill': 'visibility-off',
  'lock.fill': 'lock',
  'moon.fill': 'dark-mode',
  'sun.max.fill': 'light-mode',
  'arrow.right.square.fill': 'logout',
  'square.and.arrow.up': 'share',
  'info.circle.fill': 'info',
  'exclamationmark.triangle.fill': 'warning',
  'lightbulb.fill': 'lightbulb',
  'star.fill': 'star',
  'calendar': 'calendar-today',
  'tag.fill': 'label',
  'doc.text.fill': 'description',
  'arrow.clockwise': 'refresh',
  'ellipsis': 'more-horiz',
  'ellipsis.circle': 'more-vert',
  'flag.fill': 'flag',
  'trophy.fill': 'emoji-events',
  'savings': 'savings',
} as unknown as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}

export type { IconSymbolName };
