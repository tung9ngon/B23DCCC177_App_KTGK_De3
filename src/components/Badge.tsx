import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, fontSize, spacing } from '../theme/colors';

export default function Badge({ label, color }: { label: string; color: string }) {
  return <Text style={[styles.badge, { backgroundColor: color }]}>{label}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    color: colors.white,
    fontSize: fontSize.small,
    fontWeight: '600',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
    marginLeft: spacing.xs,
  },
});
