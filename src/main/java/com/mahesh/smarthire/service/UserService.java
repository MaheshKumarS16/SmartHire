package com.mahesh.smarthire.service;

import com.mahesh.smarthire.dto.LoginRequest;
import com.mahesh.smarthire.dto.LoginResponse;
import com.mahesh.smarthire.dto.RegisterRequest;
import com.mahesh.smarthire.dto.UserResponse;
import com.mahesh.smarthire.entity.User;
import com.mahesh.smarthire.exception.EmailAlreadyExistsException;
import com.mahesh.smarthire.exception.InvalidCredentialsException;
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
            throw new EmailAlreadyExistsException(
                    registerRequest.getEmail()
            );
        }

        User user = new User();

        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        registerRequest.getPassword()
                )
        );

        user.setRole(registerRequest.getRole());

        User savedUser = userRepository.save(user);

        return convertToResponse(savedUser);
    }

    public LoginResponse loginUser(LoginRequest loginRequest) {

        User user = userRepository.findByEmail(
                loginRequest.getEmail()
        ).orElseThrow(InvalidCredentialsException::new);

        boolean passwordMatches =
                passwordEncoder.matches(
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

        UserResponse userResponse =
                convertToResponse(user);

        return new LoginResponse(
                token,
                userResponse
        );
    }

    // Get currently logged-in user
    public UserResponse getCurrentUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

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