import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password);
        if (result.success) {
            // Xóa temp_user theo snake_case nếu có
            localStorage.removeItem('temp_user'); 
            navigate('/cart'); 
        } else {
            setError(result.message);
        }
    };

    return (
        // ... (Phần CSS giữ nguyên như cũ của bạn)
        <div style={{ /* style cũ */ }}>
            <div style={{ /* style cũ */ }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{ color: '#1a1a1a', fontSize: '28px', fontWeight: '700', margin: '0 0 10px' }}>
                        🔑 Đăng Nhập
                    </h2>
                </div>

                {error && (
                    <div style={{ /* style báo lỗi */ }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
                            Email người dùng
                        </label>
                        <input
                            type="email"
                            placeholder="Nhập email (VD: test@gmail.com)..."
                            style={{ width: '100%', padding: '12px', boxSizing: 'border-box' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            style={{ width: '100%', padding: '12px', boxSizing: 'border-box' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" style={{ /* style button cũ */ }}>
                        Xác nhận vào hệ thống
                    </button>
                </form>

                <div style={{ marginTop: '25px', textAlign: 'center' }}>
                    <p style={{ color: '#718096', fontSize: '14px' }}>
                        Chưa có tài khoản?{' '}
                        <span 
                            style={{ color: '#3182ce', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => navigate('/register')}
                        >
                            Đăng ký ngay
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;