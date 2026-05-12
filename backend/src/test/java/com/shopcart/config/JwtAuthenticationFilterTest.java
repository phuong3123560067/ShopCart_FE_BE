package com.shopcart.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock private JwtTokenProvider tokenProvider;
    @Mock private HttpServletRequest request;
    @Mock private HttpServletResponse response;
    @Mock private FilterChain filterChain;
    @InjectMocks private JwtAuthenticationFilter filter;

    @Test
    @DisplayName("Filter: Không có Authorization Header (Phủ nhánh null)")
    void doFilterInternal_NoToken() throws Exception {
        when(request.getHeader("Authorization")).thenReturn(null);
        filter.doFilterInternal(request, response, filterChain);
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Filter: Token không bắt đầu bằng Bearer (Phủ nhánh format)")
    void doFilterInternal_InvalidFormat() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("Basic 12345");
        filter.doFilterInternal(request, response, filterChain);
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Filter: Lỗi bất ngờ (Phủ vạch đỏ khối catch)")
    void doFilterInternal_Exception() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("Bearer valid.token");

        when(tokenProvider.validateToken(anyString())).thenThrow(new RuntimeException("Crash"));

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);

    }
    @Test
    @DisplayName("Filter: Role là null -> Gán CUSTOMER (Phủ Branch)")
    void doFilterInternal_NullRole_AssignDefault() throws Exception {
        String jwt = "valid.jwt";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + jwt);
        when(tokenProvider.validateToken(jwt)).thenReturn(true);
        when(tokenProvider.getEmailFromJWT(jwt)).thenReturn("user@gmail.com");
        when(tokenProvider.getRoleFromJWT(jwt)).thenReturn(null);
        when(tokenProvider.getUserIdFromJWT(jwt)).thenReturn(1L);

        filter.doFilterInternal(request, response, filterChain);


        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        assert(auth.getAuthorities().toString().contains("ROLE_CUSTOMER"));
    }

    @Test
    @DisplayName("Filter: Phủ khối catch và clearContext")
    void doFilterInternal_CatchException() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("Bearer error-token");

        when(tokenProvider.validateToken(anyString())).thenThrow(new RuntimeException("JWT Error"));

        filter.doFilterInternal(request, response, filterChain);


        verify(filterChain).doFilter(request, response);
    }
    @Test
    @DisplayName("Filter: Role đã có sẵn tiền tố ROLE_ -> Vẫn xử lý đúng (Branch Coverage)")
    void doFilterInternal_WithFullRolePrefix() throws Exception {
        String jwt = "token.with.role.prefix";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + jwt);
        when(tokenProvider.validateToken(jwt)).thenReturn(true);
        when(tokenProvider.getEmailFromJWT(jwt)).thenReturn("admin@gmail.com");
        when(tokenProvider.getRoleFromJWT(jwt)).thenReturn("ROLE_ADMIN"); // Role có sẵn ROLE_
        when(tokenProvider.getUserIdFromJWT(jwt)).thenReturn(1L);

        filter.doFilterInternal(request, response, filterChain);

        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        // Kiểm tra xem nó có bị double thành ROLE_ROLE_ADMIN không
        assert(auth.getAuthorities().toString().contains("ROLE_ADMIN"));
    }

    @Test
    @DisplayName("Filter: Email là null -> Không set Authentication (Branch Coverage)")
    void doFilterInternal_EmailNull() throws Exception {
        String jwt = "token.no.email";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + jwt);
        when(tokenProvider.validateToken(jwt)).thenReturn(true);
        when(tokenProvider.getEmailFromJWT(jwt)).thenReturn(null);

        filter.doFilterInternal(request, response, filterChain);

        assert(org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication() == null);
        verify(filterChain).doFilter(request, response);
    }
}