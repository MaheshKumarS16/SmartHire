package com.mahesh.smarthire.service;

import com.mahesh.smarthire.dto.UserProfileRequest;
import com.mahesh.smarthire.dto.UserProfileResponse;
import com.mahesh.smarthire.entity.User;
import com.mahesh.smarthire.exception.InvalidCredentialsException;
import com.mahesh.smarthire.repository.UserRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class ProfileService {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("pdf", "doc", "docx");
    private final Path uploadDir = Paths.get("uploads", "resumes").toAbsolutePath().normalize();

    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize resume storage directory", e);
        }
    }

    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);
        return convertToResponse(user);
    }

    public UserProfileResponse updateProfile(String email, UserProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }
        if (request.getLocation() != null) {
            user.setLocation(request.getLocation().trim());
        }
        if (request.getSummary() != null) {
            user.setSummary(request.getSummary().trim());
        }
        if (request.getSkills() != null) {
            user.setSkills(request.getSkills().trim());
        }
        if (request.getEducation() != null) {
            user.setEducation(request.getEducation().trim());
        }
        if (request.getExperience() != null) {
            user.setExperience(request.getExperience().trim());
        }

        User saved = userRepository.save(user);
        return convertToResponse(saved);
    }

    public UserProfileResponse uploadResume(String email, MultipartFile file) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Resume file cannot be empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf");
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex + 1).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Invalid file format. Only PDF, DOC, and DOCX files are permitted");
        }

        // Delete old resume if present
        if (user.getResumeFilePath() != null) {
            try {
                Path oldPath = Paths.get(user.getResumeFilePath());
                Files.deleteIfExists(oldPath);
            } catch (IOException ignored) {
            }
        }

        // Save new file
        String storedFilename = user.getId() + "_" + System.currentTimeMillis() + "_" + originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
        Path targetPath = this.uploadDir.resolve(storedFilename);

        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store resume file", e);
        }

        user.setResumeFileName(originalFilename);
        user.setResumeFilePath(targetPath.toString());
        user.setResumeFileType(file.getContentType() != null ? file.getContentType() : "application/octet-stream");
        user.setResumeUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        return convertToResponse(saved);
    }

    public Resource downloadResume(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

        if (user.getResumeFilePath() == null) {
            throw new IllegalArgumentException("No resume has been uploaded yet");
        }

        try {
            Path path = Paths.get(user.getResumeFilePath());
            Resource resource = new UrlResource(path.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Resume file could not be read on disk");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Malformed resume file path", e);
        }
    }

    public UserProfileResponse deleteResume(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

        if (user.getResumeFilePath() != null) {
            try {
                Path oldPath = Paths.get(user.getResumeFilePath());
                Files.deleteIfExists(oldPath);
            } catch (IOException ignored) {
            }
        }

        user.setResumeFileName(null);
        user.setResumeFilePath(null);
        user.setResumeFileType(null);
        user.setResumeUpdatedAt(null);

        User saved = userRepository.save(user);
        return convertToResponse(saved);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);
    }

    public UserProfileResponse convertToResponse(User user) {
        boolean hasResume = user.getResumeFileName() != null && !user.getResumeFileName().isEmpty();
        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                user.getLocation(),
                user.getSummary(),
                user.getSkills(),
                user.getEducation(),
                user.getExperience(),
                hasResume,
                user.getResumeFileName(),
                user.getResumeUpdatedAt()
        );
    }
}
