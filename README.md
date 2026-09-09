# SmartHire

SmartHire is a full-stack recruitment and job management system that connects candidates and recruiters through a secure web application.

The project provides APIs for user authentication, job management, job applications, application tracking, and role-based access control.

## 🚀 Project Overview

SmartHire is designed with two primary user roles:

- **Candidate** – Browse jobs, search for opportunities, and apply for jobs.
- **Recruiter** – Create and manage jobs, view applications, and update application statuses.

The backend is built using Java and Spring Boot with MySQL for data persistence and JWT-based authentication.

---

## ✨ Features

### Authentication & Authorization

- User registration
- Candidate and Recruiter roles
- Secure password hashing using BCrypt
- User login
- JWT authentication
- Protected REST APIs
- Role-based authorization
- `/api/auth/me` endpoint for retrieving the logged-in user
- Recruiter ownership validation

### Job Management

Recruiters can:

- Create jobs
- Update jobs
- Delete jobs
- Open or close jobs

Candidates and other users can:

- View available jobs
- View individual job details
- Search jobs by title
- Search jobs by location
- Filter jobs by status
- Use pagination
- Use sorting

### Application Management

Candidates can:

- Apply for jobs
- View their applications
- Prevent duplicate applications
- Cannot apply for closed jobs

Recruiters can:

- View applications for their own jobs
- Update application status
- Track candidates through application stages

Application statuses:

- APPLIED
- SHORTLISTED
- REJECTED
- HIRED

### Validation & Exception Handling

- Request validation using Jakarta Validation
- Centralized exception handling
- Custom business exceptions
- Meaningful HTTP status codes
- Consistent API response structure

---

## 🛠️ Tech Stack

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- BCrypt
- Jakarta Validation
- Maven

### Database

- MySQL 8

### API Testing

- Postman

### Version Control

- Git
- GitHub

### Frontend

The React frontend will be added as the next phase of the project.

Planned frontend technologies:

- React
- JavaScript
- HTML
- CSS
- REST API integration

---

## 🏗️ Backend Architecture

SmartHire follows a layered Spring Boot architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
MySQL Database