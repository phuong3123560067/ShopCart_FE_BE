export const InventoryWarning = ({ items }) => {
  // Kiểm tra xem có sản phẩm nào trong giỏ hàng vượt quá 11 không
  const hasOutOfStock = items.some(item => item.quantity > 11);

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
      Cảnh báo: Một số sản phẩm (tối đa 11 cái) đã vượt quá tồn kho!
    </div>
  );
};