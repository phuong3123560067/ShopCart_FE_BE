package com.shopcart.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.shopcart.repository.CartItemRepository;
import com.shopcart.repository.CartRepository;
import com.shopcart.repository.OrderRepository;
import com.shopcart.repository.ProductRepository;
import com.shopcart.dto.OrderRequest;
import com.shopcart.dto.OrderResponse;
import com.shopcart.entity.Cart;
import com.shopcart.entity.CartItem;
import com.shopcart.entity.Order;
import com.shopcart.entity.Product;
import com.shopcart.model.OrderStatus;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository; 

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void testCreateOrderSuccess() {
        // 1. Setup Request: Dùng Integer 123 thay vì String "user123"
        OrderRequest request = new OrderRequest();
        request.setUserId(123); 
        
        // 2. Giả lập Giỏ hàng và Items
        Cart mockCart = new Cart();
        mockCart.setId(100);
        when(cartRepository.findByUserId(123)).thenReturn(Optional.of(mockCart));

        CartItem item = new CartItem();
        item.setProductId(1); // Dùng Integer 1 thay vì 1L
        item.setQuantity(2);
        when(cartItemRepository.findByCartId(100)).thenReturn(List.of(item)); 
        
        Product product = new Product();
        product.setStock(10); // Sửa từ setInventoryQuantity thành setStock
        product.setPrice(BigDecimal.valueOf(50.0));
        when(productRepository.findById(1)).thenReturn(Optional.of(product));

        Order savedOrder = new Order();
        savedOrder.setId(1); 
        savedOrder.setStatus("PENDING"); // Sửa từ Enum sang String nếu Entity dùng String
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        // 3. Thực thi
        OrderResponse response = orderService.createOrder(request);

        // 4. Assert
        assertNotNull(response);
        assertEquals("1", response.getOrderId());
        assertEquals(OrderStatus.PENDING, response.getStatus());
        
        // Verify xóa giỏ hàng (Cần đúng kiểu Integer)
        verify(cartRepository).deleteByUserId(123);
    }

    @Test
    void testCreateOrder_InsufficientInventory() {
        OrderRequest request = new OrderRequest();
        request.setUserId(1);
        
        Cart mockCart = new Cart();
        mockCart.setId(100);
        when(cartRepository.findByUserId(1)).thenReturn(Optional.of(mockCart));

        CartItem item = new CartItem();
        item.setProductId(1);
        item.setQuantity(10); 
        when(cartItemRepository.findByCartId(100)).thenReturn(List.of(item));

        Product product = new Product();
        product.setStock(5); // Kho chỉ còn 5, mua 10
        product.setName("iPhone");
        when(productRepository.findById(1)).thenReturn(Optional.of(product));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            orderService.createOrder(request);
        });

        assertEquals("Sản phẩm iPhone không đủ tồn kho", exception.getMessage());
    }

    @Test
    void testGetOrderById_NotFound() {
        // Dùng 999 (Integer) thay vì 999L
        when(orderRepository.findById(999)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            orderService.getOrderById(999);
        });

        assertEquals("Không tìm thấy đơn hàng: 999", exception.getMessage());
    }

    @Test
    @DisplayName("Tạo đơn hàng khi giỏ hàng trống - Bao lỗi")
    void testCreateOrder_EmptyCart() {
        // GIVEN
        OrderRequest request = new OrderRequest();
        request.setUserId(123);
        
        Cart mockCart = new Cart();
        mockCart.setId(100);
        when(cartRepository.findByUserId(123)).thenReturn(Optional.of(mockCart));

        // Giả lập findByCartId trả về danh sách rỗng (Empty List)
        when(cartItemRepository.findByCartId(100)).thenReturn(Collections.emptyList());

        // WHEN & THEN
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            orderService.createOrder(request);
        });

        assertEquals("Giỏ hàng trống", exception.getMessage());
    }

    @Test
    @DisplayName(" Test getOrderById với Status lạ - Trả về PENDING")
    void testGetOrderById_InvalidStatus() {
        // GIVEN
        Order order = new Order();
        order.setId(1);
        order.setStatus("STATUS_KHONG_TON_TAI"); // Gây lỗi IllegalArgumentException trong try-catch
        order.setTotalPrice(new BigDecimal("100000"));
        when(orderRepository.findById(1)).thenReturn(Optional.of(order));

        // WHEN
        OrderResponse response = orderService.getOrderById(1);
        
        // THEN
        assertEquals(OrderStatus.PENDING, response.getStatus()); // Kiểm tra xem catch có hoạt động không
        assertEquals("1", response.getOrderId());
    }
}