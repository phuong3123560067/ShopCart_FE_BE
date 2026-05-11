import http from 'k6/http';

export default function () {
  let tokens = [];

  // 1. Chỉ login 1 user duy nhất có sẵn (ví dụ user@gmail.com)
  let res = http.post('http://localhost:3000/api/auth/login', JSON.stringify({
    email: 'user@gmail.com', // User này phải có sẵn trong data.sql
    password: 'user123'
  }), { headers: { 'Content-Type': 'application/json' } });

  if (res.status === 200) {
    const token = res.json().token || res.json().jwt || res.json().accessToken;

    // 2. Nhân bản token đó thành 50 cái để đánh lừa k6
    for (let i = 0; i < 50; i++) {
      tokens.push(token);
    }
    console.log("--- COPY MẢNG TOKEN DƯỚI ĐÂY ---");
    console.log(JSON.stringify(tokens));
  } else {
    console.log("Login thất bại! Hãy chắc chắn user@gmail.com tồn tại.");
  }
}