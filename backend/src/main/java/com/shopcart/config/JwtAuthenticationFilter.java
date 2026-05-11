package com.shopcart.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            // 1. Kiểm tra Token có tồn tại và hợp lệ không
            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String email = tokenProvider.getEmailFromJWT(jwt);
                String role = tokenProvider.getRoleFromJWT(jwt);

                if (email != null) {
                    // 2. CHUẨN HÓA ROLE: Đảm bảo luôn có tiền tố ROLE_ và không bị lặp
                    String cleanRole = (role != null) ? role.toUpperCase().replace("ROLE_", "") : "CUSTOMER";
                    String finalAuthority = "ROLE_" + cleanRole;

                    // 3. Tạo đối tượng Authentication
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            email, null, Collections.singletonList(new SimpleGrantedAuthority(finalAuthority)));

                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // 4. Nạp vào Context - Đây là bước quyết định để thoát lỗi 401
                    SecurityContextHolder.getContext().setAuthentication(auth);

                    // Log để bạn kiểm tra trong Console của IntelliJ
                    System.out.println("===> [JWT OK] Email: " + email + " | Authority: " + finalAuthority);
                }
            }
        } catch (Exception ex) {
            // Nếu lỗi (hết hạn, sai key...), xóa sạch context để đảm bảo an toàn
            SecurityContextHolder.clearContext();
            System.err.println("===> [JWT ERROR] " + ex.getMessage());
        }

        // Luôn luôn phải gọi doFilter để request được đi tiếp
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            // Cắt bỏ "Bearer " (7 ký tự) để lấy chuỗi Token thực tế
            return bearerToken.substring(7).trim();
        }
        return null;
    }
}