package com.shopcart.service;

import com.shopcart.dto.CartItemRequest;
import com.shopcart.dto.CartResponse; // Hoặc CartItem tùy thuộc vào kiểu trả về của bạn
import com.shopcart.entity.Product;    // Chỉnh lại từ ProductExample thành Product nếu cần
import com.shopcart.entity.CartItem;   
import com.shopcart.repository.ProductRepository;
import com.shopcart.repository.CartRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Cart Service Unit Tests")
class CartServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CartRepository cartRepository;

    @InjectMocks
    private CartService cartService;

@Test
    @DisplayName("TC1: Them san pham vao gio hang thanh cong")
    void testAddToCartSuccess() {
        // 1. Khởi tạo Product đúng kiểu Entity và Constructor
        Product product = new Product(1L, "Laptop Dell", 15000000L, 10);

        // 2. Khởi tạo Request đúng DTO
        CartItemRequest request = new CartItemRequest(1L, 2);

        // 3. Giả lập hành vi (Stubbing) giống hệt hình mẫu
        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));
        
        when(cartRepository.save(any(CartItem.class)))
                .thenAnswer(inv -> inv.getArgument(0)); // Trả về chính đối tượng được lưu[cite: 1]

        // 4. Thực thi: Hứng bằng CartResponse để tránh lỗi Type Mismatch[cite: 2, 6]
        CartResponse result = cartService.addToCart("user01", request);

        // 5. Kiểm tra kết quả (Assert) giống hệt hình mẫu
        assertNotNull(result);
        assertEquals(2, result.getQuantity());
        assertEquals("Laptop Dell", result.getProductName());

        // 6. Xác minh (Verify) giống hệt hình mẫu
        verify(cartRepository, times(1))
                .save(any(CartItem.class));
    }

    @Test
    @DisplayName("TC2: Them san pham da co trong gio - Cong don so luong")
    void testAddToCartExistingProduct() {
        // 1. Giả lập Product tồn tại
        Product product = new Product(1L, "Dell G15", 25000000L, 10);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // 2. Giả lập đã có 1 sản phẩm trong giỏ
        CartItem existingItem = new CartItem("user1", 1L, "Dell G15", 
                                     BigDecimal.valueOf(25000000), 1);
        // Sử dụng anyString() và anyLong() để đảm bảo Mock nhận diện đúng tham số truyền vào
        when(cartRepository.findByUserIdAndProductId(anyString(), anyLong()))
                .thenReturn(Optional.of(existingItem));

        // 3. SỬA TẠI ĐÂY: Trả về bất kỳ CartItem nào được save (đã cộng dồn)
        when(cartRepository.save(any(CartItem.class))).thenAnswer(invocation -> {
            CartItem savedItem = invocation.getArgument(0);
            return savedItem; // Trả về đối tượng sau khi Service đã thực hiện setQuantity(3)
        });

        // 4. Thực thi
        CartItemRequest request = new CartItemRequest(1L, 2); 
        CartResponse response = cartService.addToCart("user1", request);

        // 5. Kiểm tra kết quả
        assertNotNull(response);
        assertEquals(3, response.getQuantity()); 
        // Verify xem có đúng là lệnh save đã được gọi hay không
        verify(cartRepository, times(1)).save(any(CartItem.class));
    }

    @Test
    @DisplayName("TC3: Them san pham khi ton kho khong du - Bao loi")
    void testAddToCartInsufficientStock() {
        CartItemRequest request = new CartItemRequest(1L, 20); 
        Product product = new Product(1L, "Laptop Dell", 15000000L, 10); 

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThrows(RuntimeException.class, () -> {
            cartService.addToCart("user01", request);
        }); 
        
        verify(cartRepository, never()).save(any(CartItem.class));
    }

    @Test
    @DisplayName("TC4: Them san pham khong ton tai - Bao loi")
    void testAddToCartProductNotFound() {
        // 1. Given: Sử dụng 999L thay vì "P999" để khớp với kiểu Long của productId
        CartItemRequest request = new CartItemRequest(999L, 1);
        
        // Đảm bảo findById cũng nhận tham số 999L
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        // 2. When & Then: Kiểm tra việc ném ngoại lệ
        assertThrows(RuntimeException.class, () -> {
            cartService.addToCart("user01", request);
        });

        // Xác minh rằng lệnh save không bao giờ được gọi khi có lỗi
        verify(cartRepository, never()).save(any(CartItem.class));
    }

    @Test
    @DisplayName("TC5: Cap nhat so luong trong gio hang thanh cong")
    void testUpdateQuantitySuccess() {
        // 1. Given
        CartItem existingItem = new CartItem("user01", 1L, "Laptop Dell", 
                                     BigDecimal.valueOf(15000000), 2);
        Product product = new Product(1L, "Laptop Dell", 15000000L, 10);
        
        // Đóng gói tham số vào Request giống như bài mẫu TC1
        CartItemRequest request = new CartItemRequest(1L, 5); 

        when(cartRepository.findByUserIdAndProductId("user01", 1L)).thenReturn(Optional.of(existingItem));
        when(cartRepository.save(any(CartItem.class))).thenAnswer(inv -> inv.getArgument(0));

        // 2. When: Truyền đúng đối tượng request
        CartResponse result = cartService.updateQuantity("user01", request); 

        // 3. Then
        assertEquals(5, result.getQuantity());
        verify(cartRepository).save(any(CartItem.class));
    }

    @Test
    @DisplayName("TC6: Xoa san pham khoi gio hang")
    void testRemoveFromCart() {
        // 1. Given: Chuyển "P001" thành 1L để khớp với kiểu Long của Entity
        CartItem existingItem = new CartItem("user01", 1L, "Laptop Dell", 
                                     BigDecimal.valueOf(15000000), 2);
        
        // Đảm bảo tham số truyền vào findBy... cũng là 1L
        when(cartRepository.findByUserIdAndProductId("user01", 1L))
                .thenReturn(Optional.of(existingItem));

        // 2. When: Chuyển tham số productId thành 1L
        cartService.removeFromCart("user01", 1L);

        // 3. Then: Xác minh lệnh xóa được gọi
        verify(cartRepository, times(1)).delete(existingItem);
    }

    @Test
    @DisplayName("TC7: Validate quantity <= 0")
    void testAddToCartInvalidQuantity() {
        CartItemRequest request = new CartItemRequest(1L, 0);
        
        CartResponse response = cartService.addToCart("user1", request);
        
        assertFalse(response.isSuccess());
        assertEquals("Số lượng không hợp lệ", response.getMessage());
    }

    @Test
    @DisplayName("TC8: Thêm sản phẩm mới vào giỏ")
    void testAddToCartNewProduct() {
        Product product = new Product(2L, "Mouse", BigDecimal.valueOf(500000), 20);
        when(productRepository.findById(2L)).thenReturn(Optional.of(product));
        when(cartRepository.findByUserIdAndProductId(anyString(), anyLong())).thenReturn(Optional.empty());
        when(cartRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        CartResponse response = cartService.addToCart("user1", new CartItemRequest(2L, 3));

        assertTrue(response.isSuccess());
        assertEquals(3, response.getQuantity());
    }

}