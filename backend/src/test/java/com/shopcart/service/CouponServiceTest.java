package com.shopcart.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional; // Đã thêm import này

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.shopcart.entity.Coupon;
import com.shopcart.repository.CouponRepository;

@ExtendWith(MockitoExtension.class)
public class CouponServiceTest {

    @Mock
    private CouponRepository couponRepository;

    @InjectMocks
    private CouponService couponService;

    @Test
    @DisplayName("TC12: Tạo mã giảm giá thành công")
    public void testCreateCoupon_Success() {
        Coupon inputCoupon = new Coupon();
        inputCoupon.setCode("SALE10");
        // Sửa lỗi: Sử dụng đúng tên trường thường là discountAmount hoặc set giá trị phù hợp
        inputCoupon.setDiscountPercent(10);     
        when(couponRepository.save(any(Coupon.class))).thenReturn(inputCoupon);

        // Đảm bảo couponService đã có phương thức createCoupon
        Coupon result = couponService.createCoupon(inputCoupon);
        assertNotNull(result);
        assertEquals("SALE10", result.getCode());
        verify(couponRepository, times(1)).save(inputCoupon); 
    }

    @Test
        @DisplayName("TC13: Validate mã bị khóa - Ném ngoại lệ")
        public void testValidate_InactiveCoupon_ShouldThrowException() {
            // 1. Given: Khởi tạo Coupon bị khóa
            Coupon inactiveCoupon = new Coupon();
            inactiveCoupon.setId(1); 
            inactiveCoupon.setCode("KHOA2026");
            
            //Dùng setIsActive(false) thay vì setStatus(0)
            inactiveCoupon.setIsActive(false); 
            
            // Giả lập tìm kiếm theo Code (đảm bảo Repository đã có phương thức findByCode)
            when(couponRepository.findByCode("KHOA2026")).thenReturn(Optional.of(inactiveCoupon));

            // 2. When & Then: Kiểm tra việc ném ngoại lệ
            Exception exception = assertThrows(RuntimeException.class, () -> {
                couponService.validate("KHOA2026", new BigDecimal("1000000"));
            });
            
            // Khớp với message trong CouponService của bạn
            assertEquals("Mã bị khóa", exception.getMessage());
        }

    @Test
    @DisplayName("TC14: Validate mã đã hết lượt sử dụng - Ném ngoại lệ")
    public void testValidate_OutOfUsage_ShouldThrowException() {
        // 1. Given: Khởi tạo Coupon đã đạt giới hạn sử dụng
        Coupon fullCoupon = new Coupon();
        fullCoupon.setId(1); // Luôn set ID Integer cho Entity
        fullCoupon.setCode("HETLUOT");
        
        //Dùng setIsActive(true) của Lombok cho trường isActive
        fullCoupon.setIsActive(true); 
        
        fullCoupon.setUsageLimit(10); 
        fullCoupon.setUsedCount(10); // usedCount == usageLimit sẽ gây lỗi
        
        // Dùng findByCode đã định nghĩa trong Repository
        when(couponRepository.findByCode("HETLUOT")).thenReturn(Optional.of(fullCoupon));

        // 2. When & Then: Kiểm tra việc ném ngoại lệ
        Exception exception = assertThrows(RuntimeException.class, () -> {
            couponService.validate("HETLUOT", new BigDecimal("1000000"));
        }); 
        assertEquals("Mã đã hết lượt", exception.getMessage());
    }

@Test
    @DisplayName("TC15: Validate mã đã hết hạn - Ném ngoại lệ")
    public void testValidate_Expired_ShouldThrowException() {
        // 1. Given: Khởi tạo Coupon có ngày hết hạn trong quá khứ
        Coupon expiredCoupon = new Coupon();
        expiredCoupon.setId(1); 
        expiredCoupon.setCode("HETHAN");
        
        // Sửa lỗi: Dùng setIsActive(true) vì trường trong Entity là Boolean isActive
        expiredCoupon.setIsActive(true); 
        
        expiredCoupon.setUsageLimit(100); 
        expiredCoupon.setUsedCount(0);    
        
        // Thiết lập ngày hết hạn là 1 năm trước
        expiredCoupon.setExpiryDate(LocalDateTime.now().minusYears(1)); 
        
        //Dùng findByCode(String) để tìm theo mã code
        when(couponRepository.findByCode("HETHAN")).thenReturn(Optional.of(expiredCoupon));

        // 2. When & Then: Kiểm tra việc ném ngoại lệ
        Exception exception = assertThrows(RuntimeException.class, () -> {
            couponService.validate("HETHAN", new BigDecimal("500000"));
        });
        
        assertEquals("Mã đã hết hạn", exception.getMessage());
    }

    @Test
    @DisplayName("TC16: Validate đơn hàng chưa đạt giá trị tối thiểu - Ném ngoại lệ")
    public void testValidate_MinOrderValueNotMet_ShouldThrowException() {
        // 1. Given
        Coupon coupon = new Coupon();
        coupon.setCode("MIN500");
        coupon.setIsActive(true);
        coupon.setUsageLimit(10);
        coupon.setUsedCount(0);
        coupon.setMinOrderValue(new BigDecimal("500000")); // Giá tối thiểu là 500k

        when(couponRepository.findByCode("MIN500")).thenReturn(Optional.of(coupon));

        // 2. When & Then: Giả lập đơn hàng chỉ có 300k
        Exception exception = assertThrows(RuntimeException.class, () -> {
            couponService.validate("MIN500", new BigDecimal("300000"));
        });

        assertTrue(exception.getMessage().contains("Đơn hàng chưa đạt giá trị tối thiểu"));
    }

