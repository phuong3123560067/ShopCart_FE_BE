export const CheckoutSummary = ({ items }) => (
  <div data-testid="checkout-summary">
    {items.map((item, index) => (
      <div key={index} data-testid="summary-item">
        {item.productName} x {item.quantity}: {(item.price * item.quantity).toLocaleString()}đ
      </div>
    ))}
  </div>
);