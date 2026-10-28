import { Task } from '../types';
import { formatDate, today } from '../utils/date';

function afterDays(n: number): string {
  const d = today();
  d.setDate(d.getDate() + n);
  return formatDate(d);
}

export function createSampleTasks(): Task[] {
  return [
    { id: '1', title: 'Ôn tập môn Mobile', note: 'Xem lại FlatList, Navigation', category: 'Học tập', priority: 'Cao', dueDate: afterDays(3), done: false },
    { id: '2', title: 'Nộp báo cáo thực tập', note: '', category: 'Công việc', priority: 'Cao', dueDate: afterDays(-2), done: false },
    { id: '3', title: 'Chạy bộ 30 phút', note: 'Công viên gần nhà', category: 'Sức khoẻ', priority: 'Thấp', dueDate: afterDays(0), done: false },
    { id: '4', title: 'Mua quà sinh nhật mẹ', note: '', category: 'Cá nhân', priority: 'Trung bình', dueDate: afterDays(5), done: false },
    { id: '5', title: 'Làm bài tập CSDL', note: 'Chương 3', category: 'Học tập', priority: 'Trung bình', dueDate: afterDays(-1), done: true },
    { id: '6', title: 'Đi khám răng', note: '', category: 'Sức khoẻ', priority: 'Thấp', dueDate: afterDays(7), done: true },
  ];
}
