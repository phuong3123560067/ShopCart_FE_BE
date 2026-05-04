export const InventoryWarning = ({ items }) => {
  const hasOutOfStock = items.some(item => item.quantity > item.stock);

  if (!hasOutOfStock) return null;

  return (
    <div
      data-testid="inventory-error"
      style={{ 
        color: '#721c24', 
        backgroundColor: '#f8d7da', 
        padding: '10px', 
        borderRadius: '4px', 
        marginTop: '10px',
        border: '1px solid #f5c6cb'
      }}
    >
      Cảnh báo: Một số sản phẩm đã vượt quá tồn kho!
    </div>
  );
};