package com.mahesh.smarthire.exception;

public class DuplicateApplicationException extends RuntimeException {

    public DuplicateApplicationException() {
        super("You have already applied for this job");
    }
}