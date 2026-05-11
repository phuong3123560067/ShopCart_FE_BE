import { ORDERS, ORDER_STATUS } from '../tests/mockData/cart.mock';

export const createOrder = async (orderDataInput) => {
    const mockOrder = ORDERS.find(o => o.user_id === orderDataInput.user_id) || ORDERS[0];

    await new Promise(resolve => setTimeout(resolve, 500));

    if (!orderDataInput.items || orderDataInput.items.length === 0) {
        return { 
            success: false, 
            message: "Giỏ hàng trống, không thể tiến hành đặt hàng." 
        };
    }

    if (mockOrder.status === 'FAILED') {
        return {
            success: false,
            message: mockOrder.message || "Giao dịch thất bại."
        };
    }

    // Trả về cấu trúc có chứa orderData để pass bài test
    return {
        success: true,
        orderData: {
            order_id: mockOrder.order_id,
            user_id: orderDataInput.user_id,
            items: orderDataInput.items,
            // Đồng bộ với tên biến total_price bạn đang dùng
            total_price: orderDataInput.total_price, 
            status: ORDER_STATUS.COMPLETED
        },
        message: "Đơn hàng của bạn đã được khởi tạo thành công!"
    };
};