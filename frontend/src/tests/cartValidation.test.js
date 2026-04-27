import { describe, test, expect } from "vitest";
import { validateCartItem } from "../utils/cartValidation";
import { calculateCartTotal } from "../utils/cartValidation";

describe('Cart Validation Test', () => {
    test('TC1: số lượng hợp lệ - trả về true', () => {
        const result = validateCartItem({ productID: "P001", quantity: 5, stock: 10 });
        expect(result.success).toBe(true);
    });

    test('TC2: số lượng không được để trống - trả về lỗi', () => {
        expect(() =>
            validateCartItem({ productID: "P001", quantity: null, stock: 10 })
        ).toThrow("Số lượng không được để trống");
    });

    test('TC3: số lượng = 0 - trả về lỗi', () => {
        expect(() =>
            validateCartItem({ productID: "P001", quantity: 0, stock: 10 })
        ).toThrow("Số lượng phải lớn hơn 0");
    });

    test('TC4: số lượng âm - trả về lỗi', () => {
        expect(() =>
            validateCartItem({ productID: "P001", quantity: -1, stock: 10 })
        ).toThrow("Số lượng phải lớn hơn 0");
    });

    test('TC5: số lượng vượt quá tồn kho - trả về lỗi', () => {
        expect(() =>
            validateCartItem({ productID: "P001", quantity: 15, stock: 10 })
        ).toThrow("Số lượng vượt quá tồn kho");
    });

});

describe('Calculate Cart Total Test', () => {
    test('TC6: giỏ hàng rỗng - trả về tổng tiền là 0', () => {
        const cart = [];
        const total = calculateCartTotal(cart);
        expect(total).toBe(0);
    });

    test('TC7: tính tổng tiền giỏ hàng - trả về đúng tổng tiền', () => {
        const cart = [
            { product: { price: 100 }, quantity: 2 },
            { product: { price: 50 }, quantity: 3 }
        ];
        const total = calculateCartTotal(cart);
        expect(total).toBe(350);
    });

    test('TC8: tính tổng tiền với giảm giá - trả về đúng tổng tiền sau khi áp dụng giảm giá', () => {
        const cart = [
            { product: { price: 100 }, quantity: 2 },
            { product: { price: 50 }, quantity: 3 }
        ];
        const total = calculateCartTotal(cart, 10); //giảm giá 10%
        expect(total).toBe(315); //350 - 10% = 315
    });

    test('TC9: sau khi xóa sản phẩm - trả về đúng tổng tiền', () => {
        const cart = [
            { product: { price: 100 }, quantity: 2 },
            { product: { price: 50 }, quantity: 3 }
        ];
        cart.splice(0, 1); // xóa sản phẩm đầu tiên
        const total = calculateCartTotal(cart);
        expect(total).toBe(150); // chỉ còn lại sản phẩm thứ hai
    });
});
