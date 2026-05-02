import { useEffect, useState } from "react";
import * as cartService from "../services/cartService";
import * as inventoryService from "../services/inventoryService";
import * as orderService from "../services/orderService";
import { useNavigate } from "react-router-dom";//chuyển hướng sau khi đặt hàng thành công

function CartComponent({ userId }) {
    const [cart, setCart] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(""); 
    const navigate = useNavigate(); // Hook để chuyển hướng sau khi đặt hàng thành công

    const fetchCartData = async () => {
        try {
            const data = await cartService.getCart(userId);
            setCart({ ...data });
            setError(null);
        } catch (err) {
            setError("Error loading cart");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, [userId]);

    const handleAddToCart = async () => {
        const productToAdd = { productId: "P999", productName: "Sản phẩm mới", price: 100000 };
        const response = await cartService.addToCart(userId, productToAdd);
        
        if (response.success) {
            setMessage(response.message);
            await fetchCartData(); 
        } else {
            setMessage(response.message);
        }
    };

    const handleUpdateQuantity = async (productId, change) => {
        // 1. Tìm sản phẩm đang thao tác trong local state để kiểm tra trước khi gọi API
        const item = cart.items.find(i => i.productId === productId);
        
        // 2. Logic chặn: Nếu hiện tại là 11 và người dùng muốn cộng thêm (+1)
        if (item && item.quantity >= 11 && change > 0) {
            setMessage("Rất tiếc, sản phẩm trong kho đã hết!");
            return; // Dừng lại, không gọi API update nữa
        }

        // 3. Nếu hợp lệ thì mới tiến hành update như cũ
        await cartService.updateQuantity(userId, productId, change);
        await fetchCartData();
        setMessage(""); // Xóa thông báo cũ nếu thao tác hợp lệ
    };

    const handleCheckout = async () => {
        setLoading(true);
        // Kiểm tra kho (Giả lập kiểm tra số lượng > 11)
        const hasError = cart.items.some(item => item.quantity > 11);
        
        if (hasError) {
            setMessage("Rất tiếc, sản phẩm trong kho đã hết!");
            setLoading(false);
            return; // Chặn không cho navigate sang trang checkout[cite: 3]
        }

        // Nếu mọi thứ ổn, mới chuyển sang trang Checkout
        setLoading(false);
        navigate("/checkout", { state: { cartData: cart } });
    };

    // Thêm dấu ?. và kiểm tra nếu chưa có cart thì mặc định là 0
    const finalTotal = cart?.items 
        ? cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) 
        : 0;

    if (error) return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
    if (loading) return <div style={{ padding: '20px' }}>Đang tải giỏ hàng...</div>;

    return (
        <div className="cart-container" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>Giỏ hàng của bạn</h2>
            
            <button 
                data-testid="add-to-cart-btn"
                onClick={handleAddToCart}
                style={{ marginBottom: '10px', padding: '8px', cursor: 'pointer' }}
            >
                + Thêm nhanh sản phẩm mẫu
            </button>

            {message && (
                <>
                    {/* Thẻ dành riêng cho Thành công */}
                    {message.toLowerCase().includes("thành công") && (
                        <div 
                            data-testid="success-toast" 
                            style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', marginBottom: '10px', borderRadius: '4px' }}
                        >
                            {message}
                        </div>
                    )}

                    {/* Thẻ dành riêng cho Lỗi */}
                    {!message.toLowerCase().includes("thành công") && (
                        <div 
                            data-testid="inventory-error" 
                            style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '10px', borderRadius: '4px' }}
                        >
                            {message}
                        </div>
                    )}
                </>
            )}

            {(!cart || cart.items.length === 0) ? (
                <div data-testid="empty-cart-message" style={{ padding: '20px' }}>Giỏ hàng trống</div>
            ) : (
                <>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {cart.items.map((item) => (
                            <li 
                                key={item.productId} 
                                // 1. Tạo vùng nhận diện riêng cho từng dòng sản phẩm
                                data-testid={`cart-item-${item.productId}`} 
                                style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    padding: '15px 0',
                                    borderBottom: '1px solid #ddd'
                                }}
                            >
                                <div>
                                    <span style={{ fontWeight: 'bold' }}>{item.productName}</span>
                                    <span style={{ margin: '0 10px' }}>-</span>
                                    {/* 2. Thêm testid để robot đọc được con số số lượng hiện tại */}
                                    <span>Số lượng: <strong data-testid="quantity-value">{item.quantity}</strong></span>
                                </div>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button onClick={() => handleUpdateQuantity(item.productId, -1)}>-</button>
                                    <button 
                                        // 3. Dùng một cái tên chung cho nút tăng để robot dễ tìm trong phạm vi dòng
                                        data-testid="increase-qty-btn"
                                        onClick={() => handleUpdateQuantity(item.productId, 1)}
                                    >+</button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                        <div data-testid="total-price" style={{ fontSize: '1.3em', marginBottom: '15px' }}>
                            Tổng cộng: <span style={{ color: '#d9534f', fontWeight: 'bold' }}>{finalTotal.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        <button 
                            data-testid="checkout-btn" 
                            onClick={() => handleCheckout()}
                            style={{ 
                                width: '100%',
                                padding: '12px', 
                                backgroundColor: '#28a745', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Thanh toán ngay
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default CartComponent;