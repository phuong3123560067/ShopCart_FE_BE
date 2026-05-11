import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '30s',
};

export default function () {
  const loginUrl = 'http://localhost:3000/api/auth/login';
  const loginPayload = JSON.stringify({
    email: `user${__VU}@gmail.com`,
    password: "user123",
  });

  const loginRes = http.post(loginUrl, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  const loginOk = check(loginRes, {
    'Login successful': (r) => r.status === 200 || r.status === 201,
  });

  if (!loginOk) return;

  const token = loginRes.json('token');
  const currentUserId = __VU + 2;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };


  const addRes = http.post('http://localhost:3000/api/cart/add', JSON.stringify({
    productId: 1,
    quantity: 1
  }), { headers });

  const addOk = check(addRes, {
    'Added to cart': (r) => r.status === 200 || r.status === 201,
  });


  if (addOk) {
    const orderPayload = JSON.stringify({
      userId: currentUserId,
      shippingAddress: "97 Võ Văn Tần, Quận 3, TP.HCM",
      phoneNumber: "0901234567"
    });

    const orderRes = http.post('http://localhost:3000/api/orders', orderPayload, { headers });

    check(orderRes, {
      'Order created (201)': (r) => r.status === 201,
    });
  }

  sleep(1);
}