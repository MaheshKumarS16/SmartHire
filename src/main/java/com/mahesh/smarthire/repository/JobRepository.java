package com.mahesh.smarthire.repository;

import com.mahesh.smarthire.entity.Job;
import com.mahesh.smarthire.enums.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    // Search by title
    List<Job> findByTitleContainingIgnoreCase(String title);
    List<Job> findByRecruiterEmail(String email);
    // Search by location
    List<Job> findByLocationContainingIgnoreCase(String location);

    // Search by title + location
    List<Job> findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(
            String title,
            String location
    );

    // Filter by status
    List<Job> findByStatus(JobStatus status);

    // Search by title + status + pagination + sorting
    Page<Job> findByTitleContainingIgnoreCaseAndStatus(
            String title,
            JobStatus status,
            Pageable pageable
    );

    // Search by location + status + pagination + sorting
    Page<Job> findByLocationContainingIgnoreCaseAndStatus(
            String location,
            JobStatus status,
            Pageable pageable
    );

    // Search by title + location + status + pagination + sorting
    Page<Job> findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCaseAndStatus(
            String title,
            String location,
            JobStatus status,
            Pageable pageable
    );

    // Filter by status + pagination + sorting
    Page<Job> findByStatus(
            JobStatus status,
            Pageable pageable
    );
}       