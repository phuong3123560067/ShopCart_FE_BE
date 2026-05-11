package com.shopcart.service;

import com.shopcart.dto.CartItemRequest;
import com.shopcart.dto.CartResponse;
import com.shopcart.entity.Cart;
import com.shopcart.entity.CartItem;
import com.shopcart.entity.Product;
import com.shopcart.entity.User;
import com.shopcart.repository.CartItemRepository;
import com.shopcart.repository.CartRepository;
import com.shopcart.repository.ProductRepository;
import com.shopcart.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Cart Service Unit Tests")
class CartServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private CartService cartService;

    private User testUser;
    private Cart testCart;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        // Khởi tạo dữ liệu mẫu dùng chung
        testUser = new User();
        testUser.setUserId(1);
        testUser.setEmail("test@gmail.com");

        testCart = new Cart();
        testCart.setId(100);
        testCart.setUserId(1);

        testProduct = new Product();
        testProduct.setId(1);
        testProduct.setName("Dell G15");
        testProduct.setPrice(new BigDecimal("15000000"));
        testProduct.setStock(100);

        // Giả lập Authentication trả về email của testUser để getUserIdFromAuth hoạt động
        lenient().when(authentication.getName()).thenReturn("test@gmail.com");
        lenient().when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(testUser));
    }

    @Test
    @DisplayName("TC1: Thêm vào giỏ thành công")
    void testAddToCartSuccess_Service() {
        CartItemRequest request = new CartItemRequest(1, 2);

        when(productRepository.findById(1)).thenReturn(Optional.of(testProduct));
        when(cartRepository.findByUserId(1)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findByCartIdAndProductId(100, 1)).thenReturn(Optional.empty());

        CartItem newItem = new CartItem(null, 100, 1, 2);
        when(cartItemRepository.findByCartId(100)).thenReturn(List.of(newItem));

        CartResponse response = cartService.addToCart(authentication, request);

        assertNotNull(response);
        assertEquals(0, new BigDecimal("30000000").compareTo(response.getCartTotal()));
        assertTrue(response.getMessage().contains("Đã thêm Dell G15"));
    }

    @Test
    @DisplayName("TC2: Thêm sản phẩm đã có - Cộng dồn số lượng")
    void testAddToCartExistingProduct() {
        when(productRepository.findById(1)).thenReturn(Optional.of(testProduct));
        when(cartRepository.findByUserId(1)).thenReturn(Optional.of(testCart));

        CartItem existingItem = new CartItem(50, 100, 1, 1);
        when(cartItemRepository.findByCartIdAndProductId(100, 1)).thenReturn(Optional.of(existingItem));

        CartItem updatedItem = new CartItem(50, 100, 1, 3);
        when(cartItemRepository.findByCartId(100)).thenReturn(List.of(updatedItem));

        CartItemRequest request = new CartItemRequest(1, 2);

        CartResponse response = cartService.addToCart(authentication, request);

        assertEquals(3, response.getItems().get(0).getQuantity());
        verify(cartItemRepository).save(any(CartItem.class));
    }

    @Test
    @DisplayName("TC3: Thêm sản phẩm khi tồn kho không đủ - Báo lỗi")
    void testAddToCartInsufficientStock() {
        CartItemRequest request = new CartItemRequest(1, 200); // Kho có 100, mua 200

        when(productRepository.findById(1)).thenReturn(Optional.of(testProduct));
        when(cartRepository.findByUserId(1)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findByCartIdAndProductId(100, 1)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            cartService.addToCart(authentication, request);
        });

        assertTrue(exception.getMessage().contains("Không đủ tồn kho"));
        verify(cartItemRepository, never()).save(any());
    }

    @Test
    @DisplayName("TC4: Thêm sản phẩm không tồn tại - Báo lỗi")
    void testAddToCartProductNotFound() {
        CartItemRequest request = new CartItemRequest(999, 1);
        when(productRepository.findById(999)).thenReturn(Optional.empty());
        when(cartRepository.findByUserId(1)).thenReturn(Optional.of(testCart));

        assertThrows(RuntimeException.class, () -> {
            cartService.addToCart(authentication, request);
        });

        verify(cartItemRepository, never()).save(any());
    }

    @Test
    @DisplayName("TC5: Cập nhật số lượng thành công")
    void testUpdateQuantitySuccess() {
        when(cartRepository.findByUserId(1)).thenReturn(Optional.of(testCart));

        CartItem existingItem = new CartItem(50, 100, 1, 2);
        when(cartItemRepository.findByCartIdAndProductId(100, 1)).thenReturn(Optional.of(existingItem));
        when(productRepository.findById(1)).thenReturn(Optional.of(testProduct));

        CartItem updatedItem = new CartItem(50, 100, 1, 5);
        when(cartItemRepository.findByCartId(100)).thenReturn(List.of(updatedItem));

        CartItemRequest request = new CartItemRequest(1, 5);
        CartResponse result = cartService.updateQuantity(authentication, request);

        assertEquals(5, result.getItems().get(0).getQuantity());
        verify(cartItemRepository).save(any(CartItem.class));
    }

    @Test
    @DisplayName("TC6: Xóa sản phẩm khỏi giỏ hàng")
    void testRemoveFromCart() {
        when(cartRepository.findByUserId(1)).thenReturn(Optional.of(testCart));

        CartItem existingItem = new CartItem(50, 100, 1, 2);
        when(cartItemRepository.findByCartIdAndProductId(100, 1)).thenReturn(Optional.of(existingItem));
        when(cartItemRepository.findByCartId(100)).thenReturn(Collections.emptyList());

        cartService.removeFromCart(authentication, 1);

        verify(cartItemRepository, times(1)).delete(existingItem);
    }

    @Test
    @DisplayName("TC7: Số lượng không hợp lệ (âm/null)")
    void testAddToCartInvalidQuantity() {
        CartItemRequest request = new CartItemRequest(1, -1);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            cartService.addToCart(authentication, request);
        });

        assertEquals("Số lượng không hợp lệ", exception.getMessage());
    }

    @Test
    @DisplayName("TC8: Áp dụng mã giảm giá thành công")
    void testApplyCoupon_Success() {
        testProduct.setPrice(new BigDecimal("1000000")); // Giá đủ đk giảm
        when(productRepository.findById(1)).thenReturn(Optional.of(testProduct));
        when(cartRepository.findByUserId(1)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findByCartId(100)).thenReturn(List.of(new CartItem(null, 100, 1, 1)));

        CartResponse response = cartService.applyCoupon(authentication, "GIAM500K");

        assertEquals(0, new BigDecimal("500000").compareTo(response.getCartTotal()));
        assertEquals(0, new BigDecimal("500000").compareTo(response.getDiscountAmount()));
    }

    @Test
    @DisplayName("TC9: Lấy thông tin giỏ hàng thành công")
    void testGetCart_Success() {
        when(productRepository.findById(1)).thenReturn(Optional.of(testProduct));
        when(cartRepository.findByUserId(1)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findByCartId(100)).thenReturn(List.of(new CartItem(null, 100, 1, 2)));

        CartResponse response = cartService.getCartResponse(authentication);

        assertEquals(0, new BigDecimal("30000000").compareTo(response.getCartTotal()));
        assertEquals("Lấy thông tin giỏ hàng thành công", response.getMessage());
    }

    @Test
    @DisplayName("TC10: Hủy mã giảm giá thành công")
    void testRemoveCoupon_Success() {
        when(productRepository.findById(1)).thenReturn(Optional.of(testProduct));
        when(cartRepository.findByUserId(1)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findByCartId(100)).thenReturn(List.of(new CartItem(null, 100, 1, 1)));

        CartResponse response = cartService.removeCoupon(authentication);

        assertEquals(0, new BigDecimal("15000000").compareTo(response.getCartTotal()));
        assertEquals("Đã hủy mã giảm giá", response.getMessage());
    }

    @Test
    @DisplayName("TC11: Checkout lỗi khi giỏ hàng trống")
    void checkout_ShouldThrowException_WhenCartIsEmpty() {
        when(cartRepository.findByUserId(1)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findByCartId(100)).thenReturn(Collections.emptyList());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            cartService.checkout(authentication);
        });

        assertEquals("Giỏ hàng đang trống, không thể thanh toán", exception.getMessage());
    }

    @Test
    @DisplayName("TC12: Checkout thành công khi có sản phẩm")
    void testCheckout_Success() {
        when(cartRepository.findByUserId(1)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findByCartId(100)).thenReturn(List.of(new CartItem()));

        assertDoesNotThrow(() -> cartService.checkout(authentication));
    }

    @Test
    @DisplayName("TC13: Tạo giỏ hàng mới nếu người dùng chưa có")
    void testGetCartResponse_CreateNewCart() {
        when(cartRepository.findByUserId(1)).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);
        when(cartItemRepository.findByCartId(100)).thenReturn(Collections.emptyList());

        CartResponse response = cartService.getCartResponse(authentication);

        assertNotNull(response);
        verify(cartRepository, times(1)).save(any(Cart.class));
    }

    @Test
    @DisplayName("TC14: Xóa sản phẩm khỏi giỏ khi cập nhật số lượng <= 0")
    void testUpdateQuantity_DeleteWhenZero() {
        CartItemRequest req = new CartItemRequest(1, 0);

        when(cartRepository.findByUserId(1)).thenReturn(Optional.of(testCart));
        CartItem item = new CartItem(50, 100, 1, 2);
        when(cartItemRepository.findByCartIdAndProductId(100, 1)).thenReturn(Optional.of(item));
        when(cartItemRepository.findByCartId(100)).thenReturn(Collections.emptyList());

        cartService.updateQuantity(authentication, req);

        verify(cartItemRepository, times(1)).delete(item);
    }

    @Test
    @DisplayName("TC15: Áp dụng mã không khả dụng (giá trị đơn hàng thấp)")
    void testApplyCoupon_Invalid() {
        testProduct.setPrice(new BigDecimal("100000")); // Giá thấp hơn 1tr
        when(productRepository.findById(1)).thenReturn(Optional.of(testProduct));
        when(cartRepository.findByUserId(1)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findByCartId(100)).thenReturn(List.of(new CartItem(null, 100, 1, 1)));

        CartResponse response = cartService.applyCoupon(authentication, "GIAM500K");

        assertEquals(0, BigDecimal.ZERO.compareTo(response.getDiscountAmount()));
        assertEquals("Mã không khả dụng", response.getMessage());
    }
}