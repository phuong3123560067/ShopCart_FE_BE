import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import CartComponent from "./components/CartComponent";
import CheckoutPage from "./components/CheckoutPage";
import SuccessPage from "./components/SuccessPage";
import "./App.css";

function App() {

  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>🛒 Hệ Thống Mua Sắm Online</h1>
        <hr />
        
        <Routes>
          {/* Trang giỏ hàng là mặc định */}
          <Route path="/" element={<CartComponent userId="user01" />} />
          
          {/* Trang thanh toán riêng biệt */}
          <Route path="/checkout" element={<CheckoutPage />} />
          
          {/* Trang xác nhận sau khi xong */}
          <Route path="/order-confirmation" element={<SuccessPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;