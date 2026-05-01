// Dữ liệu mẫu nằm ngoài hàm để không bị reset
let mockCart = {
    items: [
        { productId: 'P001', productName: 'Laptop', quantity: 1 , price: 20000000}
    ],
    total: 20000000
    
    // items: [],
    // total: 0
};


export const getCart = async (userId) => {
    // Trả về một bản sao mới nhất của giỏ hàng
    return { ...mockCart };
};

export const addToCart = async (userId, product) => {
    // 1. Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingItem = mockCart.items.find(item => item.productId === product.productId);

    if (existingItem) {
        // Nếu có rồi thì tăng số lượng
        existingItem.quantity += 1;
    } else {
        // Nếu chưa có thì thêm object sản phẩm mới vào mảng items
        mockCart.items.push({
            productId: product.productId,
            productName: product.productName,
            price: product.price,
            quantity: 1
        });
    }

    // 2. Tính toán lại tổng tiền
    const itemPrice = product.price
    mockCart.total = mockCart.items.reduce((sum, item) => sum + (item.quantity * itemPrice), 0);

    console.log("Giỏ hàng sau khi thêm:", mockCart);

    // 3. Trả về đúng format mà bài Test yêu cầu
    return {
        success: true,
        message: 'Thêm vào giỏ hàng thành công',
        cartTotal: mockCart.total
    };
};

export const updateQuantity = async (userId, productId, change) => {
    // 1. Tìm đúng sản phẩm Laptop trong danh sách
    const item = mockCart.items.find(i => i.productId === productId);
    
    if (item) {
        // 2. Cập nhật số lượng của chính sản phẩm đó
        item.quantity += change;
        if (item.quantity < 1) item.quantity = 1;

        // 3. Tính toán lại tổng tiền dựa trên số lượng mới
        mockCart.total = item.quantity * item.price;
        
        console.log("Số lượng mới trong Service:", item.quantity);
    }
    return { success: true };
};

export const checkout = async (userId) => {
    alert("Hệ thống: Đang xử lý đơn hàng cho người dùng " + userId);
    return { success: true };
};