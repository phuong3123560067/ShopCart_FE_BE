import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lưu tạm thông tin vừa gõ vào localStorage để tí nữa Login lấy ra so sánh
        localStorage.setItem('tempUser', JSON.stringify({
            id: "new-user-" + Date.now(),
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName
        }));
        alert('Đăng ký thành công! Mời bạn đăng nhập lại.');
        navigate('/'); 
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '8px',
        border: '1px solid #cbd5e0',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
        marginBottom: '15px'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: '#4a5568',
        fontSize: '14px'
    };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            minHeight: '85vh', backgroundColor: '#f8fafc', fontFamily: 'Segoe UI, sans-serif'
        }}>
            <div style={{
                width: '100%', maxWidth: '450px', padding: '40px',
                backgroundColor: '#ffffff', borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ color: '#1a1a1a', fontSize: '28px', fontWeight: '700', margin: '0' }}>📝 Đăng Ký</h2>
                    <p style={{ color: '#718096', fontSize: '15px', marginTop: '5px' }}>Tạo tài khoản mới để mua sắm</p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#fff5f5', color: '#c53030', padding: '10px',
                        borderRadius: '8px', border: '1px solid #feb2b2',
                        marginBottom: '20px', fontSize: '14px', textAlign: 'center'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label style={labelStyle}>Họ và tên</label>
                    <input 
                        type="text" placeholder="Nguyễn Văn A..." style={inputStyle}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})} required 
                    />

                    <label style={labelStyle}>Email</label>
                    <input 
                        type="email" placeholder="example@gmail.com" style={inputStyle}
                        onChange={(e) => setFormData({...formData, email: e.target.value})} required 
                    />

                    <label style={labelStyle}>Mật khẩu</label>
                    <input 
                        type="password" placeholder="••••••••" style={inputStyle}
                        onChange={(e) => setFormData({...formData, password: e.target.value})} required 
                    />

                    <label style={labelStyle}>Xác nhận mật khẩu</label>
                    <input 
                        type="password" placeholder="••••••••" style={inputStyle}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required 
                    />

                    <button type="submit" style={{
                        width: '100%', padding: '14px', backgroundColor: '#2d3748', // Màu tối hơn để phân biệt với Login
                        color: 'white', border: 'none', borderRadius: '8px',
                        fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginTop: '10px'
                    }}>
                        Tạo tài khoản
                    </button>
                </form>

                <div style={{ marginTop: '25px', textAlign: 'center', borderTop: '1px solid #edf2f7', paddingTop: '20px' }}>
                    <p style={{ color: '#718096', fontSize: '14px' }}>
                        Đã có tài khoản? <span style={{ color: '#3182ce', fontWeight: '600', cursor: 'pointer' }} 
                        onClick={() => navigate('/')}>Đăng nhập</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;