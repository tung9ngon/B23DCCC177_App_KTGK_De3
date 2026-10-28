import {
  daysLeftText,
  formatDate,
  maskDateInput,
  parseDate,
  today,
} from '../src/utils/date';

function afterDays(n: number) {
  const d = today();
  d.setDate(d.getDate() + n);
  return formatDate(d);
}

test('parseDate bắt sai định dạng và ngày không có thật', () => {
  expect(parseDate('28/02/2026')).not.toBeNull();
  expect(parseDate('29/02/2028')).not.toBeNull();
  expect(parseDate('31/02/2026')).toBeNull();
  expect(parseDate('29/02/2026')).toBeNull();
  expect(parseDate('1/2/2026')).toBeNull();
  expect(parseDate('abc')).toBeNull();
});

test('daysLeftText', () => {
  expect(daysLeftText(afterDays(3))).toBe('Còn 3 ngày');
  expect(daysLeftText(afterDays(0))).toBe('Hạn hôm nay');
  expect(daysLeftText(afterDays(-2))).toBe('Quá hạn 2 ngày');
});

test('maskDateInput tự chèn dấu /', () => {
  expect(maskDateInput('01032026')).toBe('01/03/2026');
  expect(maskDateInput('0103')).toBe('01/03');
});
