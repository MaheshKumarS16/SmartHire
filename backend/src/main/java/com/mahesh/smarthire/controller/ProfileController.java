package com.mahesh.smarthire.controller;

import com.mahesh.smarthire.dto.ApiResponse;
import com.mahesh.smarthire.dto.UserProfileRequest;
import com.mahesh.smarthire.dto.UserProfileResponse;
import com.mahesh.smarthire.entity.User;
import com.mahesh.smarthire.service.ProfileService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ApiResponse<UserProfileResponse> getProfile(Authentication authentication) {
        UserProfileResponse profile = profileService.getProfile(authentication.getName());
        return new ApiResponse<>(true, "Profile fetched successfully", profile);
    }

    @PutMapping
    public ApiResponse<UserProfileResponse> updateProfile(
            @RequestBody UserProfileRequest request,
            Authentication authentication) {
        UserProfileResponse profile = profileService.updateProfile(authentication.getName(), request);
        return new ApiResponse<>(true, "Profile updated successfully", profile);
    }

    @PostMapping("/resume")
    public ApiResponse<UserProfileResponse> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        UserProfileResponse profile = profileService.uploadResume(authentication.getName(), file);
        return new ApiResponse<>(true, "Resume uploaded successfully", profile);
    }

    @GetMapping("/resume")
    public ResponseEntity<Resource> downloadResume(Authentication authentication) {
        User user = profileService.getUserByEmail(authentication.getName());
        Resource resource = profileService.downloadResume(authentication.getName());

        String contentType = user.getResumeFileType() != null ? user.getResumeFileType() : MediaType.APPLICATION_OCTET_STREAM_VALUE;
        String fileName = user.getResumeFileName() != null ? user.getResumeFileName() : "resume.pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @DeleteMapping("/resume")
    public ApiResponse<UserProfileResponse> deleteResume(Authentication authentication) {
        UserProfileResponse profile = profileService.deleteResume(authentication.getName());
        return new ApiResponse<>(true, "Resume deleted successfully", profile);
    }
}
