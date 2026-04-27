export function calculateOrderPrice(cartItems, coupon = null, shippingFee = 0) { //hàm tính toán giá trị đơn hàng dựa trên các sản phẩm trong giỏ hàng, coupon và phí vận chuyển
    if (!Array.isArray(cartItems)) {
        throw new Error("Invalid cart");
    }

    const subtotal = cartItems.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0); //tính tổng tiền của các sản phẩm trong giỏ hàng

    let discount = 0;

    if (coupon) {
        if (coupon.type === "percent") {
            discount = subtotal * (coupon.value / 100);
        } else if (coupon.type === "fixed") {
            discount = coupon.value;
        } //tính giảm giá dựa trên loại coupon
    }

    if (shippingFee < 0) {
        throw new Error("Invalid shipping fee");
    }

    const total = subtotal - discount + shippingFee;

    return { //trả về một đối tượng chứa subtotal, discount, shippingFee và total
        subtotal,
        discount,
        shippingFee,
        total
    };
}

export function checkInventoryAvailability(cartItems) { //hàm kiểm tra xem số lượng sản phẩm trong giỏ hàng có vượt quá số lượng tồn kho hay không
    for (const item of cartItems) {
        if (item.quantity > item.stock) {
            return false;
        }
    }
    return true;
}


