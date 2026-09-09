package com.mahesh.smarthire.controller;

import com.mahesh.smarthire.dto.ApiResponse;
import com.mahesh.smarthire.dto.ApplicationRequest;
import com.mahesh.smarthire.dto.ApplicationResponse;
import com.mahesh.smarthire.enums.ApplicationStatus;
import com.mahesh.smarthire.service.ApplicationService;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(
            ApplicationService applicationService) {

        this.applicationService = applicationService;
    }

    // Candidate applies for a job
    @PostMapping
    public ApiResponse<ApplicationResponse> applyForJob(
            @Valid @RequestBody ApplicationRequest applicationRequest,
            Authentication authentication) {

        String candidateEmail =
                authentication.getName();

        ApplicationResponse applicationResponse =
                applicationService.applyForJob(
                        applicationRequest.getJobId(),
                        candidateEmail
                );

        return new ApiResponse<>(
                true,
                "Application submitted successfully",
                applicationResponse
        );
    }

    // Candidate views their own applications
    @GetMapping("/my")
    public ApiResponse<List<ApplicationResponse>> getMyApplications(
            Authentication authentication) {

        String candidateEmail =
                authentication.getName();

        List<ApplicationResponse> applications =
                applicationService.getMyApplications(
                        candidateEmail
                );

        return new ApiResponse<>(
                true,
                "Applications fetched successfully",
                applications
        );
    }

    // Recruiter views applications for their own job
    @GetMapping("/job/{jobId}")
    public ApiResponse<List<ApplicationResponse>> getApplicationsForJob(
            @PathVariable Long jobId,
            Authentication authentication) {

        String recruiterEmail =
                authentication.getName();

        List<ApplicationResponse> applications =
                applicationService.getApplicationsForJob(
                        jobId,
                        recruiterEmail
                );

        return new ApiResponse<>(
                true,
                "Job applications fetched successfully",
                applications
        );
    }

    // Recruiter updates application status
    @PatchMapping("/{applicationId}/status")
    public ApiResponse<ApplicationResponse> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status,
            Authentication authentication) {

        String recruiterEmail =
                authentication.getName();

        ApplicationResponse applicationResponse =
                applicationService.updateApplicationStatus(
                        applicationId,
                        status,
                        recruiterEmail
                );

        return new ApiResponse<>(
                true,
                "Application status updated successfully",
                applicationResponse
        );
    }
}