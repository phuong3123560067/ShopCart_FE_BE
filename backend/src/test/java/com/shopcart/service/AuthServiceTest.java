package com.shopcart.service;

import com.shopcart.config.JwtTokenProvider;
import com.shopcart.dto.AuthResponse;
import com.shopcart.dto.LoginRequest;
import com.shopcart.dto.RegisterRequest;
import com.shopcart.entity.Role;
import com.shopcart.entity.User;
import com.shopcart.repository.RoleRepository;
import com.shopcart.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests - Hoàn thiện 100% Coverage")
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private JwtTokenProvider tokenProvider;
    @InjectMocks private AuthService authService;

    @Test
    @DisplayName("Đăng ký: Thành công (Nhuộm xanh luồng chính)")
    void registerUser_Success() {
        RegisterRequest request = new RegisterRequest("newuser@gmail.com", "password123", "Nguyen Van A");
        Role mockRole = new Role(2, "CUSTOMER");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(roleRepository.findById(2)).thenReturn(Optional.of(mockRole));

        String result = authService.registerUser(request);

        assertNotNull(result);
        assertTrue(result.contains("thành công"));
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Đăng ký: Lỗi Email đã tồn tại")
    void registerUser_EmailExists() {
        RegisterRequest request = new RegisterRequest("admin@shopcart.com", "123", "Admin");
        when(userRepository.findByEmail("admin@shopcart.com")).thenReturn(Optional.of(new User()));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.registerUser(request));
        assertEquals("Lỗi: Email này đã được đăng ký hệ thống!", ex.getMessage());
    }

    @Test
    @DisplayName("Đăng ký: Lỗi không tìm thấy Role mặc định")
    void registerUser_RoleNotFound() {
        RegisterRequest request = new RegisterRequest("new@gmail.com", "123", "User");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(roleRepository.findById(2)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> authService.registerUser(request));
    }

    @Test
    @DisplayName("Đăng nhập: Thành công ")
    void authenticateUser_Success() {
        LoginRequest request = new LoginRequest("user@gmail.com", "user123");

        Role mockRole = new Role(1, "ADMIN");
        User mockUser = new User();
        mockUser.setUserId(1);
        mockUser.setEmail("user@gmail.com");
        mockUser.setPassword("user123");
        mockUser.setRole(mockRole);

        when(userRepository.findByEmail("user@gmail.com")).thenReturn(Optional.of(mockUser));
        when(tokenProvider.generateToken(any(), anyString(), anyString())).thenReturn("mock-token");

        AuthResponse response = authService.authenticateUser(request);

        assertNotNull(response);
        assertEquals("mock-token", response.getToken());
        assertEquals("ADMIN", response.getRole());
    }

    @Test
    @DisplayName("Đăng nhập: Thành công với Role không có tiền tố ROLE_")
    void authenticateUser_Success_AddPrefix() {
        LoginRequest request = new LoginRequest("user@gmail.com", "user123");

        Role mockRole = new Role(2, "CUSTOMER"); // Không có tiền tố ROLE_
        User mockUser = new User();
        mockUser.setUserId(2);
        mockUser.setEmail("user@gmail.com");
        mockUser.setPassword("user123");
        mockUser.setRole(mockRole);

        when(userRepository.findByEmail("user@gmail.com")).thenReturn(Optional.of(mockUser));
        when(tokenProvider.generateToken(any(), anyString(), eq("ROLE_CUSTOMER"))).thenReturn("token-with-prefix");

        authService.authenticateUser(request);

        verify(tokenProvider).generateToken(any(), anyString(), eq("ROLE_CUSTOMER"));
    }

    @Test
    @DisplayName("Đăng nhập: Lỗi Email không tồn tại")
    void authenticateUser_EmailNotFound() {
        LoginRequest request = new LoginRequest("unknown@gmail.com", "123");
        when(userRepository.findByEmail("unknown@gmail.com")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.authenticateUser(request));
        assertEquals("Email không tồn tại trong hệ thống", ex.getMessage());
    }

    @Test
    @DisplayName("Đăng nhập: Lỗi sai mật khẩu")
    void authenticateUser_WrongPassword() {
        LoginRequest request = new LoginRequest("user@gmail.com", "wrong_pass");
        User mockUser = new User();
        mockUser.setPassword("user123");

        when(userRepository.findByEmail("user@gmail.com")).thenReturn(Optional.of(mockUser));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.authenticateUser(request));
        assertEquals("Mật khẩu không chính xác!", ex.getMessage());
    }

    @Test
    @DisplayName("Đăng xuất: Thành công")
    void logout_Success() {
        String result = authService.logout("Bearer valid-token");
        assertEquals("Đăng xuất thành công!", result);
    }

    @Test
    @DisplayName("Đăng xuất: Lỗi Token sai định dạng")
    void logout_InvalidToken() {
        // Case 1: Token null
        assertThrows(RuntimeException.class, () -> authService.logout(null));
        // Case 2: Token không bắt đầu bằng "Bearer "
        assertThrows(RuntimeException.class, () -> authService.logout("Basic 12345"));
    }
}