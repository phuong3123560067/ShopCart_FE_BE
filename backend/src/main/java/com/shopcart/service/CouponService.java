package com.shopcart.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopcart.entity.Coupon;
import com.shopcart.repository.CouponRepository;

@Service
public class CouponService {
    @Autowired
    private CouponRepository couponRepository;
    /**
     * Tạo mới mã giảm giá
     * Giúp giải quyết lỗi 'undefined' tại CouponController và TC12
     */
    public Coupon createCoupon(Coupon coupon) {
        // Đảm bảo các giá trị mặc định nếu bị null
        if (coupon.getUsedCount() == null) {
            coupon.setUsedCount(0);
        }
        if (coupon.getIsActive() == null) {
            coupon.setIsActive(true);
        }
        return couponRepository.save(coupon);
    }

    /**
     * Kiểm tra tính hợp lệ của mã giảm giá
     * Khớp với tham số (String, BigDecimal) từ CartService
     */
    public void validate(String code, BigDecimal orderValue) {
        // Tìm coupon theo mã code chuỗi (Cần định nghĩa findByCode trong Repository)
        Coupon coupon = couponRepository.findByCode(code)
            .orElseThrow(() -> new RuntimeException("Mã không tồn tại")); 

        // Kiểm tra trạng thái hoạt động (Sử dụng getIsActive() từ Lombok cho kiểu Boolean)
        if (coupon.getIsActive() == null || !coupon.getIsActive()) {
            throw new RuntimeException("Mã bị khóa");
        }
        
        // Kiểm tra lượt sử dụng
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new RuntimeException("Mã đã hết lượt");
        }
        
        // Kiểm tra ngày hết hạn
        if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã đã hết hạn");
        }

        // Kiểm tra giá trị đơn hàng tối thiểu
        if (coupon.getMinOrderValue() != null && orderValue.compareTo(coupon.getMinOrderValue()) < 0) {
            throw new RuntimeException("Đơn hàng chưa đạt giá trị tối thiểu " + coupon.getMinOrderValue());
        }
    }
}