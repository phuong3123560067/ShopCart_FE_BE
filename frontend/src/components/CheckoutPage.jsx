import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import * as orderService from "../services/orderService"; 
import { CheckoutSummary } from "./CheckoutSummary";
import { PriceCalculator } from "./PriceCalculator";
import { InventoryWarning } from "./InventoryWarning";

const CheckoutPage = () => {
  const [discountCode, setDiscountCode] = useState(""); // Mã giảm giá nhập bởi người dùng
  const [discountValue, setDiscountValue] = useState(0); // Giá trị giảm giá được tính toán sau khi áp dụng mã
  const shippingFee = 30000; // Phí ship cố định

  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy dữ liệu giỏ hàng từ state của Router
  const cart = location.state?.cartData;

  // Tính tạm tính (Subtotal)
  const subTotal = cart?.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

  // Hàm áp dụng mã giảm giá giả lập
  const applyDiscount = () => {
    if (discountCode === "GIAM10") {
      setDiscountValue(subTotal * 0.1);
      alert("Đã áp dụng mã giảm giá 10%!");
    } else {
      alert("Mã giảm giá không hợp lệ!");
      setDiscountValue(0);
    }
  };

  const finalTotal = subTotal + shippingFee - discountValue;

  if (!cart) return <div style={{ padding: '20px', textAlign: 'center' }}>Không có dữ liệu thanh toán. Vui lòng quay lại giỏ hàng.</div>;

  const handleFinalConfirm = async () => {
    try {
      // Gọi API tạo đơn hàng thực tế
      const response = await orderService.createOrder({
        userId: cart.userId,
        items: cart.items,
        total: cart.total
      });
      
      if (response.orderId) {
        navigate("/order-confirmation", {state: {orderId: response.orderId}});
      }
    } catch (err) {
      alert("Có lỗi xảy ra khi xử lý đơn hàng!");
    }
  };

  return (
    <div className="checkout-container" style={{
      maxWidth: '600px',
      margin: '20px auto',
      padding: '20px',
      border: '1px solid #eee',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // Tạo hiệu ứng đổ bóng cho đẹp
      backgroundColor: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333', borderBottom: '2px solid #28a745', paddingBottom: '10px' }}>
        Xác Nhận Đơn Hàng
      </h1>

      {/* Khu vực danh sách mặt hàng - CheckoutSummary sẽ hiển thị tên và giá */}
      <div style={{ margin: '20px 0', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>Danh sách sản phẩm:</h3>
        <CheckoutSummary items={cart.items} /> 
      </div>

      {/* Khu vực cảnh báo tồn kho không cần thiết vì đã có logic chặn ở CartComponent
      <InventoryWarning items={cart.items} /> */} 

      {/* Khu vực nhập mã giảm giá */}
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Nhập mã (GIAM10)" 
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button onClick={applyDiscount} style={{ padding: '8px 15px', cursor: 'pointer' }}>Áp dụng</button>
      </div>

      <div className="total-section" style={{
        marginTop: '20px',
        padding: '15px',
        borderTop: '1px dashed #ccc',
        textAlign: 'right'
      }}>
        <div style={{ marginBottom: '5px' }}>
          Tạm tính: <span data-testid="subtotal-price">{subTotal.toLocaleString()}đ</span>
        </div>
        <div style={{ marginBottom: '5px' }}>
          Phí ship: <span data-testid="shipping-fee">+{shippingFee.toLocaleString()}đ</span>
        </div>
        <div style={{ marginBottom: '5px', color: 'red' }}>
          Giảm giá: <span data-testid="discount-amount">-{discountValue.toLocaleString()}đ</span>
        </div>
        
        <div style={{ fontSize: '1.4em', marginTop: '10px' }}>
          <strong>Tổng thanh toán: </strong>
          <strong data-testid="final-total" style={{ color: '#d9534f' }}>
            {finalTotal.toLocaleString()}đ
          </strong>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Quay lại
        </button>
        
        <button 
          data-testid="confirm-checkout"
          onClick={handleFinalConfirm}
          style={{
            flex: 2,
            padding: '12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1.1em'
          }}
        >
          Xác nhận đặt hàng ngay
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;