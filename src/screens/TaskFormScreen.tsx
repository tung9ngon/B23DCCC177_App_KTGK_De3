import React, { useLayoutEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CATEGORIES, PRIORITIES, RootStackParamList } from '../types';
import { useTasks } from '../context/TaskContext';
import { formatDate, maskDateInput, parseDate, today } from '../utils/date';
import { colors, fontSize, spacing } from '../theme/colors';
import Chip from '../components/Chip';
import AppButton from '../components/AppButton';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskForm'>;

export default function TaskFormScreen({ navigation, route }: Props) {
  const { tasks, addTask, updateTask } = useTasks();
  const editing = tasks.find(t => t.id === route.params.id);

  const [title, setTitle] = useState(editing?.title ?? '');
  const [note, setNote] = useState(editing?.note ?? '');
  const [category, setCategory] = useState(editing?.category ?? CATEGORIES[0]);
  const [priority, setPriority] = useState(editing?.priority ?? 'Trung bình');
  const [dueDate, setDueDate] = useState(editing?.dueDate ?? formatDate(today()));
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});

  useLayoutEffect(() => {
    navigation.setOptions({ title: editing ? 'Sửa công việc' : 'Thêm công việc' });
  }, [navigation, editing]);

  const validate = () => {
    const e: { title?: string; dueDate?: string } = {};

    if (title.trim() === '') {
      e.title = 'Tên công việc không được để trống';
    } else if (title.trim().length > 50) {
      e.title = 'Tên công việc tối đa 50 ký tự';
    }

    const date = parseDate(dueDate);
    if (!date) {
      e.dueDate = 'Hạn phải đúng định dạng dd/mm/yyyy và là ngày có thật';
    } else if (!editing && date < today()) {
      e.dueDate = 'Hạn không được trước ngày hôm nay';
    }
    return e;
  };

  const onSave = () => {
    const e = validate();
    setErrors(e);
    if (e.title || e.dueDate) {
      return;
    }
    const data = { title: title.trim(), note: note.trim(), category, priority, dueDate };
    if (editing) {
      updateTask({ ...editing, ...data });
    } else {
      addTask(data);
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Tên công việc *</Text>
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          value={title}
          onChangeText={setTitle}
          placeholder="VD: Ôn tập môn Mobile"
          placeholderTextColor={colors.textSecondary}
        />
        <Text style={styles.counter}>{title.trim().length}/50</Text>
        {errors.title && <Text style={styles.error}>{errors.title}</Text>}

        <Text style={styles.label}>Ghi chú</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={note}
          onChangeText={setNote}
          placeholder="Không bắt buộc"
          placeholderTextColor={colors.textSecondary}
          multiline
        />

        <Text style={styles.label}>Danh mục</Text>
        <View style={styles.row}>
          {CATEGORIES.map(c => (
            <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
          ))}
        </View>

        <Text style={styles.label}>Mức ưu tiên</Text>
        <View style={styles.row}>
          {PRIORITIES.map(p => (
            <Chip key={p} label={p} selected={priority === p} onPress={() => setPriority(p)} />
          ))}
        </View>

        <Text style={styles.label}>Hạn hoàn thành (dd/mm/yyyy) *</Text>
        <TextInput
          style={[styles.input, errors.dueDate && styles.inputError]}
          value={dueDate}
          onChangeText={text => setDueDate(maskDateInput(text))}
          placeholder="dd/mm/yyyy"
          placeholderTextColor={colors.textSecondary}
          keyboardType="number-pad"
          maxLength={10}
        />
        {errors.dueDate && <Text style={styles.error}>{errors.dueDate}</Text>}

        <View style={styles.saveRow}>
          <AppButton title={editing ? 'Lưu thay đổi' : 'Thêm công việc'} onPress={onSave} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  label: {
    fontSize: fontSize.normal,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.normal,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  counter: {
    alignSelf: 'flex-end',
    fontSize: fontSize.small,
    color: colors.textSecondary,
  },
  error: {
    color: colors.danger,
    fontSize: fontSize.small,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  saveRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
});
