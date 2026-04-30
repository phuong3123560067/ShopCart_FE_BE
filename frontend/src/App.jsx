import CartComponent from "./components/CartComponent";
import CheckoutPage from "./components/CheckoutPage"; // 1. Import CheckoutPage
import './App.css';

function App() {
  // 2. Tạo dữ liệu mẫu giống như trong ví dụ của thầy để hiển thị
  const mockCart = {
    items: [
      { name: 'Laptop Dell', price: 15000000, quantity: 2 },
      { name: 'Mouse Logitech', price: 500000, quantity: 1 },
    ]
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Hệ thống Bán hàng</h1>
      <hr />
      
      {/* --- PHẦN 1: GIỎ HÀNG --- */}
      <h2 style={{ color: 'blue' }}>1. Component Giỏ hàng</h2>
      <CartComponent userId="user01" />

      <div style={{ margin: '50px 0', borderTop: '2px dashed #ccc' }}></div>

      {/* --- PHẦN 2: THANH TOÁN --- */}
      <h2 style={{ color: 'green' }}>2. Component Thanh toán (Integration)</h2>
      {/* 3. Gọi CheckoutPage và truyền mockCart vào prop 'cart' */}
      <CheckoutPage cart={mockCart} />
      
    </div>
  );
}

export default App;