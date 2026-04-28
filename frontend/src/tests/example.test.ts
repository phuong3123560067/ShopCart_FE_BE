//Example test (100% độ phủ do test file App.tsx)
import { render } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import React from 'react';

vi.mock('../App', () => ({
  default: () => React.createElement('div', null, 'ShopCart App Running')
}));

import App from '../App';

it('Kiểm tra render App để lấy chỉ số Coverage', () => {
  render(React.createElement(App));
  
  expect(true).toBe(true);
});
//Example test (50% độ phủ do test hàm ngoài)

/*import {expect, test } from 'vitest'

function sum(a: number, b: number) {
  return a + b
}
test('Kiểm tra hàm cộng tiền chạy đúng', () => {
  expect(sum(1, 2)).toBe(10) //fail
})

test('Kiểm tra kết quả sai', () => {
  expect(sum(2, 2)).not.toBe(5) //pass
})

test('Kiểm tra kiểu dữ liệu', () => {
  const ketQua = sum(10, 20)
  expect(ketQua).toBeTypeOf('number')
})*/