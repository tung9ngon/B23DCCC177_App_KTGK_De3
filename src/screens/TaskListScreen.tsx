import React, { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PRIORITIES, RootStackParamList, Task } from '../types';
import { useTasks } from '../context/TaskContext';
import { isOverdue, parseDate } from '../utils/date';
import { removeAccents } from '../utils/text';
import { colors, fontSize, spacing } from '../theme/colors';
import TaskItem from '../components/TaskItem';
import ProgressBar from '../components/ProgressBar';
import Chip from '../components/Chip';
import AppButton from '../components/AppButton';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

const FILTERS = ['Tất cả', 'Chưa xong', 'Đã xong', 'Quá hạn'];

export default function TaskListScreen({ navigation }: Props) {
  const { tasks, toggleDone, deleteTask, deleteDoneTasks } = useTasks();
  const [filter, setFilter] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');

  const doneCount = tasks.filter(t => t.done).length;

  let list = tasks.filter(t => {
    if (filter === 'Chưa xong') return !t.done;
    if (filter === 'Đã xong') return t.done;
    if (filter === 'Quá hạn') return isOverdue(t);
    return true;
  });

  const keyword = removeAccents(search.trim());
  list = list.filter(t => removeAccents(t.title).includes(keyword));

  list = [...list].sort((a, b) => {
    if (sortBy === 'date') {
      return parseDate(a.dueDate)!.getTime() - parseDate(b.dueDate)!.getTime();
    }
    return PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority);
  });

  const confirmDelete = (task: Task) => {
    Alert.alert('Xoá công việc', `Bạn có chắc muốn xoá "${task.title}"?`, [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: () => deleteTask(task.id) },
    ]);
  };

  const confirmDeleteDone = () => {
    Alert.alert('Xoá việc đã hoàn thành', `Sẽ xoá ${doneCount} công việc đã hoàn thành. Tiếp tục?`, [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: deleteDoneTasks },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.header}>
        <ProgressBar done={doneCount} total={tasks.length} />

        <TextInput
          style={styles.search}
          placeholder="Tìm theo tên công việc..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.row}>
          {FILTERS.map(f => (
            <Chip key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
          ))}
        </View>

        <Pressable
          onPress={() => setSortBy(sortBy === 'date' ? 'priority' : 'date')}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Text style={styles.sort}>
            Sắp xếp: {sortBy === 'date' ? 'Hạn gần nhất' : 'Ưu tiên cao nhất'}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={list}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onPress={() => navigation.navigate('TaskDetail', { id: item.id })}
            onLongPress={() => confirmDelete(item)}
            onToggle={() => toggleDone(item.id)}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Không có công việc nào</Text>}
      />

      <View style={styles.footer}>
        <AppButton title="+ Thêm việc" onPress={() => navigation.navigate('TaskForm', {})} />
        <View style={styles.gap} />
        <AppButton
          title="Xoá việc đã hoàn thành"
          color={colors.danger}
          disabled={doneCount === 0}
          onPress={confirmDeleteDone}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: 0,
  },
  search: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.normal,
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sort: {
    color: colors.primary,
    fontSize: fontSize.normal,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.5,
  },
  list: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    flexGrow: 1,
  },
  empty: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: fontSize.normal,
    marginTop: 40,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
  gap: {
    width: spacing.sm,
  },
});
