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

export const PRODUCT_LIST = [
    { 
    productId: 'P001', 
    productName: 'Laptop Dell', 
    price: 20000000,
    stock: 10,
    img: 'https://placeholder.com/laptop-dell-.jpg'
    },
    { 
    productId: 'P002', 
    productName: 'Mouse Logitech', 
    price: 500000,
    stock: 10,
    img: 'https://placeholder.com/mouse-logitech.jpg'
    },

    { 
    productId: 'P999', 
    productName: 'iPhone 15 Pro Max 256GB', 
    price: 29500000,
    stock: 5,
    img: 'https://placeholder.com/iphone-15-pro.jpg'
    },
    { 
    productId: 'P998', 
    productName: 'MacBook Air M2 13" 8GB/256GB', 
    price: 24990000,
    stock: 8,
    img: 'https://placeholder.com/macbook-m2.jpg'
    },
    { 
    productId: 'P997', 
    productName: 'Tai nghe AirPods Pro Gen 2', 
    price: 5850000,
    stock: 15,
    img: 'https://placeholder.com/airpods-pro.jpg'
    },
    { 
    productId: 'P996', 
    pproductName: 'Samsung Galaxy S24 Ultra', 
    price: 26490000,
    stock: 3,
    img: 'https://placeholder.com/s24-ultra.jpg'
    },
    { 
    productId: 'P995', 
    productName: 'Chuột Logitech MX Master 3S', 
    price: 2350000,
    stock: 20,
    img: 'https://placeholder.com/mx-master-3s.jpg'
    },
    { 
    productId: 'P994', 
    productName: 'Bàn phím cơ Keychron K2 V2', 
    price: 1850000,
    stock: 0, // Để test trường hợp Hết hàng
    img: 'https://placeholder.com/keychron-k2.jpg'
    },
    { 
    productId: 'P993', 
    productName: 'Màn hình Dell UltraSharp U2723QE', 
    price: 13500000,
    stock: 6,
    img: 'https://placeholder.com/dell-u2723qe.jpg'
    },
    { 
    productId: 'P992', 
    productName: 'Sạc dự phòng Anker 20.000mAh', 
    price: 1200000,
    stock: 50,
    img: 'https://placeholder.com/anker-powerbank.jpg'
    },
    { 
    productId: 'P991', 
    productName: 'iPad Pro M2 11" WiFi 128GB', 
    price: 20490000,
    stock: 12,
    img: 'https://placeholder.com/ipad-pro-m2.jpg'
    },
    { 
    productId: 'P990', 
    productName: 'Đồng hồ Apple Watch Series 9', 
    price: 9250000,
    stock: 7,
    img: 'https://placeholder.com/apple-watch-s9.jpg'
    }
];

export const USERS = [
    {
        id: "user01",
        email: "test@gmail.com",
        password: "123",
        fullName: "Người Dùng Thử",
        role: "customer"
    },
    {
        id: "user02",
        email: "admin@gmail.com",
        password: "admin",
        fullName: "Quản Trị Viên",
        role: "admin"
    }
];