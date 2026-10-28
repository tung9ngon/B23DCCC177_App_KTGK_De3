import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useTasks } from '../context/TaskContext';
import { daysLeftText, isOverdue } from '../utils/date';
import { colors, fontSize, priorityColors, spacing } from '../theme/colors';
import Badge from '../components/Badge';
import AppButton from '../components/AppButton';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export default function TaskDetailScreen({ navigation, route }: Props) {
  const { tasks, toggleDone } = useTasks();
  const task = tasks.find(t => t.id === route.params.id);

  if (!task) {
    return <Text style={styles.notFound}>Không tìm thấy công việc</Text>;
  }

  const overdue = isOverdue(task);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={[styles.title, task.done && styles.titleDone]}>{task.title}</Text>

          <View style={styles.badges}>
            <Badge label={task.priority} color={priorityColors[task.priority]} />
            {overdue && <Badge label="Quá hạn" color={colors.danger} />}
          </View>

          <Row label="Danh mục" value={task.category} />
          <Row label="Hạn hoàn thành" value={task.dueDate} />
          <Row label="Trạng thái" value={task.done ? 'Đã hoàn thành' : 'Chưa hoàn thành'} />
          <Row label="Ghi chú" value={task.note || '(Không có)'} />

          {!task.done && (
            <Text style={[styles.daysLeft, overdue && styles.overdueText]}>
              {daysLeftText(task.dueDate)}
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton title="Sửa" onPress={() => navigation.navigate('TaskForm', { id: task.id })} />
        <View style={styles.gap} />
        <AppButton
          title={task.done ? 'Chưa hoàn thành' : 'Đánh dấu hoàn thành'}
          color={task.done ? colors.warning : colors.success}
          onPress={() => toggleDone(task.id)}
        />
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: 'bold',
    color: colors.text,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  badges: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    marginLeft: -spacing.xs,
  },
  row: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  label: {
    fontSize: fontSize.small,
    color: colors.textSecondary,
  },
  value: {
    fontSize: fontSize.normal,
    color: colors.text,
    marginTop: 2,
  },
  daysLeft: {
    fontSize: fontSize.large,
    fontWeight: '600',
    color: colors.primary,
    marginTop: spacing.md,
  },
  overdueText: {
    color: colors.danger,
  },
  notFound: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
  },
  gap: {
    width: spacing.sm,
  },
});
