import { USERS } from '../tests/mockData/cart.mock';

export const login = async (email, password) => {
    // 1. Lấy danh sách user từ Mock Data
    const { USERS } = await import('../tests/mockData/cart.mock');
    
    // 2. Kiểm tra xem có user nào "mới đăng ký" đang nằm trong localStorage không
    const registeredUser = JSON.parse(localStorage.getItem('tempUser'));

    // 3. Tìm kiếm
    const user = USERS.find(u => u.email === email && u.password === password) 
                 || (registeredUser?.email === email && registeredUser?.password === password ? registeredUser : null);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
    }
    return { success: false, message: "Tài khoản hoặc mật khẩu không đúng" };
};

export const logout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login'; // Đẩy về trang login
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
};