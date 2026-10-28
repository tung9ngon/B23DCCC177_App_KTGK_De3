export type Task = {
  id: string;
  title: string;
  note: string;
  category: string;
  priority: string;
  dueDate: string;
  done: boolean;
};

export const CATEGORIES = ['Học tập', 'Công việc', 'Sức khoẻ', 'Cá nhân'];
export const PRIORITIES = ['Cao', 'Trung bình', 'Thấp'];

export type RootStackParamList = {
  TaskList: undefined;
  TaskForm: { id?: string };
  TaskDetail: { id: string };
};
