export const InventoryWarning = ({ items }) => {
  // Giả sử Laptop Dell chỉ còn 1 cái trong kho
  const outOfStockItems = items.filter(item => item.name === 'Laptop Dell' && item.quantity > 1);

  if (outOfStockItems.length === 0) return null;

  return (
    <div data-testid="inventory-warning" style={{ color: 'red' }}>
      Cảnh báo: Một số sản phẩm vượt quá số lượng tồn kho!
    </div>
  );
};