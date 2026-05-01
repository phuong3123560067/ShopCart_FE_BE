import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import CartComponent from "./components/CartComponent";
import CheckoutPage from "./components/CheckoutPage";
import "./App.css";

function App() {
  const SuccessPage = () => {
    const location = useLocation();
    const orderId = location.state?.orderId; // Lấy mã đơn hàng từ state

    return (
      <div style={{ textAlign: 'center', padding: '40px', border: '2px solid #28a745', borderRadius: '10px' }}>
        <h2 style={{ color: 'green' }}>✔️ ĐẶT HÀNG THÀNH CÔNG!</h2>
        <p>Cảm ơn bạn đã tin tưởng ShopCart.</p>
        
        {/* Hiện mã cho người dùng thấy */}
        <div style={{ backgroundColor: '#f4f4f4', padding: '10px', display: 'inline-block', borderRadius: '5px' }}>
          Mã đơn hàng của bạn: <strong>{orderId || "Đang xử lý..."}</strong>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button onClick={() => window.location.href = '/'}>Tiếp tục mua sắm</button>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Hệ thống Bán hàng ShopCart</h1>
        <hr />
        
        <Routes>
          {/* Trang giỏ hàng là mặc định */}
          <Route path="/" element={<CartComponent userId="user01" />} />
          
          {/* Trang thanh toán riêng biệt */}
          <Route path="/checkout" element={<CheckoutPage />} />
          
          {/* Trang xác nhận sau khi xong (Câu 6.2.2) */}
          <Route path="/order-confirmation" element={<SuccessPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;