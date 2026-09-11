package com.mahesh.smarthire.dto;

import com.mahesh.smarthire.enums.JobStatus;

public class JobResponse {

    private Long id;
    private String title;
    private String company;
    private String location;
    private String salary;
    private String description;
    private JobStatus status;

    public JobResponse() {
    }

    public JobResponse(
            Long id,
            String title,
            String company,
            String location,
            String salary,
            String description,
            JobStatus status) {

        this.id = id;
        this.title = title;
        this.company = company;
        this.location = location;
        this.salary = salary;
        this.description = description;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }
}