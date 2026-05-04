export function calculateOrderPrice(cartItems, coupon = null, shippingFee = 0) {
    if (!Array.isArray(cartItems)) {
        throw new Error("Invalid cart");
    }

    const subtotal = cartItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    let discount = 0;

    if (coupon) {
        if (coupon.type === "percent") {
            discount = subtotal * (coupon.value / 100);
        } else if (coupon.type === "fixed") {
            discount = coupon.value;
        }
    }

    if (shippingFee < 0) {
        throw new Error("Invalid shipping fee");
    }

    // Sử dụng Math.max(0, ...) để tránh trường hợp tổng tiền bị âm nếu discount > subtotal
    const total = Math.max(0, subtotal - discount + shippingFee);

    return {
        // Dùng Math.round để kết quả luôn là số nguyên tròn (tiền VNĐ)
        subtotal: Math.round(subtotal),
        discount: Math.round(discount),
        shippingFee: Math.round(shippingFee),
        total: Math.round(total)
    };
}

export function checkInventoryAvailability(cartItems) {
    // Thêm kiểm tra mảng đầu vào để tránh lỗi runtime
    if (!Array.isArray(cartItems)) return false;

    for (const item of cartItems) {
        // Kiểm tra logic vượt tồn kho
        if (item.quantity > item.stock) {
            return false;
        }
    }
    return true;
}