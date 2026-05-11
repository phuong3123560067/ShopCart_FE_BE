export function validateCartItem({product_id, quantity, stock}) {
    if (quantity === null || quantity === undefined) {
        throw new Error("Số lượng không được để trống");
    }
    if (quantity <= 0) {
        throw new Error("Số lượng phải lớn hơn 0");
    }
    if (quantity > stock) {
        throw new Error("Số lượng vượt quá tồn kho");
    }
    return { success: true }; //nếu tất cả các điều kiện đều hợp lệ, trả về true
}

export function calculateCartTotal(cart, discount = 0) {
    if (!Array.isArray(cart) || cart.length === 0) {
        return 0;
    }

    let total = cart.reduce((sum, item) => {
        const price = item.price || (item.product && item.product.price) || 0;
        return sum + (price * item.quantity);
    }, 0);

    // Làm tròn để tránh lỗi số lẻ khi nhân phần trăm
    return Math.round(total * (1 - discount / 100));
}