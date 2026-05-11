import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,          // Giả lập 50 người dùng
  duration: '30s',  // Chạy trong 30 giây
};

export default function () {
  const url = 'http://localhost:3000/api/cart/add';

  const payload = JSON.stringify({
    productId: 1, // Đảm bảo trong DB có sản phẩm ID = 1
    quantity: 1
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      // 2. Thay Token thật lấy từ Postman vào đây
      'Authorization': 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX0NVU1RPTUVSIiwiaWF0IjoxNzc4NDc5ODA2LCJleHAiOjE3Nzg0ODM0MDZ9.XqI4-GNYT_Q2yOXcOueY090MKFpjgOZ2wCS4k9gOmx0iWq_OpaUvTxty0UHG2yBz',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}