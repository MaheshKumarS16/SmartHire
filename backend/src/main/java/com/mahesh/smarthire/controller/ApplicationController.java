package com.mahesh.smarthire.controller;

import com.mahesh.smarthire.dto.ApiResponse;
import com.mahesh.smarthire.dto.ApplicationRequest;
import com.mahesh.smarthire.dto.ApplicationResponse;
import com.mahesh.smarthire.enums.ApplicationStatus;
import com.mahesh.smarthire.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ApplicationResponse>> applyForJob(
            @Valid @RequestBody ApplicationRequest applicationRequest,
            Authentication authentication) {

        ApplicationResponse applicationResponse =
                applicationService.applyForJob(
                        applicationRequest.getJobId(),
                        authentication.getName()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        true,
                        "Application submitted successfully",
                        applicationResponse
                ));
    }

    @GetMapping("/my")
    public ApiResponse<List<ApplicationResponse>> getMyApplications(
            Authentication authentication) {

        return new ApiResponse<>(
                true,
                "Applications fetched successfully",
                applicationService.getMyApplications(authentication.getName())
        );
    }

    @GetMapping("/job/{jobId}")
    public ApiResponse<List<ApplicationResponse>> getApplicationsForJob(
            @PathVariable Long jobId,
            Authentication authentication) {

        return new ApiResponse<>(
                true,
                "Job applications fetched successfully",
                applicationService.getApplicationsForJob(
                        jobId,
                        authentication.getName()
                )
        );
    }

    @PatchMapping("/{applicationId}/status")
    public ApiResponse<ApplicationResponse> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status,
            Authentication authentication) {

        return new ApiResponse<>(
                true,
                "Application status updated successfully",
                applicationService.updateApplicationStatus(
                        applicationId,
                        status,
                        authentication.getName()
                )
        );
    }
}
