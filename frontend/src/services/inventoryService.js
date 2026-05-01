// export const checkStock = async (items) => {
//     // Logic thật sẽ gọi API kiểm tra kho
//     return { available: false }; 
// };

export const checkStock = async (items) => {
    // Nếu có bất kỳ món nào số lượng > 10 thì báo hết hàng
    const isOver = items.some(item => item.quantity > 10);
    
    if (isOver) {
        return { available: false };
    }
    
    return { available: true }; 
};