    @Test
    @DisplayName("TC17: Tạo mã với giá trị null - Phải nạp giá trị mặc định")
    public void testCreateCoupon_WithNullValues_ShouldSetDefaults() {
        // 1. Given: Tạo coupon nhưng KHÔNG set UsedCount và IsActive (để chúng bằng null)
        Coupon inputCoupon = new Coupon();
        inputCoupon.setCode("DEFAULT_001");
        inputCoupon.setDiscountPercent(15);
        // Lưu ý: Không gọi setUsedCount và setIsActive ở đây

        // Giả lập Repository trả về đối tượng sau khi lưu
        when(couponRepository.save(any(Coupon.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // 2. When: Gọi hàm createCoupon
        Coupon result = couponService.createCoupon(inputCoupon);

        // 3. Then: Kiểm tra xem các nhánh IF (== null) đã hoạt động chưa
        assertNotNull(result);
        assertEquals(0, result.getUsedCount(), "UsedCount phải được mặc định là 0");
        assertTrue(result.getIsActive(), "IsActive phải được mặc định là true");
        
        // Kiểm chứng Repository đã được gọi
        verify(couponRepository, times(1)).save(any(Coupon.class));
    }
    @Test
    void createCoupon_ShouldSetDefaults_WhenFieldsAreNull() {
        // GIVEN: Coupon không có dữ liệu cho usedCount và isActive
        Coupon coupon = new Coupon(); 
        coupon.setUsedCount(null);
        coupon.setIsActive(null);
        
        when(couponRepository.save(any(Coupon.class))).thenAnswer(i -> i.getArguments()[0]);

        // WHEN
        Coupon result = couponService.createCoupon(coupon);

        // THEN: Phải nhảy vào trong IF để set giá trị mặc định
        assertEquals(0, result.getUsedCount());
        assertTrue(result.getIsActive());
    }

    @Test
    void createCoupon_ShouldKeepExistingValues_WhenFieldsAreNotNull() {
        // GIVEN: Coupon đã có dữ liệu sẵn
        Coupon coupon = new Coupon();
        coupon.setUsedCount(5);
        coupon.setIsActive(false);
        
        when(couponRepository.save(any(Coupon.class))).thenAnswer(i -> i.getArguments()[0]);

        // WHEN
        Coupon result = couponService.createCoupon(coupon);

        // THEN: Không được nhảy vào trong IF để ghi đè (phải giữ nguyên 5 và false)
        assertEquals(5, result.getUsedCount());
        assertFalse(result.getIsActive());
    }
    @Test
    @DisplayName("Validate: Mã không tồn tại")
    void validate_CodeNotFound_ThrowsException() {
        when(couponRepository.findByCode("INVALID")).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> couponService.validate("INVALID", BigDecimal.valueOf(1000)));
    }

    @Test
    @DisplayName("Validate: Mã bị khóa ")
    void validate_CouponInactive_ThrowsException() {
        Coupon coupon = new Coupon();
        coupon.setIsActive(false); // Hoặc set null để test nhánh null
        when(couponRepository.findByCode("LOCK")).thenReturn(Optional.of(coupon));

        assertThrows(RuntimeException.class, () -> couponService.validate("LOCK", BigDecimal.valueOf(1000)));
    }

    @Test
    @DisplayName("Validate: Hết lượt dùng")
    void validate_UsageLimitReached_ThrowsException() {
        Coupon coupon = new Coupon();
        coupon.setIsActive(true);
        coupon.setUsageLimit(10);
        coupon.setUsedCount(10); // Đã dùng hết 10/10
        when(couponRepository.findByCode("FULL")).thenReturn(Optional.of(coupon));

        assertThrows(RuntimeException.class, () -> couponService.validate("FULL", BigDecimal.valueOf(1000)));
    }

    @Test
    @DisplayName("Validate: Hết hạn")
    void validate_CouponExpired_ThrowsException() {
        Coupon coupon = new Coupon();
        coupon.setIsActive(true);
        coupon.setExpiryDate(LocalDateTime.now().minusDays(1)); // Đã hết hạn từ hôm qua
        when(couponRepository.findByCode("EXPIRED")).thenReturn(Optional.of(coupon));

        assertThrows(RuntimeException.class, () -> couponService.validate("EXPIRED", BigDecimal.valueOf(1000)));
    }

    @Test
    @DisplayName("Validate: Chưa đủ giá trị tối thiểu")
    void validate_InsufficientOrderValue_ThrowsException() {
        Coupon coupon = new Coupon();
        coupon.setIsActive(true);
        coupon.setMinOrderValue(BigDecimal.valueOf(500000)); // Yêu cầu 500k
        when(couponRepository.findByCode("MIN500")).thenReturn(Optional.of(coupon));

        // Test với đơn hàng chỉ 200k
        assertThrows(RuntimeException.class, () -> couponService.validate("MIN500", BigDecimal.valueOf(200000)));
    }

    @Test
    @DisplayName("Validate: Thành công (Happy Path)")
    void validate_Success_ShouldNotThrowException() {
        Coupon coupon = new Coupon();
        coupon.setIsActive(true);
        coupon.setUsageLimit(100);
        coupon.setUsedCount(0);
        coupon.setExpiryDate(LocalDateTime.now().plusDays(10));
        coupon.setMinOrderValue(BigDecimal.valueOf(100000));
        when(couponRepository.findByCode("SUCCESS")).thenReturn(Optional.of(coupon));

        // Không ném lỗi là thành công
        assertDoesNotThrow(() -> couponService.validate("SUCCESS", BigDecimal.valueOf(200000)));
    }

    
}