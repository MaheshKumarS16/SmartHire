# SmartHire

> A modern, full-stack recruitment platform connecting candidates and recruiters through streamlined job discovery, candidate tracking, and resume management.

---

## Live Deployment

- **Web Application:** [https://smart-hire-alpha-seven.vercel.app](https://smart-hire-alpha-seven.vercel.app)
- **Backend API:** [https://smarthire-qqu1.onrender.com/api](https://smarthire-qqu1.onrender.com/api)
- **GitHub Repository:** [https://github.com/MaheshKumarS16/SmartHire](https://github.com/MaheshKumarS16/SmartHire)

---

## Overview

SmartHire is a full-featured web application designed to bridge the gap between job seekers and hiring teams. It offers dedicated, role-tailored workflows:

- **Candidates** can explore open positions, search and filter listings, manage their professional profile, upload resumes, submit applications with a single click, and monitor their application status in real time.
- **Recruiters** can publish job openings, manage active listings, inspect incoming applicant profiles and resumes, and update candidate hiring stages through an applicant tracking system (ATS).

The platform is built with a decoupled architecture featuring a responsive React frontend, a resilient Spring Boot REST backend, and a production-grade MySQL database.

---

## Key Features

### Candidate Features
- **Account Registration & Authentication:** Secure email/password signup and login with role assignment and JWT session persistence.
- **Job Discovery & Search:** Real-time search across job titles, company names, and descriptions, combined with location filtering and status toggles.
- **Job Details View:** In-depth job specifications including company information, required skills, compensation range, and location.
- **One-Click Applications:** Direct job application with duplicate prevention (HTTP 409 guard).
- **Application History & Tracking:** Dedicated dashboard displaying all submitted applications with real-time status badges (`APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `ACCEPTED`, `REJECTED`).
- **Profile Management:** Editable professional summary, primary skill tags, phone number, location, education, and years of experience.
- **Resume Management:** PDF/DOC resume upload, replacement, instant download, and deletion with client-side and server-side validation.

### Recruiter Features
- **Recruiter Dashboard:** High-level metrics overview showing active job counts, total applicants, and quick actions.
- **Job Posting & Management:** Create new job openings with structured compensation, requirements, and location tags.
- **Job Lifecycle Controls:** Edit existing job listings, toggle availability between `OPEN` and `CLOSED`, or delete listings.
- **Applicant Tracking System (ATS):** Dedicated applicant table per job listing with candidate profile summaries, contact details, and application dates.
- **Resume Review:** Direct, secure resume streaming/download for every applicant.
- **Status Progression:** Update candidate application status through hiring stages (`APPLIED` → `UNDER_REVIEW` → `SHORTLISTED` → `ACCEPTED` / `REJECTED`).

---

## Tech Stack

### Frontend
- **Framework:** React 19 (SPA)
- **Build Tool:** Vite
- **Routing:** React Router DOM (v7)
- **Styling:** Custom CSS3 Design System (Glassmorphic cards, responsive flex/grid layouts, mobile-first breakpoints, dark-mode inspired slate aesthetics)
- **State Management:** React Context API (`AuthContext`) with persistent `localStorage` session handling
- **HTTP Client:** Native Fetch API with centralized request/error interceptor (`api.js`)

### Backend
- **Language:** Java 21
- **Framework:** Spring Boot 3.4
- **Security:** Spring Security 6 with stateless JWT authentication filter (`JwtAuthenticationFilter`) and BCrypt password encryption
- **Data Persistence:** Spring Data JPA with Hibernate ORM
- **Build & Dependency Tool:** Maven (with Maven Wrapper `mvnw`)
- **Validation:** Jakarta Validation (`@Valid`, `@NotBlank`, etc.)

### Database
- **Engine:** MySQL 8.0+ (Local development) / TiDB Cloud Serverless (MySQL-compatible production)
- **Connection Pool:** HikariCP

### Deployment & Infrastructure
- **Frontend Hosting:** Vercel (Single-Page Application with rewrite routing)
- **Backend Hosting:** Render (Containerized with multi-stage Dockerfile)
- **CI/CD:** Automated GitHub triggers for both Vercel and Render deployments

---

## Architecture

SmartHire utilizes a stateless, client-server REST architecture:

```
┌────────────────────────────────┐
│   React 19 Frontend (Vite)     │
│   • Client-Side Routing        │
│   • AuthContext & JWT Storage  │
│   • Responsive Glass UI        │
└───────────────┬────────────────┘
                │ HTTPS / JSON
                ▼
┌────────────────────────────────┐
│   Spring Boot 3.4 REST API     │
│   • SecurityFilterChain (JWT)  │
│   • Global Exception Handling  │
│   • Business & File Services   │
└───────────────┬────────────────┘
                │ JDBC / JPA
                ▼
┌────────────────────────────────┐
│   MySQL / TiDB Database        │
│   • Relational Schema          │
│   • Unique Constraints         │
│   • Role-Based Data Isolation  │
└────────────────────────────────┘
```

1. The client sends authenticated requests with a `Bearer <token>` HTTP header.
2. Spring Security intercepts incoming calls via `JwtAuthenticationFilter`, validates token signatures and expiration, and populates the `SecurityContext`.
3. Service layers execute domain logic and enforce role-based access rules.
4. JPA repositories interact with the database using parameterized queries to prevent SQL injection.

---

## Project Structure

```
SmartHire/
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/
│   │   │   └── hero.png
│   │   ├── components/
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── Footer.jsx & Footer.css
│   │   │   ├── Loading.jsx
│   │   │   ├── Navbar.jsx & Navbar.css
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Applicants.jsx & Applicants.css
│   │   │   ├── CreateJob.jsx & CreateJob.css
│   │   │   ├── Dashboard.jsx & Dashboard.css
│   │   │   ├── EditJob.jsx & EditJob.css
│   │   │   ├── Home.jsx & Home.css
│   │   │   ├── JobDetails.jsx & JobDetails.css
│   │   │   ├── Jobs.jsx & Jobs.css
│   │   │   ├── Login.jsx & Login.css
│   │   │   ├── MyApplications.jsx & MyApplications.css
│   │   │   ├── MyJobs.jsx & MyJobs.css
│   │   │   ├── NotFound.jsx
│   │   │   ├── Profile.jsx & Profile.css
│   │   │   ├── RecruiterDashboard.jsx & RecruiterDashboard.css
│   │   │   └── Register.jsx & Register.css
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── applicationService.js
│   │   │   ├── authService.js
│   │   │   ├── jobService.js
│   │   │   ├── profileService.js
│   │   │   └── recruiterJobService.js
│   │   ├── App.jsx & App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/mahesh/smarthire/
│   │   │   │   ├── config/
│   │   │   │   │   ├── DataInitializer.java
│   │   │   │   │   └── SecurityConfig.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── ApplicationController.java
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── JobController.java
│   │   │   │   │   └── ProfileController.java
│   │   │   │   ├── dto/
│   │   │   │   │   ├── ApiResponse.java
│   │   │   │   │   ├── ApplicationRequest.java
│   │   │   │   │   ├── ApplicationResponse.java
│   │   │   │   │   ├── JobRequest.java
│   │   │   │   │   ├── JobResponse.java
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── LoginResponse.java
│   │   │   │   │   ├── RegisterRequest.java
│   │   │   │   │   ├── UserProfileRequest.java
│   │   │   │   │   ├── UserProfileResponse.java
│   │   │   │   │   └── UserResponse.java
│   │   │   │   ├── entity/
│   │   │   │   │   ├── Application.java
│   │   │   │   │   ├── Job.java
│   │   │   │   │   └── User.java
│   │   │   │   ├── enums/
│   │   │   │   │   ├── ApplicationStatus.java
│   │   │   │   │   ├── JobStatus.java
│   │   │   │   │   └── UserRole.java
│   │   │   │   ├── exception/
│   │   │   │   │   ├── ApplicationNotFoundException.java
│   │   │   │   │   ├── DuplicateApplicationException.java
│   │   │   │   │   ├── EmailAlreadyExistsException.java
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   ├── InvalidCredentialsException.java
│   │   │   │   │   ├── JobClosedException.java
│   │   │   │   │   ├── JobNotFoundException.java
│   │   │   │   │   └── UserNotFoundException.java
│   │   │   │   ├── repository/
│   │   │   │   │   ├── ApplicationRepository.java
│   │   │   │   │   ├── JobRepository.java
│   │   │   │   │   └── UserRepository.java
│   │   │   │   ├── security/
│   │   │   │   │   └── JwtAuthenticationFilter.java
│   │   │   │   ├── service/
│   │   │   │   │   ├── ApplicationService.java
│   │   │   │   │   ├── JobService.java
│   │   │   │   │   ├── JwtService.java
│   │   │   │   │   ├── ProfileService.java
│   │   │   │   │   └── UserService.java
│   │   │   │   └── SmarthireApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── application-dev.properties
│   │   │       └── application-prod.properties
│   │   └── test/
│   │       └── java/com/mahesh/smarthire/SmarthireApplicationTests.java
│   ├── .env.example
│   ├── pom.xml
│   ├── mvnw & mvnw.cmd
│   └── smarthire.Dockerfile
│
├── .gitignore
├── README.md
└── verify_full_production.mjs
```

---

## Authentication & Authorization

SmartHire uses token-based authentication with JSON Web Tokens (JWT):

- **User Roles:**
  - `CANDIDATE`: Access to browse, apply, view personal applications, and manage resume/profile.
  - `RECRUITER`: Access to post jobs, edit/close jobs, view applicant lists, and update applicant statuses.
- **Token Format:** Signed HMAC SHA-256 JWT containing user email as subject and assigned role claims.
- **Route Protection:**
  - Client-side: `<ProtectedRoute>` wrapper inspects authentication status and role before rendering protected pages.
  - Server-side: `SecurityConfig` specifies fine-grained URL patterns using `.requestMatchers(...)` and verifies token validity per request.

---

## Database Design

### Major Entities

#### 1. `User` (`users` table)
- Primary key: `id` (BIGINT, auto-increment)
- Unique fields: `email`
- Core fields: `name`, `password` (BCrypt hash), `role` (`CANDIDATE` / `RECRUITER`)
- Profile fields: `phone`, `location`, `summary`, `skills`, `education`, `experience`
- Resume metadata: `resumeFileName`, `resumeFilePath`, `resumeFileType`, `resumeUpdatedAt`

#### 2. `Job` (`jobs` table)
- Primary key: `id` (BIGINT, auto-increment)
- Fields: `title`, `company`, `location`, `salary`, `description`, `status` (`OPEN` / `CLOSED`)
- Relationships: `@ManyToOne` to `User` (`recruiter_id`)

#### 3. `Application` (`applications` table)
- Primary key: `id` (BIGINT, auto-increment)
- Fields: `status` (`APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `ACCEPTED`, `REJECTED`)
- Relationships:
  - `@ManyToOne` to `User` (`candidate_id`)
  - `@ManyToOne` to `Job` (`job_id`)
- Unique constraint: `UNIQUE (candidate_id, job_id)` prevents accidental or duplicate submissions.

---

## Resume Management

- **Supported Formats:** PDF (`.pdf`), Microsoft Word (`.doc`, `.docx`).
- **File Validation:** MIME type check and 5 MB size limit enforced on backend.
- **Storage Strategy:** Files are safely organized in an upload directory with sanitized, UUID-stamped filenames.
- **Security & Access Control:**
  - Candidates can only download or delete their own resume.
  - Recruiters can only access resumes belonging to candidates who submitted an active application to their posted job.

---

## Application Workflow

### Candidate Flow
```
Browse / Search Jobs ──▶ View Job Details ──▶ Apply With One Click
                                                     │
                                                     ▼
Track Status ◀── Updated Status (Shortlisted/etc.) ◀── Saved to Applications
```

### Recruiter Flow
```
Create Job Listing ──▶ Receive Candidate Applications ──▶ Review Applicant Profile & Resume
                                                                      │
                                                                      ▼
Closed / Filled Position ◀── Advance Hiring Pipeline (Shortlist/Accept/Reject)
```

---

## Demo Dataset

The application includes an automated `DataInitializer` that populates a realistic, professional dataset upon initial launch if the database contains fewer than 25 records.

> **Note:** Demo companies, hiring contacts, and job openings (e.g., TechNova Solutions, InnovateHub, CloudScale Systems) are simulated records generated for demonstration, testing, and portfolio evaluation purposes.

---

## REST API Reference

Base URL (Production): `https://smarthire-qqu1.onrender.com/api`

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register new candidate or recruiter |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |

### 2. Jobs (`/api/jobs`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/jobs` | Public | Retrieve all jobs |
| `GET` | `/api/jobs/{id}` | Public | Retrieve detailed job info by ID |
| `GET` | `/api/jobs/search` | Public | Search jobs by title, location, status |
| `GET` | `/api/jobs/page` | Public | Paginated job listings |
| `GET` | `/api/jobs/my` | Recruiter | Retrieve jobs posted by current recruiter |
| `POST` | `/api/jobs` | Recruiter | Create a new job listing |
| `PUT` | `/api/jobs/{id}` | Recruiter | Update an existing job listing |
| `PATCH` | `/api/jobs/{id}/status` | Recruiter | Toggle status (`OPEN` / `CLOSED`) |
| `DELETE`| `/api/jobs/{id}` | Recruiter | Delete a job listing |

### 3. Applications (`/api/applications`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/applications` | Candidate | Submit application for a job |
| `GET` | `/api/applications/my` | Candidate | View all submitted applications |
| `GET` | `/api/applications/job/{jobId}` | Recruiter | View applicants for a specific job |
| `PATCH` | `/api/applications/{id}/status` | Recruiter | Update candidate hiring stage |
| `GET` | `/api/applications/{id}/resume` | Recruiter | Download applicant's resume |

### 4. Profile & Resume (`/api/profile`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/profile` | Authenticated | Fetch current user profile |
| `PUT` | `/api/profile` | Authenticated | Update user profile details |
| `POST` | `/api/profile/resume` | Candidate | Upload or replace resume file |
| `GET` | `/api/profile/resume` | Candidate | Download own resume |
| `DELETE`| `/api/profile/resume` | Candidate | Remove uploaded resume |

---

## Local Development Setup

### Prerequisites
- **Java:** JDK 21+
- **Node.js:** v18+ and npm
- **Database:** MySQL 8.0+ running locally on port 3306
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/MaheshKumarS16/SmartHire.git
cd SmartHire
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Copy the sample environment file:
   ```bash
   cp .env.example .env
   ```
3. Configure your local database in `.env` (or pass as environment variables):
   ```env
   DB_URL=jdbc:mysql://localhost:3306/smarthire?createDatabaseIfNotExist=true
   DB_USERNAME=root
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
   JWT_EXPIRATION=86400000
   PORT=8080
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
   SPRING_PROFILES_ACTIVE=dev
   ```
4. Run the backend using the Maven wrapper:
   - On Windows (PowerShell/CMD):
     ```cmd
     .\mvnw.cmd spring-boot:run
     ```
   - On Linux/macOS:
     ```bash
     ./mvnw spring-boot:run
     ```
   The backend will start on `http://localhost:8080`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a local `.env` file (optional, defaults to `http://localhost:8080/api`):
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## Environment Variables Reference

Sensitive credentials must **never** be committed to version control. Set them as platform environment variables in Render/Vercel or in local ignored `.env` files.

### Backend Variables
| Variable | Description | Example / Default |
|----------|-------------|-------------------|
| `DB_URL` | JDBC database connection string | `jdbc:mysql://host:port/database` |
| `DB_USERNAME` | Database username | `smarthire_user` |
| `DB_PASSWORD` | Database user password | `********` |
| `JWT_SECRET` | Secret key for signing HMAC JWT tokens (min 32 chars) | `********` |
| `JWT_EXPIRATION` | Token validity duration in milliseconds | `86400000` (24h) |
| `PORT` | Server listening port | `8080` (or assigned by Render) |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed frontend origins | `https://smart-hire-alpha-seven.vercel.app` |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `prod` (production) / `dev` (local) |

### Frontend Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for backend REST endpoints | `https://smarthire-qqu1.onrender.com/api` |

---

## Production Deployment

### Frontend (Vercel)
- Configured via `frontend/vercel.json` with single-page application rewrites (`"source": "/(.*)", "destination": "/index.html"`).
- Automatically rebuilt and deployed upon push to the `main` branch.
- Environment variable `VITE_API_BASE_URL` set in Vercel project settings.

### Backend (Render)
- Containerized deployment using `backend/smarthire.Dockerfile` (multi-stage build with Eclipse Temurin JDK 21).
- Port bound dynamically using Render's `${PORT}` variable.
- Production environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, etc.) configured securely in Render dashboard.

### Database (TiDB Cloud)
- Fully managed, high-availability MySQL-compatible cloud database.
- Uses standard MySQL dialect (`org.hibernate.dialect.MySQLDialect`) and secure connection parameters.

---

## Future Improvements

- **AI Job Matching:** Semantic resume-to-job matching scores using vector embeddings.
- **Automated Resume Parsing:** Automatic profile population from uploaded PDF resumes.
- **Email Notifications:** Instant notifications on application status changes via SendGrid or AWS SES.
- **Recruiter Analytics:** Pipeline conversion rates, time-to-hire metrics, and applicant demographics.
- **In-App Messaging:** Direct messaging channel between recruiters and shortlisted candidates.

---

## Author

**Mahesh Kumar S**

- **GitHub:** [@MaheshKumarS16](https://github.com/MaheshKumarS16)
- **LinkedIn:** [Mahesh Kumar S](https://www.linkedin.com/in/maheshkumars1610/)

---

## License

This project is developed for portfolio and educational demonstration purposes.