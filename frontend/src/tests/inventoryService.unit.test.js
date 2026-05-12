import { describe, test, expect, vi, beforeEach } from 'vitest';
import * as inventoryService from '../services/inventoryService';

// 🌟 Mock module theo cách Partial Mock (giữ lại checkStock thật, giả lập getProducts)
vi.mock('../services/inventoryService', async () => {
    const actual = await vi.importActual('../services/inventoryService');
    return {
        ...actual,
        getProducts: vi.fn(), 
    };
});

describe('Inventory Service Unit Tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();

        // Định nghĩa dữ liệu kho ảo mặc định
        vi.mocked(inventoryService.getProducts).mockReturnValue([
            { product_id: 1,   name: "Laptop Dell",     stock: 10 }, //0
            { product_id: 998, name: "MacBook Pro",     stock: 5 }, //1
            { product_id: 994, name: "Bàn phím cơ",     stock: 0 }, //2
            { product_id: 999, name: "Test Product",    stock: 8 }, //3
        ]);
    });

    // --- NHÓM 1: KIỂM TRA TỒN KHO (checkStock) ---
    describe('checkStock function', () => {
        test('Nên trả về available: false khi số lượng vượt tồn kho', async () => {
            const items = [{ product_id: 998, name: 'MacBook Pro', quantity: 10 }];
            const result = await inventoryService.checkStock(items);
            expect(result.available).toBe(false);
            expect(result.message).toContain('không đủ số lượng');
        });

        test('Nên trả về available: true khi tất cả sản phẩm đều đủ tồn kho', async () => {
            const items = [
                { product_id: 1, name: 'Laptop Dell', quantity: 3 },
                { product_id: 999, name: 'Test Product', quantity: 2 }
            ];
            const result = await inventoryService.checkStock(items);
            expect(result.available).toBe(true);
        });

        test('Nên trả về available: false khi có sản phẩm hết hàng (stock = 0)', async () => {
            const items = [{ product_id: 994, name: 'Bàn phím cơ', quantity: 1 }];
            const result = await inventoryService.checkStock(items);
            expect(result.available).toBe(false);
        });

        test('Nên xử lý đúng khi product_id không tồn tại trong kho', async () => {
            const items = [{ product_id: 9999, name: 'Sản phẩm không tồn tại', quantity: 1 }];
            const result = await inventoryService.checkStock(items);
            expect(result.available).toBe(false);
        });
    });

    describe('decreaseStockAfterPurchase function', () => {

        beforeEach(() => {
            vi.clearAllMocks();
            vi.spyOn(Storage.prototype, 'setItem');
        });

        test('Nên trừ tồn kho chính xác sau khi thanh toán thành công', async () => {

                const cartItems = [
                    { product_id: 1, quantity: 3 }
                ];

                const result =
                    await inventoryService.decreaseStockAfterPurchase(cartItems);

                expect(result.success).toBe(true);

                const lastCall =
                    localStorage.setItem.mock.calls[
                        localStorage.setItem.mock.calls.length - 1
                    ];

                const savedData = JSON.parse(lastCall[1]);

                // Laptop Dell: 10 - 3 = 7
                expect(savedData[0].stock).toBe(7);
        });

        test('Nên trả về success false khi localStorage xảy ra lỗi', async () => {

            // giả lập localStorage lỗi
            vi.spyOn(Storage.prototype, 'setItem')
                .mockImplementation(() => {
                    throw new Error('LocalStorage Error');
                });

            const cartItems = [
                { product_id: 1, quantity: 2 }
            ];

            const result =
                await inventoryService.decreaseStockAfterPurchase(cartItems);

            expect(result.success).toBe(false);

            expect(result.message)
                .toBe("Không thể trừ tồn kho");
        });
    });
});