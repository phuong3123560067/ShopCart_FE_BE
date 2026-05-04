import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import * as orderService from "../services/orderService"; 
import { CheckoutSummary } from "./CheckoutSummary";
import { InventoryWarning } from "./InventoryWarning";
import { PROMOTION, SHIPPING } from "../tests/mockData/cart.mock";

const CheckoutPage = () => {
  const [discountCode, setDiscountCode] = useState(""); 
  const [discountValue, setDiscountValue] = useState(0);
  const [message, setMessage] = useState(""); // Thông báo cho mã giảm giá
  
  // Sử dụng phí ship mặc định từ Mock Data
  const shippingFee = SHIPPING.DEFAULT; 

  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cartData;

  // Tính tạm tính (Subtotal)
  const subTotal = cart?.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

  // Hàm áp dụng mã giảm giá sử dụng logic Mock[cite: 3]
  const applyDiscount = () => {
    const promo = PROMOTION[discountCode.toUpperCase()];

    if (!promo) {
      setMessage("Mã giảm giá không hợp lệ!");
      setDiscountValue(0);
      return;
    }

    // Kiểm tra điều kiện đơn hàng tối thiểu (minOrder)[cite: 3]
    if (subTotal < promo.minOrder) {
      setMessage(`Đơn hàng phải từ ${promo.minOrder.toLocaleString()}đ để dùng mã này`);
      setDiscountValue(0);
      return;
    }

    // Tính toán giá trị giảm dựa trên loại mã
    if (promo.discountPercent) {
      setDiscountValue(subTotal * (promo.discountPercent / 100));
    } else if (promo.discountAmount) {
      setDiscountValue(promo.discountAmount);
    }

    setMessage(`Đã áp dụng mã ${promo.code} thành công!`);
  };

  // Tính tổng cuối cùng: Hàng + Ship - Giảm giá
  const finalTotal = subTotal + shippingFee - discountValue;

  if (!cart) return <div style={{ padding: '20px', textAlign: 'center' }}>Không có dữ liệu thanh toán.</div>;

  const handleFinalConfirm = async () => {
    try {
      const response = await orderService.createOrder({
        userId: cart.userId,
        items: cart.items,
        total: finalTotal // Gửi tổng tiền cuối cùng đã trừ giảm giá
      });
      
      if (response.orderId) {
        navigate("/order-confirmation", {state: {orderId: response.orderId}});
      }
    } catch (err) {
      alert("Có lỗi xảy ra khi xử lý đơn hàng!");
    }
  };

  return (
    <div className="checkout-container" style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #eee', borderRadius: '12px', backgroundColor: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Xác Nhận Đơn Hàng</h1>

      <div style={{ margin: '20px 0', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
        <h3>Danh sách sản phẩm:</h3>
        <CheckoutSummary items={cart.items} /> 
      </div>

      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Nhập mã (GIAM10 hoặc FREESHIP)" 
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button onClick={applyDiscount} style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>Áp dụng</button>
        </div>
        {message && <p style={{ fontSize: '0.9em', color: message.includes("thành công") ? 'green' : 'red', marginTop: '5px' }}>{message}</p>}
      </div>

      <div className="total-section" style={{ marginTop: '20px', padding: '15px', borderTop: '1px dashed #ccc', textAlign: 'right' }}>
        <div>Tạm tính: <span data-testid="subtotal-price">{subTotal.toLocaleString()} VNĐ</span></div>
        <div>Phí ship: <span data-testid="shipping-fee">+{shippingFee.toLocaleString()} VNĐ</span></div>
        <div style={{ color: 'red' }}>Giảm giá: <span data-testid="discount-amount">-{discountValue.toLocaleString()} VNĐ</span></div>
        
        <div style={{ fontSize: '1.4em', marginTop: '10px' }}>
          <strong>Tổng thanh toán: </strong>
          <strong data-testid="final-total" style={{ color: '#d9534f' }}>
            {finalTotal.toLocaleString()} VNĐ
          </strong>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={() => navigate('/')} style={{ flex: 1, padding: '12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px' }}>Quay lại</button>
        <button data-testid="confirm-checkout" onClick={handleFinalConfirm} style={{ flex: 2, padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Xác nhận đặt hàng ngay</button>
      </div>
    </div>
  );
};

export default CheckoutPage;