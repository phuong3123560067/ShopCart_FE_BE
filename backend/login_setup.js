import http from 'k6/http';

export const options = {
    vus: 1,
    iterations: 1,
};

export default function () {
    let allTokens = [];

    console.log("Đang khởi tạo đăng nhập cho 50 users...");

    for (let i = 1; i <= 50; i++) {
        const res = http.post('http://localhost:3000/api/auth/login', JSON.stringify({
            email: `user${i}@gmail.com`,
            password: 'user123'
        }), {
            headers: { 'Content-Type': 'application/json' },
            tags: { name: 'LoginCall' }
        });

        if (res.status === 200) {
            const token = res.json().token || res.json().jwt || res.json().accessToken;
            allTokens.push(token);
        }
    }

    console.log("\n================ DANH SÁCH TOKEN GỘP (COPY TỪ DẤU [ ĐẾN ] ) ================");
    console.log(JSON.stringify(allTokens));
    console.log("============================================================================\n");

    console.log(`Đã lấy thành công: ${allTokens.length}/50 tokens.`);
}