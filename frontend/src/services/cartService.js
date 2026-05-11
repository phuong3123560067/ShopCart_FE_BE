import { calculateCartTotal } from "../utils/cartValidation";
import { EMPTY_CART, SHIPPING } from "../tests/mockData/cart.mock";

// Khởi tạo bản sao sạch để tránh rò rỉ dữ liệu
let mockCart = JSON.parse(JSON.stringify(EMPTY_CART)); 

export const getCart = async (user_id) => {
    if (mockCart.user_id !== user_id) {
        await clearCart(user_id);
    }
    return { ...mockCart };
};

export const addToCart = async (user_id, product) => {
    if (!product || product.stock <= 0) {
        return { success: false, message: 'Sản phẩm đã hết hàng' };
    }

    const existingItem = mockCart.items.find(item => item.product_id === product.product_id);

    if (existingItem) {
        if (existingItem.quantity + 1 > product.stock) {
            return { success: false, message: 'Vượt quá tồn kho' };
        }
        existingItem.quantity += 1;
    } else {
        mockCart.items.push({ ...product, quantity: 1 });
    }

    // Tính tổng tiền sản phẩm
    mockCart.total_price = calculateCartTotal(mockCart.items.map(i => ({
        product: { price: i.price },
        quantity: i.quantity
    })));

    return { success: true, message: 'Thêm vào giỏ hàng thành công', cartTotal: mockCart.total_price };
};

export const updateQuantity = async (user_id, product_id, newQuantity) => {
    const itemIndex = mockCart.items.findIndex(i => i.product_id === product_id);
    
    if (itemIndex !== -1) {
        if (newQuantity <= 0) {
            mockCart.items.splice(itemIndex, 1);
        } else {
            // Kiểm tra tồn kho dùng key .stock
            if (newQuantity > mockCart.items[itemIndex].stock) {
                return { success: false, message: 'Vượt quá tồn kho' };
            }
            mockCart.items[itemIndex].quantity = newQuantity;
        }

        // Tính toán lại total
        const subTotal = mockCart.items.reduce((sum, i) => sum + (i.quantity * i.price), 0);
        
        mockCart.total_price = subTotal;
    }
    
    return { 
        success: true, 
        message: 'Cập nhật số lượng thành công', 
        newTotal: mockCart.total_price 
    };
};

export const clearCart = async (user_id) => {
    // Reset về object EMPTY_CART có sẵn total = 0
    mockCart = JSON.parse(JSON.stringify(EMPTY_CART)); 
    mockCart.user_id = user_id; // Dùng user_id

    return { success: true };
};