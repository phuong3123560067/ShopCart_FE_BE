import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderId = location.state?.orderId;

    return (
        <div style={{ 
            maxWidth: '600px', 
            margin: '60px auto', 
            textAlign: 'center', 
            padding: '50px 30px', 
            backgroundColor: '#fff',
            borderRadius: '20px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
            fontFamily: "'Segoe UI', Roboto, sans-serif"
        }}>
            {/* Icon thành công dạng vòng tròn */}
            <div style={{ 
                width: '80px', 
                height: '80px', 
                backgroundColor: '#f0fff4', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 25px',
                color: '#38a169',
                fontSize: '40px',
                border: '2px solid #38a169'
            }}>
                ✓
            </div>

            <h2 style={{ color: '#1a202c', marginBottom: '10px', fontSize: '28px', fontWeight: '700' }}>
                Đặt Hàng Thành Công!
            </h2>
            <p style={{ color: '#718096', fontSize: '16px', marginBottom: '30px' }}>
                Cảm ơn bạn đã tin tưởng lựa chọn sản phẩm công nghệ của chúng tôi.
            </p>

            {/* Box mã đơn hàng */}
            {orderId ? (
                <div style={{ 
                    backgroundColor: '#f7fafc', 
                    padding: '20px', 
                    borderRadius: '12px', 
                    border: '1px dashed #cbd5e0',
                    marginBottom: '35px'
                }}>
                    <span style={{ display: 'block', color: '#a0aec0', fontSize: '13px', textTransform: 'uppercase', marginBottom: '5px' }}>
                        Mã số đơn hàng của bạn
                    </span>
                    <strong style={{ fontSize: '22px', color: '#2d3748', fontFamily: 'monospace' }}>
                        {orderId}
                    </strong>
                </div>
            ) : (
                <p style={{ color: '#e53e3e', marginBottom: '30px' }}>
                    ⚠️ Lưu ý: Không tìm thấy thông tin đơn hàng. Vui lòng liên hệ hỗ trợ.
                </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <button 
                    onClick={() => navigate('/')} 
                    style={{ 
                        padding: '14px', 
                        backgroundColor: '#3182ce', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2b6cb0'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3182ce'}
                >
                    Tiếp tục mua sắm
                </button>
                
            </div>
        </div>
    );
};

export default SuccessPage;