package com.mahesh.smarthire.service;

import com.mahesh.smarthire.dto.ApplicationResponse;
import com.mahesh.smarthire.entity.Application;
import com.mahesh.smarthire.entity.Job;
import com.mahesh.smarthire.entity.User;
import com.mahesh.smarthire.enums.ApplicationStatus;
import com.mahesh.smarthire.enums.JobStatus;
import com.mahesh.smarthire.enums.UserRole;
import com.mahesh.smarthire.exception.ApplicationNotFoundException;
import com.mahesh.smarthire.exception.DuplicateApplicationException;
import com.mahesh.smarthire.exception.InvalidCredentialsException;
import com.mahesh.smarthire.exception.JobClosedException;
import com.mahesh.smarthire.exception.JobNotFoundException;
import com.mahesh.smarthire.repository.ApplicationRepository;
import com.mahesh.smarthire.repository.JobRepository;
import com.mahesh.smarthire.repository.UserRepository;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository,
            UserRepository userRepository) {

        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    // Candidate applies for a job
    public ApplicationResponse applyForJob(
            Long jobId,
            String candidateEmail) {

        User candidate = userRepository
                .findByEmail(candidateEmail)
                .orElseThrow(InvalidCredentialsException::new);

        if (candidate.getRole() != UserRole.CANDIDATE) {
            throw new AccessDeniedException(
                    "Only candidates can apply for jobs");
        }

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new JobNotFoundException(jobId));

        if (job.getStatus() == JobStatus.CLOSED) {
            throw new JobClosedException();
        }

        boolean alreadyApplied =
                applicationRepository.existsByCandidateIdAndJobId(
                        candidate.getId(),
                        job.getId()
                );

        if (alreadyApplied) {
            throw new DuplicateApplicationException();
        }

        Application application = new Application();

        application.setCandidate(candidate);
        application.setJob(job);
        application.setStatus(ApplicationStatus.APPLIED);

        Application savedApplication =
                applicationRepository.save(application);

        return convertToResponse(savedApplication);
    }

    // Candidate views their own applications
    public List<ApplicationResponse> getMyApplications(
            String candidateEmail) {

        User candidate = userRepository
                .findByEmail(candidateEmail)
                .orElseThrow(InvalidCredentialsException::new);

        return applicationRepository
                .findByCandidateId(candidate.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Recruiter views applicants for their own job
    public List<ApplicationResponse> getApplicationsForJob(
            Long jobId,
            String recruiterEmail) {

        Job job = getOwnedJob(
                jobId,
                recruiterEmail
        );

        return applicationRepository
                .findByJobId(job.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Recruiter updates application status
    public ApplicationResponse updateApplicationStatus(
            Long applicationId,
            ApplicationStatus status,
            String recruiterEmail) {

        Application application =
                applicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new ApplicationNotFoundException(
                                        applicationId
                                )
                        );

        Job job = application.getJob();

        // Verify recruiter owns the job
        if (job.getRecruiter() == null ||
                !job.getRecruiter()
                        .getEmail()
                        .equals(recruiterEmail)) {

            throw new AccessDeniedException(
                    "You are not authorized to update this application"
            );
        }

        application.setStatus(status);

        Application updatedApplication =
                applicationRepository.save(application);

        return convertToResponse(updatedApplication);
    }

    // Recruiter downloads candidate's resume for an application
    public Resource getApplicantResume(Long applicationId, String recruiterEmail) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ApplicationNotFoundException(applicationId));

        Job job = application.getJob();
        if (job.getRecruiter() == null ||
                !job.getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new AccessDeniedException(
                    "You are not authorized to access this applicant's resume"
            );
        }

        User candidate = application.getCandidate();
        if (candidate.getResumeFilePath() == null) {
            throw new IllegalArgumentException("Candidate has not uploaded a resume");
        }

        try {
            Path path = Paths.get(candidate.getResumeFilePath());
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

    public Application getApplicationById(Long applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ApplicationNotFoundException(applicationId));
    }

    // Verify that a recruiter owns a job
    private Job getOwnedJob(
            Long jobId,
            String recruiterEmail) {

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new JobNotFoundException(jobId));

        if (job.getRecruiter() == null ||
                !job.getRecruiter()
                        .getEmail()
                        .equals(recruiterEmail)) {

            throw new AccessDeniedException(
                    "You are not authorized to access this job's applications"
            );
        }

        return job;
    }

    // Convert Entity → Response DTO
    private ApplicationResponse convertToResponse(
            Application application) {

        Job job = application.getJob();
        boolean hasResume = application.getCandidate().getResumeFileName() != null &&
                !application.getCandidate().getResumeFileName().isEmpty();

        return new ApplicationResponse(
                application.getId(),
                application.getCandidate().getId(),
                application.getCandidate().getName(),
                application.getCandidate().getEmail(),
                job.getId(),
                job.getTitle(),
                job.getCompany(),
                job.getLocation(),
                job.getSalary(),
                application.getStatus(),
                hasResume,
                application.getCandidate().getResumeFileName()
        );
    }
}