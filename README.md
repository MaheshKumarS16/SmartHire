SmartHire – Full Stack Job Portal

SmartHire is a full-stack job portal designed to connect candidates and recruiters through a role-based web application.

Candidates can create accounts, browse jobs, apply for positions, and track application status. Recruiters can create job postings, view applicants, and update application statuses.

Live Project

Live Application: https://smart-hire-alpha-seven.vercel.app

Backend API: https://smarthire-qqu1.onrender.com

GitHub: https://github.com/MaheshKumarS16/SmartHire

Tech Stack

Frontend

React 19

JavaScript

Vite

React Router DOM

HTML5

CSS3

Fetch API

LocalStorage for client-side authentication state

Backend

Java 21

Spring Boot 4

Spring Web

Spring Security

Spring Data JPA

Hibernate ORM

RESTful APIs

Maven

JWT-based authentication

Database

MySQL-compatible database

TiDB Cloud for production

MySQL Connector/J

Deployment & Infrastructure

Vercel – Frontend deployment

Render – Backend deployment

TiDB Cloud – Production database

Docker – Backend containerization

Key Features

Candidate

Candidate registration and login

JWT authentication

Browse available jobs

View job details

Apply for jobs

View submitted applications

Track application status

Recruiter

Recruiter registration and login

Create job postings

Manage posted jobs

View applicants

View candidate information

Update application status

Authentication & Authorization

JWT-based authentication

Spring Security

Role-based access control

Protected backend endpoints

CORS configuration

Secure environment-based configuration

Application Workflow

                         SmartHire
                             |
              +--------------+--------------+
              |                             |
          Candidate                      Recruiter
              |                             |
        Register/Login                Register/Login
              |                             |
          Browse Jobs                 Create Jobs
              |                             |
          Apply for Job              View Applicants
              |                             |
       My Applications              Update Status
              |                             |
              +-------------+---------------+
                            |
                   Application Tracking

Project Architecture

SmartHire
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/mahesh/smarthire/
│   │   │   │       ├── controller/
│   │   │   │       ├── service/
│   │   │   │       ├── repository/
│   │   │   │       ├── entity/
│   │   │   │       ├── dto/
│   │   │   │       ├── security/
│   │   │   │       └── ...
│   │   │   └── resources/
│   │   └── test/
│   ├── pom.xml
│   ├── mvnw
│   └── smarthire.Dockerfile
│
└── README.md

REST API

Production API base URL:

https://smarthire-qqu1.onrender.com/api

Authentication

POST /auth/register
POST /auth/login

Jobs

GET /jobs

Applications

POST /applications
GET /applications/my
GET /applications/job/{jobId}
PATCH /applications/{applicationId}/status

Protected endpoints require JWT authentication.

Frontend API Configuration

The frontend uses:

VITE_API_BASE_URL

Production value:

VITE_API_BASE_URL=https://smarthire-qqu1.onrender.com/api

Environment Variables

Backend

Production secrets and configuration are supplied through environment variables:

DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
JWT_EXPIRATION
SPRING_PROFILES_ACTIVE
CORS_ALLOWED_ORIGINS
PORT

Frontend

VITE_API_BASE_URL

Do not commit production passwords, JWT secrets, or other sensitive credentials to GitHub.

Run Locally

Prerequisites

Java 21

Node.js

npm

MySQL or a MySQL-compatible database

Git

Clone Repository

git clone https://github.com/MaheshKumarS16/SmartHire.git
cd SmartHire

Start Backend

cd backend

Configure your local environment variables:

DB_URL=jdbc:mysql://localhost:3306/smarthire
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_long_random_secret
JWT_EXPIRATION=86400000
PORT=8080
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
SPRING_PROFILES_ACTIVE=dev

Run with Maven Wrapper on Windows:

.\mvnw.cmd spring-boot:run

Backend:

http://localhost:8080

Start Frontend

Open another terminal:

cd frontend
npm install

Configure:

VITE_API_BASE_URL=http://localhost:8080/api

Start Vite:

npm run dev

Frontend:

http://localhost:5173

Build Frontend

npm run build

Production Deployment

Frontend – Vercel

The React/Vite frontend is deployed on Vercel.

Production API configuration:

VITE_API_BASE_URL=https://smarthire-qqu1.onrender.com/api

After changing a VITE_* environment variable, redeploy the frontend.

Backend – Render

The Spring Boot backend is deployed on Render using:

backend/smarthire.Dockerfile

The backend uses Render's PORT environment variable.

Database – TiDB Cloud

The production backend connects to TiDB Cloud using its MySQL-compatible connection.

Database credentials are provided through Render environment variables.

Testing Completed

The deployed application has been tested through the main end-to-end workflow:

Candidate registration

Candidate login

Recruiter registration

Recruiter login

Recruiter job creation

Candidate job listing

Candidate job application

Candidate application history

Recruiter applicant management

Application status update

Candidate status tracking

JWT authentication

Frontend-to-backend API communication

Production database connectivity

Screenshots

Add screenshots of the following pages to the repository if desired:

- Login
- Candidate Dashboard
- Jobs
- Job Details
- My Applications
- Recruiter Dashboard
- Create Job
- Applicants

Security

Keep .env files and production credentials out of Git.

Use strong JWT secrets in production.

Use environment variables for database credentials.

Rotate credentials if they are ever exposed.

Do not place passwords or private API keys inside frontend source code.

Author

Mahesh Kumar S

GitHub: https://github.com/MaheshKumarS16

LinkedIn: https://www.linkedin.com/in/maheshkumars1610/

License

This project is developed as a portfolio and learning project.