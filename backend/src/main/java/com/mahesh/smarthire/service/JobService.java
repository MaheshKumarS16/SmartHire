package com.mahesh.smarthire.service;

import com.mahesh.smarthire.dto.JobRequest;
import com.mahesh.smarthire.dto.JobResponse;
import com.mahesh.smarthire.entity.Job;
import com.mahesh.smarthire.entity.User;
import com.mahesh.smarthire.enums.JobStatus;
import com.mahesh.smarthire.enums.UserRole;
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

    public JobResponse createJob(JobRequest jobRequest, String recruiterEmail) {
        User recruiter = getRecruiter(recruiterEmail);

        Job job = new Job();
        job.setTitle(jobRequest.getTitle().trim());
        job.setCompany(jobRequest.getCompany().trim());
        job.setLocation(jobRequest.getLocation().trim());
        job.setSalary(jobRequest.getSalary().trim());
        job.setDescription(jobRequest.getDescription().trim());
        job.setRecruiter(recruiter);
        job.setStatus(JobStatus.OPEN);

        return convertToResponse(jobRepository.save(job));
    }

    public List<JobResponse> getAllJobs() {
        return jobRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public JobResponse getJobById(Long id) {
        return convertToResponse(findJob(id));
    }

    public Page<JobResponse> searchJobs(
            String title,
            String location,
            JobStatus status,
            Pageable pageable) {

        String titleFilter = blankToNull(title);
        String locationFilter = blankToNull(location);

        Page<Job> jobs;

        if (titleFilter != null && locationFilter != null && status != null) {
            jobs = jobRepository
                    .findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCaseAndStatus(
                            titleFilter, locationFilter, status, pageable
                    );
        } else if (titleFilter != null && locationFilter != null) {
            jobs = jobRepository
                    .findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(
                            titleFilter, locationFilter, pageable
                    );
        } else if (titleFilter != null && status != null) {
            jobs = jobRepository.findByTitleContainingIgnoreCaseAndStatus(
                    titleFilter, status, pageable
            );
        } else if (locationFilter != null && status != null) {
            jobs = jobRepository.findByLocationContainingIgnoreCaseAndStatus(
                    locationFilter, status, pageable
            );
        } else if (titleFilter != null) {
            jobs = jobRepository.findByTitleContainingIgnoreCase(
                    titleFilter, pageable
            );
        } else if (locationFilter != null) {
            jobs = jobRepository.findByLocationContainingIgnoreCase(
                    locationFilter, pageable
            );
        } else if (status != null) {
            jobs = jobRepository.findByStatus(status, pageable);
        } else {
            jobs = jobRepository.findAll(pageable);
        }

        return jobs.map(this::convertToResponse);
    }

    public Page<JobResponse> getJobsWithPagination(Pageable pageable) {
        return jobRepository.findAll(pageable).map(this::convertToResponse);
    }

    public JobResponse updateJob(
            Long id,
            JobRequest jobRequest,
            String recruiterEmail) {

        Job existingJob = getOwnedJob(id, recruiterEmail);

        existingJob.setTitle(jobRequest.getTitle().trim());
        existingJob.setCompany(jobRequest.getCompany().trim());
        existingJob.setLocation(jobRequest.getLocation().trim());
        existingJob.setSalary(jobRequest.getSalary().trim());
        existingJob.setDescription(jobRequest.getDescription().trim());

        return convertToResponse(jobRepository.save(existingJob));
    }

    public JobResponse updateJobStatus(
            Long id,
            JobStatus status,
            String recruiterEmail) {

        Job existingJob = getOwnedJob(id, recruiterEmail);
        existingJob.setStatus(status);

        return convertToResponse(jobRepository.save(existingJob));
    }

    public void deleteJob(Long id, String recruiterEmail) {
        Job existingJob = getOwnedJob(id, recruiterEmail);
        jobRepository.delete(existingJob);
    }

    public List<JobResponse> getMyJobs(String recruiterEmail) {
        return jobRepository.findByRecruiterEmail(recruiterEmail)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private Job getOwnedJob(Long jobId, String recruiterEmail) {
        Job job = findJob(jobId);
        User recruiter = job.getRecruiter();

        if (recruiter == null || !recruiter.getEmail().equals(recruiterEmail)) {
            throw new AccessDeniedException(
                    "You are not authorized to manage this job"
            );
        }

        return job;
    }

    private User getRecruiter(String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() ->
                        new AccessDeniedException("Recruiter account not found")
                );

        if (recruiter.getRole() != UserRole.RECRUITER) {
            throw new AccessDeniedException(
                    "Only recruiters can manage job postings"
            );
        }

        return recruiter;
    }

    private Job findJob(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new JobNotFoundException(id));
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
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
