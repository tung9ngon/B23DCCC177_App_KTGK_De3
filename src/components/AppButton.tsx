import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontSize, spacing } from '../theme/colors';

type Props = {
  title: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
};

export default function AppButton({ title, onPress, color = colors.primary, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: disabled ? colors.disabled : color },
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    color: colors.white,
    fontSize: fontSize.normal,
    fontWeight: '600',
  },
});
