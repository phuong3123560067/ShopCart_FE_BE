export function validateCartItem({productID, quantity, stock}) {
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
        return 0; //nếu giỏ hàng không phải là một mảng hoặc giỏ hàng rỗng, trả về tổng tiền là 0
    }

    let total = cart.reduce((sum,item) => {
        return sum + item.product.price * item.quantity;
    }, 0);

    return total * (1 - discount/100);
}