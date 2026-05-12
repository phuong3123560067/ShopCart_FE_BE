import http from 'k6/http';
import { check } from 'k6';

export default function () {
  const url = 'http://localhost:3000/api/orders';

  // --- Case 1: IDOR (Dùng Token User này đặt hàng cho User kia) ---
  const userToken = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX0NVU1RPTUVSIiwiaWF0IjoxNzc4NTA0MzY4LCJleHAiOjE3Nzg1MDc5Njh9.FFxiRweQ_mgXYsc5EViXoZW0q1vRXTKTr6IEiX4g0os8ekL_cigyUBpWUy8uEbAA";
  const resIdor = http.post(url, JSON.stringify({ userId: 999 }), {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` }
  });

  // --- Case 2: Phân quyền API (Dùng Token Admin đi đặt hàng) ---
  const adminToken = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbkBzaG9wY2FydC5jb20iLCJyb2xlIjoiUk9MRV9BRE1JTiIsImlhdCI6MTc3ODUwNDU4NCwiZXhwIjoxNzc4NTA4MTg0fQ.HQuOWZb5RH3-QBoMKznLyszhguqYy8v1pNQ803e7F9yrYgZ-xPxoZ50kJ9YEomHn";
  const resAdmin = http.post(url, JSON.stringify({ userId: 1 }), {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }
  });

  check(resIdor, { 'TC-SEC-01 (IDOR): Phải bị chặn': (r) => r.status === 401 || r.status === 403 });
  check(resAdmin, { 'TC-SEC-02 (Kiểm tra phân quyền API): Trả về 403': (r) => r.status === 403 });
}