import { Task } from '../types';

export function parseDate(text: string): Date | null {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(text)) {
    return null;
  }
  const [d, m, y] = text.split('/').map(Number);
  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }
  return date;
}

export function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${d}/${m}/${date.getFullYear()}`;
}

export function today(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function daysLeft(dueDate: string): number {
  const due = parseDate(dueDate);
  if (!due) {
    return 0;
  }
  return Math.round((due.getTime() - today().getTime()) / 86400000);
}

export function isOverdue(task: Task): boolean {
  return !task.done && daysLeft(task.dueDate) < 0;
}

export function daysLeftText(dueDate: string): string {
  const n = daysLeft(dueDate);
  if (n > 0) {
    return `Còn ${n} ngày`;
  }
  if (n === 0) {
    return 'Hạn hôm nay';
  }
  return `Quá hạn ${-n} ngày`;
}

export function maskDateInput(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}
