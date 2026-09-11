package com.mahesh.smarthire.entity;

import com.mahesh.smarthire.enums.ApplicationStatus;

import jakarta.persistence.*;

@Entity
@Table(
        name = "applications",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "candidate_id",
                                "job_id"
                        }
                )
        }
)
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Candidate who applied
    @ManyToOne
    @JoinColumn(
            name = "candidate_id",
            nullable = false
    )
    private User candidate;

    // Job being applied for
    @ManyToOne
    @JoinColumn(
            name = "job_id",
            nullable = false
    )
    private Job job;

    // Application status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status =
            ApplicationStatus.APPLIED;

    public Application() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getCandidate() {
        return candidate;
    }

    public void setCandidate(User candidate) {
        this.candidate = candidate;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}