import { describe, test, expect } from "vitest";
import { calculateOrderPrice, checkInventoryAvailability } from "../utils/priceCalculation";

describe("Price Calculation Tests", () => {

    test("TC1: Tính tổng giá không có giảm giá", () => {
        const items = [
            { price: 15000000, quantity: 2 },
            { price: 500000, quantity: 1 },
        ];

        const result = calculateOrderPrice(items, null, 50000);

        expect(result.subtotal).toBe(30500000);
        expect(result.discount).toBe(0);
        expect(result.shippingFee).toBe(50000);
        expect(result.total).toBe(30550000);
    });

    test("TC2: Áp dụng giảm giá 10%", () => {
        const items = [
            { price: 1000000, quantity: 2 }, // 2tr
        ];

        const coupon = { type: "percent", value: 10 };

        const result = calculateOrderPrice(items, coupon, 0);

        expect(result.subtotal).toBe(2000000);
        expect(result.discount).toBe(200000);
        expect(result.total).toBe(1800000);
    });

    test("TC3: Áp dụng giảm giá số tiền cố định", () => {
        const items = [
            { price: 1000000, quantity: 2 }, // 2tr
        ];

        const coupon = { type: "fixed", value: 300000 };

        const result = calculateOrderPrice(items, coupon, 0);

        expect(result.subtotal).toBe(2000000);
        expect(result.discount).toBe(300000);
        expect(result.total).toBe(1700000);
    });

    test("TC4: Tính phí vận chuyển", () => {
        const items = [
            { price: 500000, quantity: 2 }, // 1tr
        ];

        const result = calculateOrderPrice(items, null, 50000);

        expect(result.total).toBe(1050000);
    });

    test("TC5: Tổng cuối cùng (subtotal + shipping - discount)", () => {
        const items = [
            { price: 1000000, quantity: 1 }, // 1tr
        ];

        const coupon = { type: "percent", value: 20 }; // -200k

        const result = calculateOrderPrice(items, coupon, 50000);

        expect(result.total).toBe(850000); // 1tr - 200k + 50k
    });
});

describe("Inventory Tests", () => {

    test("TC6: Tất cả sản phẩm đủ hàng", () => {
        const items = [
            { quantity: 2, stock: 5 },
            { quantity: 1, stock: 10 },
        ];

        const result = checkInventoryAvailability(items);

        expect(result).toBe(true);
    });

    test("TC7: Có sản phẩm vượt tồn kho", () => {
        const items = [
            { quantity: 6, stock: 5 },
        ];

        const result = checkInventoryAvailability(items);

        expect(result).toBe(false);
    });

    test("TC8: Sản phẩm hết hàng", () => {
        const items = [
            { quantity: 1, stock: 0 },
        ];

        const result = checkInventoryAvailability(items);

        expect(result).toBe(false);
    });
});