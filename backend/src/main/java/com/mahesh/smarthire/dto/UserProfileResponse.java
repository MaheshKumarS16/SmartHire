package com.mahesh.smarthire.dto;

import com.mahesh.smarthire.enums.UserRole;
import java.time.LocalDateTime;

public class UserProfileResponse {

    private Long id;
    private String name;
    private String email;
    private UserRole role;
    private String phone;
    private String location;
    private String summary;
    private String skills;
    private String education;
    private String experience;
    private boolean hasResume;
    private String resumeFileName;
    private LocalDateTime resumeUpdatedAt;

    public UserProfileResponse() {
    }

    public UserProfileResponse(
            Long id,
            String name,
            String email,
            UserRole role,
            String phone,
            String location,
            String summary,
            String skills,
            String education,
            String experience,
            boolean hasResume,
            String resumeFileName,
            LocalDateTime resumeUpdatedAt) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.phone = phone;
        this.location = location;
        this.summary = summary;
        this.skills = skills;
        this.education = education;
        this.experience = experience;
        this.hasResume = hasResume;
        this.resumeFileName = resumeFileName;
        this.resumeUpdatedAt = resumeUpdatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public boolean isHasResume() {
        return hasResume;
    }

    public void setHasResume(boolean hasResume) {
        this.hasResume = hasResume;
    }

    public String getResumeFileName() {
        return resumeFileName;
    }

    public void setResumeFileName(String resumeFileName) {
        this.resumeFileName = resumeFileName;
    }

    public LocalDateTime getResumeUpdatedAt() {
        return resumeUpdatedAt;
    }

    public void setResumeUpdatedAt(LocalDateTime resumeUpdatedAt) {
        this.resumeUpdatedAt = resumeUpdatedAt;
    }
}
