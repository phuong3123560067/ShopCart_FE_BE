// Giỏ hàng tiêu chuẩn
export const VALID_CART = {
    items: [
        { productId: 'P001', productName: 'Laptop Dell', price: 20000000, quantity: 1 , stock: 10},
        { productId: 'P002', productName: 'Mouse Logitech', price: 500000, quantity: 2 , stock: 10}
    ],
    userId: 'user_123',
    total: 21000000
};

// Giỏ hàng trống
export const EMPTY_CART = {
    items: [],
    userId: 'user_123',
    total: 0
};

export const OUT_OF_STOCK_CART = {
    items: [
        { productId: 'P000', productName: 'Laptop ASUS', price: 22000000, quantity: 2 , stock: 0},
    ],
    userId: 'user_123',
    total: 0
};

export const PRODUCT_AVAILABLE = { 
    productId: 'P999', 
    productName: 'Sản phẩm còn hàng', 
    price: 100000,
    stock: 10
};

export const PRODUCT_OUT_OF_STOCK = { 
    productId: 'P000', 
    productName: 'Sản phẩm hết hàng', 
    price: 200000,
    stock: 0
};


export const PROMOTION = { // app 1 trong 2
    "GIAM10": { code: "GIAM10", discountPercent: 10, minOrder: 100000 }, // đơn tối thiểu 100k đc áp dụng
    "FREESHIP": { code: "FREESHIP", discountAmount: 30000, minOrder: 500000 } // // đơn tối thiểu 500k đc áp dụng
};

export const SHIPPING = {
    DEFAULT: 30000, // cơ bản
    EXPRESS: 50000, // siêu tốc
    FREE_THRESHOLD: 1000000 // Freeship nếu đơn trên 1 triệu
};