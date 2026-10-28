import { removeAccents } from '../src/utils/text';

test('removeAccents cho phép tìm không dấu', () => {
  expect(removeAccents('ÔN tập môn mobile')).toBe('on tap mon mobile');
  expect(removeAccents('Đi chợ')).toBe('di cho');
  expect(removeAccents('ÔN tập môn mobile').includes(removeAccents('on'))).toBe(true);
  expect(removeAccents('ÔN tập môn mobile').includes(removeAccents('ôn'))).toBe(true);
});
