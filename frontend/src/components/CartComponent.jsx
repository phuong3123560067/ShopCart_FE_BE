import { useEffect, useState } from "react";
import * as cartService from "../services/cartService";
import * as inventoryService from "../services/inventoryService";
import * as orderService from "../services/orderService";
import { useNavigate } from "react-router-dom";//chuyển hướng sau khi đặt hàng thành công
import { PRODUCT_LIST } from "../tests/mockData/cart.mock";


function CartComponent({ user_id: propUser_id }) {
    const savedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const user_id = propUser_id || savedUser?.id; 

    useEffect(() => {
        if (user_id) {
            fetchCartData();
        } else {
            // Nếu không có user_id (chưa đăng nhập), ép về trang login
            navigate('/');
        }
    }, [user_id]);

    const [cart, setCart] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(""); 
    const navigate = useNavigate(); // Hook để chuyển hướng sau khi đặt hàng thành công

    const fetchCartData = async () => {
        try {
            const data = await cartService.getCart(user_id);
            setCart({ ...data });
            setError(null);
        } catch (err) {
            setError("Lỗi tải giỏ hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, [user_id]);

    const handleAddToCart = async (product) => {
        const response = await cartService.addToCart(user_id, product);
        
        if (response.success) {
            setMessage(response.message);
            await fetchCartData(); // Cập nhật lại giỏ hàng để hiển thị số lượng mới
        } else {
            setMessage(response.message);
        }
    };

    const handleUpdateQuantity = async (product_id, change) => {
        //Tìm sản phẩm giỏ hàng
        const cartItem = cart?.items?.find(i => i.product_id === product_id);
        if (!cartItem) return; // Nếu không tìm thấy sản phẩm trong giỏ, dừng lại

        //Lấy kho hàng động
        const currentInventory = inventoryService.getProducts();
        const originalProduct = currentInventory.find(p => p.product_id === product_id);
        const maxStock = originalProduct ? originalProduct.stock : 0;

        //Tính số lượng mới dựa trên cartItem vừa tìm được
        const newQty = cartItem.quantity + change;

        // Nếu người dùng nhấn giảm xuống 0
        if (newQty < 0) return;

        //kiểm tra tồn kho
        if (newQty > maxStock) {
            // Nếu vượt quá stock, hiển thị thông báo lỗi ngay
            setMessage(`Rất tiếc, sản phẩm ${cartItem.name} chỉ còn ${maxStock} sản phẩm trong kho!`);
            return; // Dừng hàm, không gọi API update nữa
        }

        try {
            await cartService.updateQuantity(user_id, product_id, newQty);
            await fetchCartData(); 
            setMessage(newQty === 0 ? "Đã xóa sản phẩm khỏi giỏ hàng" : ""); 
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
        }
    };

    const handleCheckout = async () => {
        setLoading(true);
    
        // Gọi hàm checkStock
        const stockStatus = await inventoryService.checkStock(cart.items);
        
        if (!stockStatus.available) {
            // Hiển thị thông báo có chứa tên sản phẩm
            setMessage(stockStatus.message);
            setLoading(false);
            return; 
        }

        // Nếu kho ổn, tiếp tục thanh toán
        setLoading(false);
        navigate("/checkout", { state: { cartData: cart } });
    };

    // Thêm dấu ?. và kiểm tra nếu chưa có cart thì mặc định là 0
    const finalTotal = cart?.total_price || 0;

    if (error) return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
    if (loading) return <div style={{ padding: '20px' }}>Đang tải giỏ hàng...</div>;

    return (
        <div className="cart-container" style={{ 
            padding: '30px', 
            maxWidth: '900px',
            margin: '40px auto', 
            fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            backgroundColor: '#fff',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
        }}>

            {/* --- PHẦN 1: DANH SÁCH SẢN PHẨM --- */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px', 
                marginBottom: '40px' 
            }}>
                {PRODUCT_LIST.map((product) => (
                    <div key={product.product_id} style={{ 
                        border: '1px solid #f0f0f0', 
                        padding: '15px', 
                        borderRadius: '12px', 
                        textAlign: 'center',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        backgroundColor: '#fff',
                        cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.shadow = '0 5px 15px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.shadow = 'none';
                    }}>
                        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '10px', marginBottom: '12px' }}>
                            <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '120px', objectFit: 'contain' }} />
                        </div>
                        <h4 style={{ margin: '10px 0 5px', fontSize: '16px', color: '#333' }}>{product.name}</h4>
                        <p style={{ color: '#e44d26', fontWeight: 'bold', fontSize: '18px', margin: '5px 0' }}>
                            {product.price.toLocaleString()}đ
                        </p>
                        
                        <button 
                            data-testid={`add-${product.product_id}-btn`}
                            onClick={() => handleAddToCart(product)}
                            style={{ 
                                width: '100%', 
                                padding: '10px', 
                                border: 'none', 
                                borderRadius: '6px',
                                backgroundColor: product.stock > 0 ? '#1a73e8' : '#cbd5e0',
                                color: 'white', 
                                cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                                fontWeight: '600',
                                transition: 'background 0.3s'
                            }}
                            disabled={product.stock === 0}
                        >
                            {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                        </button>
                    </div>
                ))}
            </div>

            {/* --- PHẦN 2: THÔNG BÁO --- */}
            {message && (
                <div 
                    data-testid={message.toLowerCase().includes("thành công") ? "success-toast" : "inventory-error"}
                    style={{ 
                        padding: '12px 20px', 
                        borderRadius: '8px', 
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: '500',
                        animation: 'slideIn 0.5s ease-out',
                        backgroundColor: message.toLowerCase().includes("thành công") ? '#e6fffa' : '#fff5f5',
                        color: message.toLowerCase().includes("thành công") ? '#2c7a7b' : '#c53030',
                        borderLeft: `5px solid ${message.toLowerCase().includes("thành công") ? '#38b2ac' : '#f56565'}`
                    }}
                >
                    {message.toLowerCase().includes("thành công") ? '✅ ' : '❌ '} {message}
                </div>
            )}

            {/* --- PHẦN 3: CHI TIẾT GIỎ HÀNG --- */}
            <div style={{ 
                backgroundColor: '#fdfdfd', 
                padding: '25px', 
                borderRadius: '12px',
                border: '1px solid #edf2f7'
            }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#4a5568', fontSize: '20px' }}>
                    🛍️ Giỏ hàng của {JSON.parse(localStorage.getItem('currentUser'))?.full_name || "bạn"}
                </h3>
                
                {(!cart || cart.items.length === 0) ? (
                    <div data-testid="empty-cart-message" style={{ textAlign: 'center', padding: '40px', color: '#a0aec0' }}>
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>📥</div>
                        Giỏ hàng đang trống
                    </div>
                ) : (
                    <>
                        <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                            {cart.items.map((item) => (
                                <div 
                                    key={item.product_id} 
                                    data-testid={`cart-item-${item.product_id}`} 
                                    style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        padding: '15px 0',
                                        borderBottom: '1px solid #f0f0f0'
                                    }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: '600', color: '#2d3748' }}>{item.name}</span>
                                        <span style={{ fontSize: '14px', color: '#718096' }}>Đơn giá: {item.price?.toLocaleString()}đ</span>
                                    </div>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                                            <button 
                                                data-testid={`decrease-btn-${item.product_id}`} 
                                                onClick={() => handleUpdateQuantity(item.product_id, -1)}
                                                style={{ padding: '5px 12px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}
                                            >-</button>
                                            <span data-testid={`quantity-value-${item.product_id}`} style={{ padding: '0 10px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
                                                {item.quantity}
                                            </span>
                                            <button 
                                                data-testid={`increase-qty-${item.product_id}`}
                                                onClick={() => handleUpdateQuantity(item.product_id, 1)}
                                                style={{ padding: '5px 12px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '30px', borderTop: '2px dashed #e2e8f0', paddingTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <span style={{ fontSize: '18px', color: '#4a5568' }}>Tổng thanh toán:</span>
                                <span data-testid="total-price" style={{ fontSize: '24px', color: '#e53e3e', fontWeight: '800' }}>
                                    {finalTotal.toLocaleString('vi-VN')} VNĐ
                                </span>
                            </div>
                            
                            <button 
                                data-testid="checkout-btn" 
                                onClick={() => handleCheckout()}
                                style={{ 
                                    width: '100%',
                                    padding: '15px', 
                                    backgroundColor: '#2f855a', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '10px', 
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                    boxShadow: '0 4px 12px rgba(47, 133, 90, 0.2)',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                Thanh toán ngay
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CartComponent;