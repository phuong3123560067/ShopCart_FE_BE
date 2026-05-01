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
        await cartService.updateQuantity(userId, productId, change);
        await fetchCartData();
    };

    const handleCheckout = async () => {
        setLoading(true);
        // 1. Kiểm tra kho trước
        const stockResponse = await inventoryService.checkStock(cart.items);
        
        if (stockResponse.available) { //trả về true nếu còn hàng
            // 2. Nếu còn hàng mới tạo đơn
            const orderResponse = await orderService.createOrder({
                userId,
                items: cart.items,
                total: cart.total
            });
            setMessage(`Đặt hàng thành công! Mã đơn: ${orderResponse.orderId}`);
        } else {
            setMessage("Rất tiếc, sản phẩm trong kho đã hết!");
        }
        setLoading(false);

        // Chuyển hướng sang /checkout và mang theo dữ liệu giỏ hàng
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
                <div style={{ padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                    {message}
                </div>
            )}

            {(!cart || cart.items.length === 0) ? (
                <div data-testid="empty-cart-message" style={{ padding: '20px' }}>Giỏ hàng trống</div>
            ) : (
                <>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {cart.items.map((item) => (
                            <li key={item.productId} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                padding: '15px 0',
                                borderBottom: '1px solid #ddd'
                            }}>
                                <div>
                                    <span style={{ fontWeight: 'bold' }}>{item.productName}</span>
                                    <span style={{ margin: '0 10px' }}>-</span>
                                    <span>Số lượng: <strong>{item.quantity}</strong></span>
                                </div>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button onClick={() => handleUpdateQuantity(item.productId, -1)}>-</button>
                                    <button 
                                        data-testid={`increase-btn-${item.productId}`}
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