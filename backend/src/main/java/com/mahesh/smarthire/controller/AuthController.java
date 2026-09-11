package com.mahesh.smarthire.controller;

import com.mahesh.smarthire.dto.ApiResponse;
import com.mahesh.smarthire.dto.LoginRequest;
import com.mahesh.smarthire.dto.LoginResponse;
import com.mahesh.smarthire.dto.RegisterRequest;
import com.mahesh.smarthire.dto.UserResponse;
import com.mahesh.smarthire.service.UserService;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ApiResponse<UserResponse> registerUser(
            @Valid @RequestBody RegisterRequest registerRequest) {

        UserResponse userResponse =
                userService.registerUser(registerRequest);

        return new ApiResponse<>(
                true,
                "User registered successfully",
                userResponse
        );
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> loginUser(
            @Valid @RequestBody LoginRequest loginRequest) {

        LoginResponse loginResponse =
                userService.loginUser(loginRequest);

        return new ApiResponse<>(
                true,
                "Login successful",
                loginResponse
        );
    }

    // Get currently logged-in user
    @GetMapping("/me")
    public ApiResponse<UserResponse> getCurrentUser(
            Authentication authentication) {

        String email = authentication.getName();

        UserResponse userResponse =
                userService.getCurrentUser(email);

        return new ApiResponse<>(
                true,
                "Current user fetched successfully",
                userResponse
        );
    }
}