package com.shopcart.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.shopcart.dto.OrderRequest;
import com.shopcart.dto.OrderResponse;
import com.shopcart.entity.Cart;
import com.shopcart.entity.CartItem;
import com.shopcart.entity.Order;
import com.shopcart.entity.Product;
import com.shopcart.model.OrderStatus;
import com.shopcart.repository.CartRepository;
import com.shopcart.repository.CartItemRepository;
import com.shopcart.repository.OrderRepository;
import com.shopcart.repository.ProductRepository;

import jakarta.transaction.Transactional;


@Service
public class OrderService {
    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private CartRepository cartRepository;
    @Autowired private CartItemRepository cartItemRepository;

    @Transactional 
    public OrderResponse createOrder(OrderRequest request) {

        Integer userIdInt;
        
        // Nếu request.getUserId() trả về String (ví dụ " 123 ")
        // userIdInt = Integer.parseInt(request.getUserId().trim());


        userIdInt = request.getUserId();

        // 2. Tìm Giỏ hàng và các mặt hàng
        Cart cart = cartRepository.findByUserId(userIdInt)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));
        
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        if (items.isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống");
        }

        // 3. Khởi tạo Order
        Order order = new Order();
        order.setUserId(userIdInt);
        order.setShippingAddress(request.getShippingAddress());
        order.setPhoneNumber(request.getPhoneNumber());
        order.setStatus(OrderStatus.PENDING.name());

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : items) {
            Product product = productRepository.findById(item.getProductId())
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

            // Kiểm tra tồn kho trước khi trừ
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ tồn kho");
            }

            // Trừ kho và lưu lại
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(itemTotal);
        }

        // 4. Thiết lập giá trị tiền tệ
        order.setTotalPrice(total);
        order.setFinalPrice(total);

        Order savedOrder = orderRepository.save(order);

        // 5. Làm sạch giỏ hàng sau khi đặt hàng
        cartItemRepository.deleteByCartId(cart.getId());
        cartRepository.deleteByUserId(userIdInt);

        return OrderResponse.builder()
                .orderId(savedOrder.getId().toString())
                .status(OrderStatus.valueOf(savedOrder.getStatus()))
                .totalPrice(savedOrder.getTotalPrice().longValue())
                .finalPrice(savedOrder.getFinalPrice())
                .shippingAddress(savedOrder.getShippingAddress())
                .phoneNumber(savedOrder.getPhoneNumber())
                .message("Đơn hàng đã được tạo thành công")
                .build();
    }

    public OrderResponse getOrderById(Integer id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng: " + id));

        OrderResponse response = new OrderResponse();
        
        // 1. Chuyển Integer sang String cho OrderId
        response.setOrderId(String.valueOf(order.getId()));

        // 2. Chuyển String sang Enum OrderStatus (Xử lý lỗi Type mismatch Status)
        if (order.getStatus() != null) {
            try {
                response.setStatus(OrderStatus.valueOf(order.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                response.setStatus(OrderStatus.PENDING);
            }
        }

        // 3. Chuyển BigDecimal sang Long cho TotalPrice
        if (order.getTotalPrice() != null) {
            response.setTotalPrice(order.getTotalPrice().longValue());
        }

        // 4. Các trường còn lại (Đảm bảo DTO đã khai báo các trường này)
        response.setFinalPrice(order.getFinalPrice()); 
        response.setPhoneNumber(order.getPhoneNumber());
        response.setShippingAddress(order.getShippingAddress());
        response.setMessage("Lấy thông tin đơn hàng thành công");
        
        return response;
    }
}