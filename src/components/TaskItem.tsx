import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Task } from '../types';
import { colors, fontSize, priorityColors, spacing } from '../theme/colors';
import { isOverdue } from '../utils/date';
import Badge from './Badge';

type Props = {
  task: Task;
  onPress: () => void;
  onLongPress: () => void;
  onToggle: () => void;
};

export default function TaskItem({ task, onPress, onLongPress, onToggle }: Props) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Pressable onPress={onToggle} hitSlop={8} style={[styles.checkbox, task.done && styles.checkboxDone]}>
        {task.done && <Text style={styles.check}>✓</Text>}
      </Pressable>

      <View style={styles.info}>
        <Text style={[styles.title, task.done && styles.titleDone]} numberOfLines={1}>
          {task.title}
        </Text>
        <Text style={styles.sub}>
          {task.category} - Hạn: {task.dueDate}
        </Text>
      </View>

      <View style={styles.badges}>
        <Badge label={task.priority} color={priorityColors[task.priority]} />
        {isOverdue(task) && <Badge label="Quá hạn" color={colors.danger} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  pressed: {
    opacity: 0.7,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxDone: {
    backgroundColor: colors.primary,
  },
  check: {
    color: colors.white,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.large,
    fontWeight: '600',
    color: colors.text,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  sub: {
    fontSize: fontSize.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  badges: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
});
