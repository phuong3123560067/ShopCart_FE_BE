export const checkStock = async (items) => {
    // Nếu có bất kỳ món nào số lượng > 11 thì báo hết hàng
    const outOfStockItems = items.filter(item => item.quantity > item.stock);
    
    if (outOfStockItems.length > 0) {
        // Danh sách tên các sản phẩm bị lỗi
        const errorNames = outOfStockItems.map(item => item.productName).join(", ");
        
        return { 
            available: false, 
            message: `Rất tiếc, các sản phẩm sau đã hết hàng hoặc không đủ số lượng: ${errorNames}` 
        };
    }
    
    return { available: true }; 
};