import { CheckoutSummary } from "./CheckoutSummary";
import { PriceCalculator } from "./PriceCalculator";
import { InventoryWarning } from "./InventoryWarning";

const CheckoutPage = ({ cart }) => {
  if (!cart || !cart.items) return <div>Trống</div>;

  return (
    <div className="checkout-page">
      <h1>Thanh toán</h1>
      
      {/* (a) Tóm tắt */}
      <CheckoutSummary items={cart.items} />
      
      {/* (c) Cảnh báo */}
      <InventoryWarning items={cart.items} />
      
      {/* (b) Tính tiền */}
      <div className="total-section">
        Tạm tính: <PriceCalculator items={cart.items} />
      </div>
      
      <button data-testid="confirm-checkout">Xác nhận đặt hàng</button>
    </div>
  );
};

export default CheckoutPage;