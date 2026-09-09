package com.mahesh.smarthire.repository;

import com.mahesh.smarthire.entity.Application;
import com.mahesh.smarthire.enums.ApplicationStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    // Check whether a candidate has already applied for a job
    boolean existsByCandidateIdAndJobId(
            Long candidateId,
            Long jobId
    );

    // Get all applications submitted by a candidate
    List<Application> findByCandidateId(Long candidateId);

    // Get all applications for a particular job
    List<Application> findByJobId(Long jobId);

    // Get applications for a job filtered by status
    List<Application> findByJobIdAndStatus(
            Long jobId,
            ApplicationStatus status
    );

    // Get applications submitted by a candidate filtered by status
    List<Application> findByCandidateIdAndStatus(
            Long candidateId,
            ApplicationStatus status
    );
}