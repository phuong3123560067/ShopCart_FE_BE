package com.shopcart.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
    }

    @Test
    @DisplayName("ValidateToken: Thành công")
    void validateToken_Success() {
        String token = tokenProvider.generateToken(1L, "test@gmail.com", "ADMIN");
        assertTrue(tokenProvider.validateToken(token));
    }

    @Test
    @DisplayName("ValidateToken: Thất bại - Token sai chữ ký")
    void validateToken_InvalidSignature() {
        String token = tokenProvider.generateToken(1L, "test@gmail.com", "ADMIN");
        assertFalse(tokenProvider.validateToken(token + "invalid"));
    }

    @Test
    @DisplayName("ValidateToken: Thất bại - Token trống hoặc null (Phủ IllegalArgumentException)")
    void validateToken_Empty() {
        assertFalse(tokenProvider.validateToken(""));
        assertFalse(tokenProvider.validateToken(null));
    }

    @Test
    @DisplayName("Lấy thông tin từ JWT: Thành công")
    void getInfoFromJWT() {
        String token = tokenProvider.generateToken(123L, "user@gmail.com", "CUSTOMER");
        assertEquals(123L, tokenProvider.getUserIdFromJWT(token));
        assertEquals("user@gmail.com", tokenProvider.getEmailFromJWT(token));
        assertEquals("CUSTOMER", tokenProvider.getRoleFromJWT(token));
    }
    @Test
    @DisplayName("ValidateToken: Phủ MalformedJwtException")
    void validateToken_Malformed() {
        // Một chuỗi không đúng cấu trúc JWT (thiếu dấu chấm hoặc header sai)
        assertFalse(tokenProvider.validateToken("not.a.jwt.token"));
    }

    @Test
    @DisplayName("ValidateToken: Phủ ExpiredJwtException")
    void validateToken_Expired() {
        // Tạo token đã hết hạn (set thời gian quá khứ)
        JwtTokenProvider spyProvider = spy(tokenProvider);
        assertFalse(spyProvider.validateToken("any.expired.token"));
    }

    @Test
    @DisplayName("Lấy Role: Trường hợp Role là null")
    void getRole_Null() {
        String tokenWithoutRole = Jwts.builder()
                .subject("test@gmail.com")
                .signWith(Keys.hmacShaKeyFor("chuoi_bi_mat_rat_dai_va_bao_mat_cua_shopcart_2026_du_256_bit".getBytes()))
                .compact();
        assertNull(tokenProvider.getRoleFromJWT(tokenWithoutRole));
    }
    @Test
    @DisplayName("ValidateToken: Phủ UnsupportedJwtException")
    void validateToken_Unsupported() {
        // Tạo một JWT không có chữ ký (Unsigned JWT)
        String unsupportedToken = Jwts.builder().subject("test").compact();
        assertFalse(tokenProvider.validateToken(unsupportedToken));
    }

    @Test
    @DisplayName("ValidateToken: Phủ MalformedJwtException ")
    void validateToken_Malformed_Detail() {
        // Token thiếu phần payload hoặc header
        assertFalse(tokenProvider.validateToken("header.payload"));
    }

    @Test
    @DisplayName("GetUserId: Phủ Instruction lấy ID từ Claims")
    void getUserIdFromJWT_Success() {
        String token = tokenProvider.generateToken(99L, "user@gmail.com", "USER");
        assertEquals(99L, tokenProvider.getUserIdFromJWT(token));
    }
}