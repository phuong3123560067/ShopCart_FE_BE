import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});
// Bộ chặn (Interceptors) - Rất quan trọng để làm Câu 4 & Câu 6
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp dữ liệu (data) để ở Service không cần gọi .data nữa
    return response.data;
  },
  (error) => {
    // Xử lý lỗi tập trung (Câu 6.2 - Security/Error handling)
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;