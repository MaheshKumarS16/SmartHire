package com.mahesh.smarthire.controller;

import com.mahesh.smarthire.dto.ApiResponse;
import com.mahesh.smarthire.dto.JobRequest;
import com.mahesh.smarthire.dto.JobResponse;
import com.mahesh.smarthire.enums.JobStatus;
import com.mahesh.smarthire.service.JobService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // Create job
    @PostMapping
    public ApiResponse<JobResponse> createJob(
            @Valid @RequestBody JobRequest jobRequest,
            Authentication authentication) {

        String recruiterEmail =
                authentication.getName();

        JobResponse jobResponse =
                jobService.createJob(
                        jobRequest,
                        recruiterEmail
                );

        return new ApiResponse<>(
                true,
                "Job created successfully",
                jobResponse
        );
    }

    // Get all jobs
    @GetMapping
    public ApiResponse<List<JobResponse>> getAllJobs() {

        List<JobResponse> jobs =
                jobService.getAllJobs();

        return new ApiResponse<>(
                true,
                "Jobs fetched successfully",
                jobs
        );
    }

    // Get job by ID
    @GetMapping("/{id}")
    public ApiResponse<JobResponse> getJobById(
            @PathVariable Long id) {

        JobResponse jobResponse =
                jobService.getJobById(id);

        return new ApiResponse<>(
                true,
                "Job fetched successfully",
                jobResponse
        );
    }

    // Search jobs
    @GetMapping("/search")
    public Page<JobResponse> searchJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) JobStatus status,
            Pageable pageable) {

        return jobService.searchJobs(
                title,
                location,
                status,
                pageable
        );
    }

    // Pagination
    @GetMapping("/page")
    public Page<JobResponse> getJobsWithPagination(
            Pageable pageable) {

        return jobService.getJobsWithPagination(
                pageable
        );
    }

    // Update job
    @PutMapping("/{id}")
    public ApiResponse<JobResponse> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest jobRequest,
            Authentication authentication) {

        String recruiterEmail =
                authentication.getName();

        JobResponse jobResponse =
                jobService.updateJob(
                        id,
                        jobRequest,
                        recruiterEmail
                );

        return new ApiResponse<>(
                true,
                "Job updated successfully",
                jobResponse
        );
    }

    // Update job status
    @PatchMapping("/{id}/status")
    public ApiResponse<JobResponse> updateJobStatus(
            @PathVariable Long id,
            @RequestParam JobStatus status,
            Authentication authentication) {

        String recruiterEmail =
                authentication.getName();

        JobResponse jobResponse =
                jobService.updateJobStatus(
                        id,
                        status,
                        recruiterEmail
                );

        return new ApiResponse<>(
                true,
                "Job status updated successfully",
                jobResponse
        );
    }

    // Delete job
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteJob(
            @PathVariable Long id,
            Authentication authentication) {

        String recruiterEmail =
                authentication.getName();

        jobService.deleteJob(
                id,
                recruiterEmail
        );

        return new ApiResponse<>(
                true,
                "Job deleted successfully",
                null
        );
    }
}