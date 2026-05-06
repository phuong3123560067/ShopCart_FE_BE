import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import * as orderService from "../services/orderService"; 
import * as cartService from "../services/cartService";
import { CheckoutSummary } from "./CheckoutSummary";
import { InventoryWarning } from "./InventoryWarning";
import { COUPONS, SHIPPING } from "../tests/mockData/cart.mock";

const CheckoutPage = () => {
    const [discountCode, setDiscountCode] = useState(""); 
    const [discountValue, setDiscountValue] = useState(0);
    const [message, setMessage] = useState(""); // Thông báo cho mã giảm giá
    
    const shippingFee = SHIPPING.DEFAULT; 

    const location = useLocation();
    const navigate = useNavigate();
    const cart = location.state?.cartData;

    // Tính tạm tính (Subtotal)
    const subTotal = cart?.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

    // Hàm áp dụng mã giảm giá sử dụng logic Mock
    const applyDiscount = () => {
        const promo = COUPONS[discountCode.toUpperCase()];

        if (!promo) {
            setMessage("Mã giảm giá không hợp lệ!");
            setDiscountValue(0);
            return;
        }

        // Kiểm tra điều kiện đơn hàng tối thiểu (min_order_value)
        if (subTotal < promo.min_order_value) {
            setMessage(`Đơn hàng phải từ ${promo.min_order_value.toLocaleString()}đ để dùng mã này`);
            setDiscountValue(0);
            return;
        }

        // Tính toán giá trị giảm dựa trên loại mã
        if (promo.discount_percent) {
            setDiscountValue(subTotal * (promo.discount_percent / 100));
        } else if (promo.discount_amount) {
            setDiscountValue(promo.discount_amount);
        }

        setMessage(`Đã áp dụng mã ${promo.code} thành công!`);
    };

    // Tính tổng cuối cùng: Hàng + Ship - Giảm giá
    const finalTotal = subTotal + shippingFee - discountValue;

    if (!cart) return <div style={{ padding: '20px', textAlign: 'center' }}>Không có dữ liệu thanh toán.</div>;

    const handleFinalConfirm = async () => {
        try {
            const response = await orderService.createOrder({
                user_id: cart.user_id,
                items: cart.items,
                total_price: finalTotal
            });
            
            if (response?.order_id || response?.orderData?.order_id) {
                
                localStorage.removeItem(`cart_${cart.user_id}`);

                try {
                    await cartService.clearCart(cart.user_id);
                } catch (clearErr) {
                    console.error("Lỗi xóa giỏ hàng:", clearErr);
                }

                // Chuyển trang với ID đúng
                navigate("/order-confirmation", { 
                    state: { order_id: response.order_id || response.orderData.order_id } 
                });
            } else {
                // Hiển thị thông báo lỗi từ server/mock nếu có[cite: 21]
                alert(response.message || "Không thể tạo đơn hàng!");
            }
        } catch (err) {
            alert("Có lỗi xảy ra khi xử lý đơn hàng!");
        }
    };

    return (
        <div className="checkout-container" style={{ 
            maxWidth: '700px', 
            margin: '40px auto', 
            padding: '40px', 
            backgroundColor: '#fff', 
            borderRadius: '16px', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.06)', 
            fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" 
        }}>
            {/* --- HEADER --- */}
            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                <h2 style={{ color: '#1a1a1a', fontSize: '28px', fontWeight: '700', margin: '0 0 10px' }}>
                    💳 Thanh Toán Đơn Hàng
                </h2>
                <p style={{ color: '#718096', margin: 0, fontSize: '15px' }}>
                    Vui lòng kiểm tra lại thông tin trước khi xác nhận
                </p>
            </div>

            {/* --- CẢNH BÁO TỒN KHO --- */}
            {cart && <InventoryWarning items={cart.items} />}

            {/* --- DANH SÁCH SẢN PHẨM --- */}
            <div style={{ 
                marginBottom: '30px', 
                backgroundColor: '#f8fafc', 
                padding: '20px', 
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
            }}>
                <h3 style={{ marginTop: 0, color: '#2d3748', fontSize: '18px', borderBottom: '1px solid #edf2f7', paddingBottom: '10px', marginBottom: '15px' }}>
                    📦 Chi tiết sản phẩm
                </h3>
                <CheckoutSummary items={cart.items} /> 
            </div>

            {/* --- MÃ GIẢM GIÁ --- */}
            <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
                    🎟️ Mã khuyến mãi
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Nhập mã (VD: GIAM10, FREESHIP)..." 
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        style={{ 
                            flex: 1, 
                            padding: '12px 15px', 
                            borderRadius: '8px', 
                            border: '1px solid #cbd5e0',
                            fontSize: '15px',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3182ce'}
                        onBlur={(e) => e.target.style.borderColor = '#cbd5e0'}
                    />
                    <button 
                        onClick={applyDiscount} 
                        style={{ 
                            padding: '0 25px', 
                            cursor: 'pointer', 
                            backgroundColor: '#3182ce', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '8px',
                            fontWeight: '600',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2b6cb0'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3182ce'}
                    >
                        Áp dụng
                    </button>
                </div>
                {message && (
                    <p style={{ 
                        fontSize: '14px', 
                        color: message.toLowerCase().includes("thành công") ? '#38a169' : '#e53e3e', 
                        marginTop: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        {message.toLowerCase().includes("thành công") ? '✅' : '⚠️'} {message}
                    </p>
                )}
            </div>

            {/* --- TỔNG KẾT CHI PHÍ --- */}
            <div className="total-section" style={{ 
                marginTop: '20px', 
                padding: '25px', 
                backgroundColor: '#fff',
                border: '2px dashed #e2e8f0', 
                borderRadius: '12px' 
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#4a5568' }}>
                    <span>Tạm tính:</span>
                    <span data-testid="subtotal-price" style={{ fontWeight: '500' }}>
                        {subTotal.toLocaleString('vi-VN')} VNĐ
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#4a5568' }}>
                    <span>Phí vận chuyển:</span>
                    <span data-testid="shipping-fee" style={{ fontWeight: '500' }}>
                        +{shippingFee.toLocaleString('vi-VN')} VNĐ
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#e53e3e' }}>
                    <span>Giảm giá:</span>
                    <span data-testid="discount-amount" style={{ fontWeight: '600' }}>
                        -{discountValue.toLocaleString('vi-VN')} VNĐ
                    </span>
                </div>
                
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderTop: '1px solid #edf2f7', 
                    paddingTop: '20px',
                    marginTop: '10px'
                }}>
                    <span>
                        <strong style={{ fontSize: '18px', color: '#2d3748' }}>Tổng thanh toán: </strong>
                        <strong data-testid="final-total" style={{ color: '#d9534f', fontSize: '26px' }}>
                            {finalTotal.toLocaleString('vi-VN')} VNĐ
                        </strong>
                    </span>
                </div>
            </div>
            
            {/* --- CÁC NÚT HÀNH ĐỘNG --- */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '35px' }}>
                <button 
                    onClick={() => navigate('/cart')} 
                    style={{ 
                        flex: 1, 
                        padding: '14px', 
                        backgroundColor: '#edf2f7', 
                        color: '#4a5568', 
                        border: '1px solid #cbd5e0', 
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#edf2f7'}
                >
                    🔙 Quay lại giỏ hàng
                </button>
                <button 
                    data-testid="confirm-checkout" 
                    onClick={handleFinalConfirm} 
                    style={{ 
                        flex: 2, 
                        padding: '14px', 
                        backgroundColor: '#38a169', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        fontWeight: 'bold',
                        fontSize: '16px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(56, 161, 105, 0.3)',
                        transition: 'transform 0.2s, background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.backgroundColor = '#2f855a';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.backgroundColor = '#38a169';
                    }}
                >
                    ✅ Xác nhận đặt hàng ngay
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;