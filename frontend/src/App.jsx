import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CartComponent from "./components/CartComponent";
import CheckoutPage from "./components/CheckoutPage";
import SuccessPage from "./components/SuccessPage";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import "./App.css";

function App() {
  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ textAlign: 'center', color: '#2d3748' }}>🛒 Hệ Thống Mua Sắm Online</h1>
        <hr style={{ border: '0.5px solid #e2e8f0', margin: '20px 0' }} />
        
        <Routes>
          {/* 1. Trang Login làm trang chủ mặc định để người dùng đăng nhập trước */}
          <Route path="/" element={<Login />} />

          <Route path="/register" element={<Register />} />
          
          {/* 2. Trang giỏ hàng - sử dụng user_id động từ login (tạm thời để user01) */}
          <Route path="/cart" element={<CartComponent />} />
          
          {/* 3. Trang thanh toán */}
          <Route path="/checkout" element={<CheckoutPage />} />
          
          {/* 4. Trang xác nhận sau khi xong */}
          <Route path="/order-confirmation" element={<SuccessPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;