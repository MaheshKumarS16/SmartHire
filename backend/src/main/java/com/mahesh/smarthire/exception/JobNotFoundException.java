package com.mahesh.smarthire.exception;

public class JobNotFoundException extends RuntimeException {

    private final Long jobId;

    public JobNotFoundException(Long jobId) {
        super("Job with ID " + jobId + " not found");
        this.jobId = jobId;
    }

    public Long getJobId() {
        return jobId;
    }
}