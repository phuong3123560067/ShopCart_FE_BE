package com.shopcart.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopcart.dto.AuthResponse;
import com.shopcart.dto.LoginRequest;
import com.shopcart.dto.RegisterRequest;
import com.shopcart.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("AuthController Integration Tests - Security & Logic")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Security: Đăng ký thành công (Cho phép truy cập công khai)")
    void testRegister_Success() throws Exception {
        RegisterRequest request = new RegisterRequest("newuser@gmail.com", "123", "Nguyen Van A");

        when(authService.registerUser(any())).thenReturn("Đăng ký thành công");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Đăng ký thành công"));
    }

    @Test
    @DisplayName("Security: Đăng nhập thành công (Cho phép truy cập công khai)")
    void testLogin_Success() throws Exception {
        LoginRequest request = new LoginRequest("user@gmail.com", "user123");
        AuthResponse response = new AuthResponse("mock-token", "user@gmail.com", "CUSTOMER", 1);

        when(authService.authenticateUser(any())).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-token"));
    }


    @Test
    @DisplayName("Security: Đăng xuất không thành công khi chưa đăng nhập (401)")
    void testLogout_WithoutToken_Unauthorized() throws Exception {
        // Không gửi Header Authorization
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    @DisplayName("Security: Đăng xuất thành công khi đã xác thực (200)")
    void testLogout_WithToken_Success() throws Exception {
        when(authService.logout(any())).thenReturn("Đăng xuất thành công!");

        mockMvc.perform(post("/api/auth/logout")
                        .header("Authorization", "Bearer mock-token"))
                .andExpect(status().isOk())
                .andExpect(content().string("Đăng xuất thành công!"));
    }

    @Test
    @DisplayName("Logic: Đăng nhập thất bại (401) - Phủ khối catch")
    void testLogin_Unauthorized_CatchBlock() throws Exception {
        when(authService.authenticateUser(any())).thenThrow(new RuntimeException("Mật khẩu sai"));

        LoginRequest request = new LoginRequest("user@gmail.com", "wrong");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Mật khẩu sai"));
    }

    @Test
    @WithMockUser
    @DisplayName("Logic: Đăng xuất thất bại do Token lỗi - Phủ khối catch")
    void testLogout_BadRequest_CatchBlock() throws Exception {
        when(authService.logout(any())).thenThrow(new RuntimeException("Token invalid"));

        mockMvc.perform(post("/api/auth/logout")
                        .header("Authorization", "Invalid-Token"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Token invalid"));
    }
}