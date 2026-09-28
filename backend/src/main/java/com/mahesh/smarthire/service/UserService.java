package com.mahesh.smarthire.service;

import com.mahesh.smarthire.dto.LoginRequest;
import com.mahesh.smarthire.dto.LoginResponse;
import com.mahesh.smarthire.dto.RegisterRequest;
import com.mahesh.smarthire.dto.UserResponse;
import com.mahesh.smarthire.entity.User;
import com.mahesh.smarthire.enums.UserRole;
import com.mahesh.smarthire.exception.EmailAlreadyExistsException;
import com.mahesh.smarthire.exception.InvalidCredentialsException;
import com.mahesh.smarthire.exception.UserNotFoundException;
import com.mahesh.smarthire.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public UserResponse registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new EmailAlreadyExistsException(registerRequest.getEmail());
        }

        UserRole role = registerRequest.getRole();
        if (role != UserRole.CANDIDATE && role != UserRole.RECRUITER) {
            throw new IllegalArgumentException("Role must be CANDIDATE or RECRUITER");
        }

        User user = new User();
        user.setName(registerRequest.getName().trim());
        user.setEmail(registerRequest.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(role);

        return convertToResponse(userRepository.save(user));
    }

    public LoginResponse loginUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail().trim())
                .orElseThrow(InvalidCredentialsException::new);

        boolean passwordMatches = passwordEncoder.matches(
                loginRequest.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new InvalidCredentialsException();
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new LoginResponse(token, convertToResponse(user));
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);

        return convertToResponse(user);
    }

    private UserResponse convertToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
