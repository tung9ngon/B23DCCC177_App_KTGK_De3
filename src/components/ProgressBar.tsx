import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '../theme/colors';

type Props = {
  done: number;
  total: number;
};

export default function ProgressBar({ done, total }: Props) {
  const percent = total === 0 ? 0 : (done / total) * 100;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Đã hoàn thành {done}/{total} công việc
      </Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  text: {
    fontSize: fontSize.normal,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.success,
  },
});
