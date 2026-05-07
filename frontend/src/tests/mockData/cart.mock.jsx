// Giỏ hàng tiêu chuẩn
export const VALID_CART = {
    cart_id: 1,
    user_id: 1,
    items: [
        { 
            product_id: 1, 
            name: 'Laptop Dell', 
            price: 20000000, 
            quantity: 1, 
            stock: 10 
        },
        { 
            product_id: 2, 
            name: 'Mouse Logitech', 
            price: 500000, 
            quantity: 2, 
            stock: 10 
        }
    ],
    total_price: 21000000
};

// Giỏ hàng trống
export const EMPTY_CART = {
    cart_id: 0,
    user_id: 1,
    items: [],
    total_price: 0
};

export const OUT_OF_STOCK_CART = {
    cart_id: 2,
    user_id: 1,
    items: [
        { 
            product_id: 994, 
            name: 'Bàn phím cơ Keychron K2 V2', 
            price: 1850000, 
            quantity: 1, 
            stock: 0 // Sản phẩm đã hết hàng trong DB
        }
    ],
    total_price: 0
};

export const PRODUCT_AVAILABLE = { 
    product_id: 999, 
    name: 'Sản phẩm còn hàng', 
    price: 100000,
    stock: 10,
    status: 'Active'
};

export const PRODUCT_OUT_OF_STOCK = { 
    product_id: 0, 
    name: 'Sản phẩm hết hàng', 
    price: 200000,
    stock: 0,
    status: 'Active'
};

export const COUPONS = {
    "GIAM10": { 
        coupon_id: 1,
        code: "GIAM10", 
        discount_percent: 10, 
        min_order_value: 1000000 
    },
    "FREESHIP": {
        coupon_id: 2,
        code: "FREESHIP",
        discount_amount: 30000,
        min_order_value: 0
    }
};

export const SHIPPING = {
    DEFAULT: 30000, // cơ bản
    FREE_THRESHOLD: 1000000 // Freeship nếu đơn trên 1 triệu
};

export const ORDER_STATUS = {
    PENDING: 'Pending',
    SHIPPING: 'Shipping',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
};

export const PRODUCT_LIST = [
    { 
        product_id: 1,
        name: 'Laptop Dell',
        price: 20000000,
        stock: 10,
        image_url: 'https://placeholder.com/laptop-dell.jpg'
    },
    { 
        product_id: 2, 
        name: 'Mouse Logitech', 
        price: 500000,
        stock: 10,
        image_url: 'https://placeholder.com/mouse-logitech.jpg'
    },
    { 
        product_id: 999, 
        name: 'iPhone 15 Pro Max 256GB', 
        price: 29500000,
        stock: 5,
        image_url: 'https://placeholder.com/iphone-15-pro.jpg'
    },
    { 
        product_id: 998, 
        name: 'MacBook Air M2 13" 8GB/256GB', 
        price: 24990000,
        stock: 8,
        image_url: 'https://placeholder.com/macbook-m2.jpg'
    },
    { 
        product_id: 997, 
        name: 'Tai nghe AirPods Pro Gen 2', 
        price: 5850000,
        stock: 15,
        image_url: 'https://placeholder.com/airpods-pro.jpg'
    },
    { 
        product_id: 996, 
        name: 'Samsung Galaxy S24 Ultra', 
        price: 26490000,
        stock: 3,
        image_url: 'https://placeholder.com/s24-ultra.jpg'
    },
    { 
        product_id: 995, 
        name: 'Chuột Logitech MX Master 3S', 
        price: 2350000,
        stock: 20,
        image_url: 'https://placeholder.com/mx-master-3s.jpg'
    },
    { 
        product_id: 994, 
        name: 'Bàn phím cơ Keychron K2 V2', 
        price: 1850000,
        stock: 0, // Dùng để test case hết hàng
        image_url: 'https://placeholder.com/keychron-k2.jpg'
    },
    { 
        product_id: 993, 
        name: 'Màn hình Dell UltraSharp U2723QE', 
        price: 13500000,
        stock: 6,
        image_url: 'https://placeholder.com/dell-u2723qe.jpg'
    },
    { 
        product_id: 992, 
        name: 'Sạc dự phòng Anker 20.000mAh', 
        price: 1200000,
        stock: 50,
        image_url: 'https://placeholder.com/anker-powerbank.jpg'
    },
    { 
        product_id: 991, 
        name: 'iPad Pro M2 11" WiFi 128GB', 
        price: 20490000,
        stock: 12,
        image_url: 'https://placeholder.com/ipad-pro-m2.jpg'
    },
    { 
        product_id: 990, 
        name: 'Đồng hồ Apple Watch Series 9', 
        price: 9250000,
        stock: 7,
        image_url: 'https://placeholder.com/apple-watch-s9.jpg'
    }
];

export const USERS = [
    {
        id: "user01",
        email: "test@gmail.com",
        password: "123",
        full_name: "Người Dùng Thử",
        role: "customer"
    },
    {
        id: "user02",
        email: "admin@gmail.com",
        password: "admin",
        full_name: "Quản Trị Viên",
        role: "admin"
    }
];

export const ORDERS = [
    { 
        order_id: 101,          
        user_id: 1,             
        total_amount: 21000000,
        status: 'SUCCESS',      
        message: 'Thanh toán thành công qua thẻ tín dụng',
        created_at: '2026-05-01 10:00:00',
        items: [
            { product_id: 1, quantity: 1, price: 20000000 },
            { product_id: 2, quantity: 2, price: 500000 }
        ]
    },
    { 
        order_id: 102, 
        user_id: 2,             // Dùng để test luồng thất bại
        total_amount: 0, 
        status: 'FAILED',       // Trạng thái Cancelled/Failed để kiểm soát luồng
        message: 'Giao dịch bị từ chối: Số dư tài khoản không đủ',
        created_at: '2026-05-02 14:30:00',
        items: []
    }
];
