package com.shopcart.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.containsString;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Security: Truy cập không token")
    void accessWithoutToken_401() throws Exception {
        mockMvc.perform(get("/api/inventory/1"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    @DisplayName("Security: Sai quyền (Phủ AccessDeniedHandler 403)")
    void accessWithWrongRole_403() throws Exception {

        mockMvc.perform(get("/api/inventory/1"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }
    @Test
    @DisplayName("EntryPoint: Xử lý RuntimeException (Phủ vạch đỏ 400)")
    void entryPoint_HandleRuntimeException() throws Exception {
        mockMvc.perform(get("/api/inventory/1")

                        .requestAttr("jakarta.servlet.error.exception", new RuntimeException("Lỗi hệ thống")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Thao tác thất bại")));
    }

    @Test
    @DisplayName("EntryPoint: Lỗi không xác định (Phủ nhánh else 401)")
    void entryPoint_HandleGeneralError() throws Exception {
        mockMvc.perform(get("/api/inventory/1")
                        .requestAttr("jakarta.servlet.error.exception", new Exception("General Error")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }
    @Test
    @DisplayName("EntryPoint: Phủ nhánh chứa chữ 'Lỗi' -> 400 (Branch Coverage)")
    void entryPoint_ErrorWithLoi_400() throws Exception {
        mockMvc.perform(get("/api/inventory/1")
                        .requestAttr("jakarta.servlet.error.exception", new RuntimeException("Đây là Lỗi hệ thống")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Thao tác thất bại")));
    }

    @Test
    @DisplayName("EntryPoint: Phủ nhánh RuntimeException -> 400 (Instruction Coverage)")
    void entryPoint_RuntimeException_400() throws Exception {
        mockMvc.perform(get("/api/inventory/1")
                        .requestAttr("jakarta.servlet.error.exception", new RuntimeException("RuntimeException occur")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }
}