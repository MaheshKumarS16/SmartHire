package com.mahesh.smarthire.exception;

public class JobClosedException extends RuntimeException {

    public JobClosedException() {
        super("Cannot apply for a closed job");
    }
}