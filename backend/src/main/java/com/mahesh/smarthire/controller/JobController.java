package com.mahesh.smarthire.controller;

import com.mahesh.smarthire.dto.ApiResponse;
import com.mahesh.smarthire.dto.JobRequest;
import com.mahesh.smarthire.dto.JobResponse;
import com.mahesh.smarthire.enums.JobStatus;
import com.mahesh.smarthire.service.JobService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @Valid @RequestBody JobRequest jobRequest,
            Authentication authentication) {

        JobResponse jobResponse =
                jobService.createJob(jobRequest, authentication.getName());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        true,
                        "Job created successfully",
                        jobResponse
                ));
    }

    @GetMapping
    public ApiResponse<List<JobResponse>> getAllJobs() {
        return new ApiResponse<>(
                true,
                "Jobs fetched successfully",
                jobService.getAllJobs()
        );
    }

    @GetMapping("/my")
    public ApiResponse<List<JobResponse>> getMyJobs(
            Authentication authentication) {

        return new ApiResponse<>(
                true,
                "Recruiter jobs fetched successfully",
                jobService.getMyJobs(authentication.getName())
        );
    }

    @GetMapping("/search")
    public ApiResponse<List<JobResponse>> searchJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) JobStatus status,
            Pageable pageable) {

        Page<JobResponse> jobs = jobService.searchJobs(
                title,
                location,
                status,
                pageable
        );

        return new ApiResponse<>(
                true,
                "Jobs fetched successfully",
                jobs.getContent()
        );
    }

    @GetMapping("/page")
    public Page<JobResponse> getJobsWithPagination(Pageable pageable) {
        return jobService.getJobsWithPagination(pageable);
    }

    @GetMapping("/{id}")
    public ApiResponse<JobResponse> getJobById(@PathVariable Long id) {
        return new ApiResponse<>(
                true,
                "Job fetched successfully",
                jobService.getJobById(id)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<JobResponse> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest jobRequest,
            Authentication authentication) {

        return new ApiResponse<>(
                true,
                "Job updated successfully",
                jobService.updateJob(id, jobRequest, authentication.getName())
        );
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<JobResponse> updateJobStatus(
            @PathVariable Long id,
            @RequestParam JobStatus status,
            Authentication authentication) {

        return new ApiResponse<>(
                true,
                "Job status updated successfully",
                jobService.updateJobStatus(id, status, authentication.getName())
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteJob(
            @PathVariable Long id,
            Authentication authentication) {

        jobService.deleteJob(id, authentication.getName());

        return new ApiResponse<>(
                true,
                "Job deleted successfully",
                null
        );
    }
}
