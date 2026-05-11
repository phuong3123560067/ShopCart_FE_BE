import { describe, test, expect } from "vitest";
import { validateCartItem, calculateCartTotal } from "../utils/cartValidation";
import { VALID_CART, EMPTY_CART, PRODUCT_AVAILABLE, PRODUCT_OUT_OF_STOCK, COUPONS } from "../tests/mockData/cart.mock"; 

describe('Cart Validation Test', () => {
    test('TC1: số lượng hợp lệ - sử dụng sản phẩm còn hàng', () => {
        const result = validateCartItem({ 
            product_id: PRODUCT_AVAILABLE.product_id, 
            quantity: 5, 
            stock: PRODUCT_AVAILABLE.stock 
        });
        expect(result.success).toBe(true);
    });

    test('TC2: số lượng không được để trống - trả về lỗi', () => {
        expect(() =>
            validateCartItem({ product_id: PRODUCT_AVAILABLE.product_id, quantity: null, stock: 10 })
        ).toThrow("Số lượng không được để trống");
    });

    test('TC3: số lượng = 0 - trả về lỗi', () => {
        expect(() =>
            validateCartItem({ product_id: PRODUCT_AVAILABLE.product_id, quantity: 0, stock: 10 })
        ).toThrow("Số lượng phải lớn hơn 0");
    });

    test('TC5: số lượng vượt quá tồn kho thực tế - trả về lỗi', () => {
        expect(() =>
            validateCartItem({ 
                product_id: PRODUCT_AVAILABLE.product_id, 
                quantity: PRODUCT_AVAILABLE.stock + 1, 
                stock: PRODUCT_AVAILABLE.stock 
            })
        ).toThrow("Số lượng vượt quá tồn kho");
    });

    test('TC10: sản phẩm hết hàng - stock = 0', () => {
        expect(() =>
            validateCartItem({ 
                product_id: PRODUCT_OUT_OF_STOCK.product_id, 
                quantity: 1, 
                stock: PRODUCT_OUT_OF_STOCK.stock 
            })
        ).toThrow("Số lượng vượt quá tồn kho");
    });
});

describe('Calculate Cart Total Test', () => {
    test('TC6: giỏ hàng rỗng', () => {
        const total = calculateCartTotal(EMPTY_CART.items);
        expect(total).toBe(0);
    });

    test('TC7: tính tổng tiền giỏ hàng tiêu chuẩn', () => {
        const cartForFunction = VALID_CART.items.map(item => ({
            product: { price: item.price },
            quantity: item.quantity
        }));
        
        const total = calculateCartTotal(cartForFunction);
        expect(total).toBe(21000000);
    });

    test('TC8: tính tổng tiền với mã GIAM10', () => {
        const cartForFunction = VALID_CART.items.map(item => ({
            product: { price: item.price },
            quantity: item.quantity
        }));
        
        const discount = COUPONS.GIAM10.discount_percent; 
        const total = calculateCartTotal(cartForFunction, discount); 
        
        // 21.000.000 - 10% = 18.900.000
        expect(total).toBe(18900000); 
    });

    test('TC9: sau khi xóa sản phẩm - tổng tiền cập nhật lại', () => {
        const cartForFunction = VALID_CART.items.map(item => ({
            product: { price: item.price },
            quantity: item.quantity
        }));
        
        cartForFunction.splice(0, 1);
        const total = calculateCartTotal(cartForFunction);
        
        expect(total).toBe(1000000); 
    });
});