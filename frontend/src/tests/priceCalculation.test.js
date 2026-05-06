import { describe, test, expect } from "vitest";
import { calculateOrderPrice, checkInventoryAvailability } from "../utils/priceCalculation";
import { VALID_CART, COUPONS, SHIPPING, OUT_OF_STOCK_CART } from "../tests/mockData/cart.mock"; 

describe("Price Calculation Tests", () => {

    test("TC1: Tính tổng giá không có giảm giá - Dùng VALID_CART", () => {
        const shippingFee = SHIPPING.DEFAULT; // 30000
        const result = calculateOrderPrice(VALID_CART.items, null, shippingFee);

        // VALID_CART subtotal = 21,000,000[cite: 12]
        expect(result.subtotal).toBe(21000000); 
        expect(result.discount).toBe(0); 
        expect(result.shippingFee).toBe(30000); 
        expect(result.total).toBe(21030000);
    });

    test("TC2: Áp dụng mã giảm giá GIAM10", () => {
        const coupon = { 
            type: "percent", 
            value: COUPONS.GIAM10.discount_percent
        }; 

        const result = calculateOrderPrice(VALID_CART.items, coupon, 0);

        expect(result.subtotal).toBe(21000000); 
        expect(result.discount).toBe(2100000); // 10% của 21tr
        expect(result.total).toBe(18900000); 
    });

    test("TC3: Áp dụng mã giảm giá cố định (mã FREESHIP)", () => {
        const coupon = { 
            type: "fixed", 
            value: COUPONS.FREESHIP.discount_amount // 30000
        }; 

        const result = calculateOrderPrice(VALID_CART.items, coupon, 0);

        expect(result.subtotal).toBe(21000000); 
        expect(result.discount).toBe(30000);
        expect(result.total).toBe(20970000); 
    });

    test("TC4: Tổng cuối cùng (Subtotal + Shipping - Discount)", () => {
        const coupon = { type: "percent", value: 20 }; 
        const shippingFee = SHIPPING.DEFAULT; // 30000

        const result = calculateOrderPrice(VALID_CART.items, coupon, shippingFee);

        // 21tr - (21tr * 0.2) + 30k = 16,8tr + 30k = 16,830,000
        expect(result.total).toBe(16830000); 
    });
});

describe("Inventory Tests", () => {

    test("TC5: Tất cả sản phẩm đủ hàng", () => {
        const result = checkInventoryAvailability(VALID_CART.items);
        expect(result).toBe(true); 
    });

    test("TC6: Có sản phẩm vượt tồn kho", () => {
        // Tạo dữ liệu giả lập vượt stock dựa trên dữ liệu thật
        const items = [
            { quantity: 11, stock: 10 } 
        ]; 

        const result = checkInventoryAvailability(items);
        expect(result).toBe(false); 
    });

    test("TC7: Sản phẩm hết hàng", () => {
        const result = checkInventoryAvailability(OUT_OF_STOCK_CART.items);
        expect(result).toBe(false); 
    });
});