package com.mahesh.smarthire.exception;

import com.mahesh.smarthire.dto.ApiResponse;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // JOB NOT FOUND
    @ExceptionHandler(JobNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponse<Void> handleJobNotFound(
            JobNotFoundException exception) {

        return new ApiResponse<>(
                false,
                exception.getMessage(),
                null
        );
    }

    // APPLICATION NOT FOUND
    @ExceptionHandler(ApplicationNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponse<Void> handleApplicationNotFound(
            ApplicationNotFoundException exception) {

        return new ApiResponse<>(
                false,
                exception.getMessage(),
                null
        );
    }

    // EMAIL ALREADY EXISTS
    @ExceptionHandler(EmailAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiResponse<Void> handleEmailAlreadyExists(
            EmailAlreadyExistsException exception) {

        return new ApiResponse<>(
                false,
                exception.getMessage(),
                null
        );
    }

    // INVALID LOGIN CREDENTIALS
    @ExceptionHandler(InvalidCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiResponse<Void> handleInvalidCredentials(
            InvalidCredentialsException exception) {

        return new ApiResponse<>(
                false,
                exception.getMessage(),
                null
        );
    }

    // DUPLICATE APPLICATION
    @ExceptionHandler(DuplicateApplicationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiResponse<Void> handleDuplicateApplication(
            DuplicateApplicationException exception) {

        return new ApiResponse<>(
                false,
                exception.getMessage(),
                null
        );
    }

    // CLOSED JOB
    @ExceptionHandler(JobClosedException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleJobClosed(
            JobClosedException exception) {

        return new ApiResponse<>(
                false,
                exception.getMessage(),
                null
        );
    }

    // VALIDATION ERRORS
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException exception) {

        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        return new ApiResponse<>(
                false,
                "Validation failed",
                errors
        );
    }
}