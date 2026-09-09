package com.mahesh.smarthire.service;

import com.mahesh.smarthire.dto.JobRequest;
import com.mahesh.smarthire.dto.JobResponse;
import com.mahesh.smarthire.entity.Job;
import com.mahesh.smarthire.entity.User;
import com.mahesh.smarthire.enums.JobStatus;
import com.mahesh.smarthire.exception.JobNotFoundException;
import com.mahesh.smarthire.repository.JobRepository;
import com.mahesh.smarthire.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobService(
            JobRepository jobRepository,
            UserRepository userRepository) {

        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    // Create job for logged-in recruiter
    public JobResponse createJob(
            JobRequest jobRequest,
            String recruiterEmail) {

        User recruiter = userRepository
                .findByEmail(recruiterEmail)
                .orElseThrow(() ->
                        new AccessDeniedException(
                                "Recruiter account not found"
                        )
                );

        Job job = new Job();

        job.setTitle(jobRequest.getTitle());
        job.setCompany(jobRequest.getCompany());
        job.setLocation(jobRequest.getLocation());
        job.setSalary(jobRequest.getSalary());
        job.setDescription(jobRequest.getDescription());

        // Assign logged-in recruiter as owner
        job.setRecruiter(recruiter);

        Job savedJob = jobRepository.save(job);

        return convertToResponse(savedJob);
    }

    public List<JobResponse> getAllJobs() {

        return jobRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public JobResponse getJobById(Long id) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new JobNotFoundException(id));

        return convertToResponse(job);
    }

    public Page<JobResponse> searchJobs(
            String title,
            String location,
            JobStatus status,
            Pageable pageable) {

        Page<Job> jobs;

        if (title != null && location != null && status != null) {

            jobs = jobRepository
                    .findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCaseAndStatus(
                            title,
                            location,
                            status,
                            pageable
                    );

        } else if (title != null && status != null) {

            jobs = jobRepository
                    .findByTitleContainingIgnoreCaseAndStatus(
                            title,
                            status,
                            pageable
                    );

        } else if (location != null && status != null) {

            jobs = jobRepository
                    .findByLocationContainingIgnoreCaseAndStatus(
                            location,
                            status,
                            pageable
                    );

        } else if (status != null) {

            jobs = jobRepository.findByStatus(
                    status,
                    pageable
            );

        } else {

            jobs = jobRepository.findAll(pageable);
        }

        return jobs.map(this::convertToResponse);
    }

    public Page<JobResponse> getJobsWithPagination(
            Pageable pageable) {

        Page<Job> jobs =
                jobRepository.findAll(pageable);

        return jobs.map(this::convertToResponse);
    }

    // Update job only if logged-in recruiter owns it
    public JobResponse updateJob(
            Long id,
            JobRequest jobRequest,
            String recruiterEmail) {

        Job existingJob = getOwnedJob(
                id,
                recruiterEmail
        );

        existingJob.setTitle(jobRequest.getTitle());
        existingJob.setCompany(jobRequest.getCompany());
        existingJob.setLocation(jobRequest.getLocation());
        existingJob.setSalary(jobRequest.getSalary());
        existingJob.setDescription(jobRequest.getDescription());

        Job updatedJob =
                jobRepository.save(existingJob);

        return convertToResponse(updatedJob);
    }

    // Update job status only if recruiter owns it
    public JobResponse updateJobStatus(
            Long id,
            JobStatus status,
            String recruiterEmail) {

        Job existingJob = getOwnedJob(
                id,
                recruiterEmail
        );

        existingJob.setStatus(status);

        Job updatedJob =
                jobRepository.save(existingJob);

        return convertToResponse(updatedJob);
    }

    // Delete job only if recruiter owns it
    public void deleteJob(
            Long id,
            String recruiterEmail) {

        Job existingJob = getOwnedJob(
                id,
                recruiterEmail
        );

        jobRepository.delete(existingJob);
    }

    // Find job and verify ownership
    private Job getOwnedJob(
            Long jobId,
            String recruiterEmail) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new JobNotFoundException(jobId));

        User recruiter = job.getRecruiter();

        if (recruiter == null ||
                !recruiter.getEmail().equals(recruiterEmail)) {

            throw new AccessDeniedException(
                    "You are not authorized to manage this job"
            );
        }

        return job;
    }

    private JobResponse convertToResponse(Job job) {

        return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getCompany(),
                job.getLocation(),
                job.getSalary(),
                job.getDescription(),
                job.getStatus()
        );
    }
}