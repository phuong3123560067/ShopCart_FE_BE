export const PriceCalculator = ({ items }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return (
    <div className="price-calc">
      <span data-testid="subtotal-display">
        {subtotal.toLocaleString('vi-VN')}
      </span>
    </div>
  );
};