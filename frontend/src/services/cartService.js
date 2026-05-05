import { calculateCartTotal } from "../utils/cartValidation";
import { EMPTY_CART } from "../tests/mockData/cart.mock";

let mockCart = { ...EMPTY_CART }; 

export const getCart = async (userId) => {
    return { ...mockCart };
};

export const addToCart = async (userId, product) => {
    if (!product || product.stock <= 0) {
        return { success: false, message: 'Sản phẩm đã hết hàng' };
    }

    const existingItem = mockCart.items.find(item => item.productId === product.productId);

    if (existingItem) {
        if (existingItem.quantity + 1 > product.stock) {
            return { success: false, message: 'Vượt quá tồn kho' };
        }
        existingItem.quantity += 1;
    } else {
        mockCart.items.push({ ...product, quantity: 1 });
    }

    // Cập nhật tổng tiền bằng hàm utils để tăng coverage cho cả 2 nơi
    mockCart.total = calculateCartTotal(mockCart.items.map(i => ({
        product: { price: i.price },
        quantity: i.quantity
    })));

    return { success: true, message: 'Thêm vào giỏ hàng thành công', cartTotal: mockCart.total };
};

export const updateQuantity = async (userId, productId, newQuantity) => {
    // 1. Tìm vị trí sản phẩm trong giỏ hàng
    const itemIndex = mockCart.items.findIndex(i => i.productId === productId);
    
    if (itemIndex !== -1) {
        if (newQuantity <= 0) {
            // NẾU SỐ LƯỢNG <= 0: Xóa sản phẩm khỏi danh sách
            mockCart.items.splice(itemIndex, 1);
        } else {
            // NẾU SỐ LƯỢNG > 0: Cập nhật số lượng mới
            mockCart.items[itemIndex].quantity = newQuantity;
        }

        // 2. Cập nhật lại tổng tiền cho toàn bộ giỏ[cite: 3]
        mockCart.total = mockCart.items.reduce((sum, i) => sum + (i.quantity * i.price), 0);
    }
    
    return { 
        success: true, 
        message: 'Cập nhật số lượng thành công', 
        cartTotal: mockCart.total 
    };
};

export const checkout = async (userId) => {
    alert("Hệ thống: Đang xử lý đơn hàng cho người dùng " + userId);
    return { success: true };
};