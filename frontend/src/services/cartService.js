import { VALID_CART, EMPTY_CART } from "../tests/mockData/cart.mock";

// let mockCart = { ... VALID_CART};
let mockCart = { ... EMPTY_CART};

export const getCart = async (userId) => {
    // Trả về một bản sao mới nhất của giỏ hàng
    return { ...mockCart };
};

export const addToCart = async (userId, product) => {
    // --- BƯỚC QUAN TRỌNG NHẤT: Kiểm tra tồn kho trước khi xử lý ---
    if (!product || product.stock <= 0) {
        return {
            success: false,
            message: 'Sản phẩm đã hết hàng', // Không chứa chữ "thành công" -> Hiện thẻ đỏ
            cartTotal: mockCart.total
        };
    }

    // 1. Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingItem = mockCart.items.find(item => item.productId === product.productId);

    if (existingItem) {
        // Kiểm tra xem nếu tăng thêm 1 có vượt quá tồn kho không (Nâng cao)
        if (existingItem.quantity + 1 > product.stock) {
            return {
                success: false,
                message: 'Số lượng yêu cầu vượt quá tồn kho hiện có',
                cartTotal: mockCart.total
            };
        }
        existingItem.quantity += 1;
    } else {
        mockCart.items.push({
            productId: product.productId,
            productName: product.productName,
            price: product.price,
            quantity: 1
        });
    }

    // 2. Tính toán lại tổng tiền
    mockCart.total = mockCart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    // 3. Trả về kết quả Thành công
    return {
        success: true,
        message: 'Thêm vào giỏ hàng thành công', // Chứa chữ "thành công" -> Hiện thẻ xanh
        cartTotal: mockCart.total
    };
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