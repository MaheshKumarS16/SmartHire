package com.mahesh.smarthire.exception;

public class ApplicationNotFoundException extends RuntimeException {

    private final Long applicationId;

    public ApplicationNotFoundException(Long applicationId) {
        super("Application with ID " + applicationId + " not found");
        this.applicationId = applicationId;
    }

    public Long getApplicationId() {
        return applicationId;
    }
}