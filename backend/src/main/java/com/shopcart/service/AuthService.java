package com.shopcart.service;

import com.shopcart.dto.LoginRequest;
import com.shopcart.dto.RegisterRequest;
import com.shopcart.dto.AuthResponse;
import com.shopcart.entity.User;
import com.shopcart.entity.Role;
import com.shopcart.repository.UserRepository;
import com.shopcart.repository.RoleRepository;
import com.shopcart.config.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public String registerUser(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Lỗi: Email này đã được đăng ký hệ thống!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setFullName(request.getFull_name());

        Role customerRole = roleRepository.findById(2)
                .orElseThrow(() -> new NoSuchElementException("Lỗi hệ thống: Không tìm thấy Role mặc định (ID=2) trong cơ sở dữ liệu!"));

        user.setRole(customerRole);

        userRepository.save(user);
        return "Đăng ký tài khoản thành công cho: " + user.getEmail();
    }

    public AuthResponse authenticateUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Mật khẩu không chính xác!");
        }

        String roleName = user.getRole().getRoleName();
        if (!roleName.startsWith("ROLE_")) {
            roleName = "ROLE_" + roleName;
        }

        String token = tokenProvider.generateToken(Long.valueOf(user.getUserId()), user.getEmail(), roleName);

        return new AuthResponse(token, user.getEmail(), user.getRole().getRoleName(), user.getUserId());
    }

    public String logout(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn!");
        }

        String jwt = token.substring(7);
        System.out.println("Đã vô hiệu hóa phiên làm việc của Token: " + jwt);

        return "Đăng xuất thành công!";
    }
}