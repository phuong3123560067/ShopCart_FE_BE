import { useLocation, useNavigate } from "react-router-dom";
import * as orderService from "../services/orderService"; 
import { CheckoutSummary } from "./CheckoutSummary";
import { PriceCalculator } from "./PriceCalculator";
import { InventoryWarning } from "./InventoryWarning";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy dữ liệu giỏ hàng từ state của Router
  const cart = location.state?.cartData;

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

      {/* Khu vực cảnh báo tồn kho */}
      <InventoryWarning items={cart.items} />

      {/* Khu vực tính tổng tiền */}
      <div className="total-section" style={{
        marginTop: '20px',
        padding: '15px',
        borderTop: '1px dashed #ccc',
        textAlign: 'right',
        fontSize: '1.2em'
      }}>
        <span style={{ fontWeight: 'normal' }}>Tổng thanh toán: </span>
        <strong style={{ color: '#d9534f' }}>
          <PriceCalculator items={cart.items} />
        </strong>
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