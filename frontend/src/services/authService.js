import { USERS } from '../tests/mockData/cart.mock';

export const login = async (email, password) => {
    const { USERS } = await import('../tests/mockData/cart.mock');
    const registeredUser = JSON.parse(localStorage.getItem('temp_user'));

    // Tìm user khớp email và password
    const user = USERS.find(u => u.email === email && u.password === password) 
                 || (registeredUser?.email === email && registeredUser?.password === password ? registeredUser : null);
    
    if (user) {
        // Đảm bảo object lưu xuống có các key như user_id, full_name[cite: 11]
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