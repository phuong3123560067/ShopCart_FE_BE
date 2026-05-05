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
            // Sau khi login xong, chuyển về giỏ hàng
            navigate('/cart'); 
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '85vh',
            backgroundColor: '#f8fafc',
            fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '420px',
                padding: '40px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0'
            }}>
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{ color: '#1a1a1a', fontSize: '28px', fontWeight: '700', margin: '0 0 10px' }}>
                        🔑 Đăng Nhập
                    </h2>
                    <p style={{ color: '#718096', margin: 0, fontSize: '15px' }}>
                        Dành cho hệ thống quản lý giỏ hàng
                    </p>
                </div>

                {/* Thông báo lỗi nếu đăng nhập sai */}
                {error && (
                    <div style={{
                        backgroundColor: '#fff5f5',
                        color: '#c53030',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #feb2b2',
                        marginBottom: '20px',
                        fontSize: '14px',
                        textAlign: 'center',
                        fontWeight: '500'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Input Email */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
                            Email người dùng
                        </label>
                        <input
                            type="email"
                            placeholder="Nhập email (VD: test@gmail.com)..."
                            style={{
                                width: '100%',
                                padding: '12px 15px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e0',
                                fontSize: '15px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Input Password */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '12px 15px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e0',
                                fontSize: '15px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Nút bấm giống style ở CheckoutPage */}
                    <button type="submit" style={{
                        width: '100%',
                        padding: '14px',
                        backgroundColor: '#3182ce',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(49, 130, 206, 0.3)',
                        transition: 'background 0.2s'
                    }}>
                        Xác nhận vào hệ thống
                    </button>
                </form>

                {/* Chuyển hướng sang Register */}
                <div style={{
                    marginTop: '25px',
                    textAlign: 'center',
                    borderTop: '1px solid #edf2f7',
                    paddingTop: '20px'
                }}>
                    <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>
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