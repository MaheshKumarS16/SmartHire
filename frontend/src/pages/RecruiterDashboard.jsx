import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  getMyJobs
} from "../services/recruiterJobService";

import {
  getApplicationsForJob
} from "../services/applicationService";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

import "./RecruiterDashboard.css";


function RecruiterDashboard() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [totalApplicants, setTotalApplicants] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");


  async function loadDashboard() {
    setIsLoading(true);
    setError("");

    try {
      const jobsResponse = await getMyJobs();

      const recruiterJobs = jobsResponse.data || [];

      setJobs(recruiterJobs);


      let applicantCount = 0;

      for (const job of recruiterJobs) {
        try {
          const applicationsResponse =
            await getApplicationsForJob(job.id);

          applicantCount +=
            (applicationsResponse.data || []).length;

        } catch (error) {
          console.error(
            `Unable to load applicants for job ${job.id}`,
            error
          );
        }
      }

      setTotalApplicants(applicantCount);

    } catch (error) {
      setError(
        error.message ||
        "Unable to load recruiter dashboard."
      );
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    loadDashboard();
  }, []);


  const totalJobs = jobs.length;

  const openJobs = jobs.filter(
    (job) => job.status === "OPEN"
  ).length;

  const closedJobs = jobs.filter(
    (job) => job.status === "CLOSED"
  ).length;


  function getStatusClass(status) {
    if (status === "OPEN") {
      return "badge badge-open";
    }

    if (status === "CLOSED") {
      return "badge badge-closed";
    }

    return "badge";
  }


  function formatStatus(status) {
    if (!status) {
      return "Unknown";
    }

    return (
      status.charAt(0) +
      status.slice(1).toLowerCase()
    );
  }


  return (
    <main className="page recruiter-dashboard-page">

      <div className="container">

        {/* Dashboard Header */}

        <section className="recruiter-dashboard-header">

          <div>

            <p className="dashboard-eyebrow">
              Recruiter Dashboard
            </p>

            <h1 className="dashboard-title">
              Welcome back, {user?.name || "Recruiter"}!
            </h1>

            <p className="dashboard-subtitle">
              Manage your job openings and track candidates
              throughout the recruitment process.
            </p>

          </div>


          <div className="dashboard-header-actions">

            <Link
              to="/create-job"
              className="btn btn-primary"
            >
              + Create Job
            </Link>

          </div>

        </section>


        {/* Loading */}

        {isLoading && (
          <Loading message="Loading recruiter dashboard..." />
        )}


        {/* Error */}

        {!isLoading && error && (
          <ErrorMessage
            message={error}
            onRetry={loadDashboard}
          />
        )}


        {/* Dashboard */}

        {!isLoading && !error && (
          <>

            {/* Statistics */}

            <section className="recruiter-stats-grid">

              <div className="recruiter-stat-card">

                <div className="recruiter-stat-icon recruiter-icon-primary">
                  J
                </div>

                <div>

                  <p className="recruiter-stat-label">
                    Total Jobs
                  </p>

                  <h2 className="recruiter-stat-value">
                    {totalJobs}
                  </h2>

                </div>

              </div>


              <div className="recruiter-stat-card">

                <div className="recruiter-stat-icon recruiter-icon-success">
                  ✓
                </div>

                <div>

                  <p className="recruiter-stat-label">
                    Open Jobs
                  </p>

                  <h2 className="recruiter-stat-value">
                    {openJobs}
                  </h2>

                </div>

              </div>


              <div className="recruiter-stat-card">

                <div className="recruiter-stat-icon recruiter-icon-danger">
                  ×
                </div>

                <div>

                  <p className="recruiter-stat-label">
                    Closed Jobs
                  </p>

                  <h2 className="recruiter-stat-value">
                    {closedJobs}
                  </h2>

                </div>

              </div>


              <div className="recruiter-stat-card">

                <div className="recruiter-stat-icon recruiter-icon-warning">
                  A
                </div>

                <div>

                  <p className="recruiter-stat-label">
                    Total Applicants
                  </p>

                  <h2 className="recruiter-stat-value">
                    {totalApplicants}
                  </h2>

                </div>

              </div>

            </section>


            {/* Main Content */}

            <section className="recruiter-dashboard-grid">

              {/* Jobs */}

              <div className="recruiter-panel">

                <div className="recruiter-panel-header">

                  <div>

                    <h2>
                      Your Recent Jobs
                    </h2>

                    <p>
                      Manage your latest job postings.
                    </p>

                  </div>


                  {jobs.length > 0 && (
                    <Link
                      to="/my-jobs"
                      className="panel-link"
                    >
                      View All
                    </Link>
                  )}

                </div>


                {jobs.length === 0 ? (

                  <div className="recruiter-empty-state">

                    <div className="recruiter-empty-icon">
                      J
                    </div>

                    <h3>
                      No jobs posted yet
                    </h3>

                    <p>
                      Create your first job posting to start
                      attracting candidates.
                    </p>

                    <Link
                      to="/create-job"
                      className="btn btn-primary"
                    >
                      Create Your First Job
                    </Link>

                  </div>

                ) : (

                  <div className="recruiter-job-list">

                    {jobs.slice(0, 5).map((job) => (

                      <div
                        className="recruiter-job-item"
                        key={job.id}
                      >

                        <div className="recruiter-job-main">

                          <div className="recruiter-job-icon">
                            {job.title
                              ?.charAt(0)
                              ?.toUpperCase() || "J"}
                          </div>


                          <div className="recruiter-job-info">

                            <h3>
                              {job.title || "Untitled Job"}
                            </h3>

                            <p>
                              {job.companyName ||
                                "Company"}
                            </p>

                            {job.location && (
                              <span>
                                {job.location}
                              </span>
                            )}

                          </div>

                        </div>


                        <div className="recruiter-job-right">

                          <span
                            className={getStatusClass(
                              job.status
                            )}
                          >
                            {formatStatus(job.status)}
                          </span>

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>


              {/* Quick Actions */}

              <div className="recruiter-panel">

                <div className="recruiter-panel-header">

                  <div>

                    <h2>
                      Quick Actions
                    </h2>

                    <p>
                      Manage your recruitment workflow.
                    </p>

                  </div>

                </div>


                <div className="recruiter-quick-actions">

                  <Link
                    to="/create-job"
                    className="recruiter-quick-action"
                  >

                    <div className="recruiter-quick-icon">
                      +
                    </div>

                    <div>

                      <h3>
                        Create Job
                      </h3>

                      <p>
                        Post a new opportunity
                      </p>

                    </div>

                    <span>
                      →
                    </span>

                  </Link>


                  <Link
                    to="/my-jobs"
                    className="recruiter-quick-action"
                  >

                    <div className="recruiter-quick-icon">
                      J
                    </div>

                    <div>

                      <h3>
                        My Jobs
                      </h3>

                      <p>
                        Manage your job postings
                      </p>

                    </div>

                    <span>
                      →
                    </span>

                  </Link>

                </div>


                {/* Recruitment Overview */}

                <div className="recruitment-overview">

                  <h3>
                    Recruitment Overview
                  </h3>


                  <div className="recruitment-row">

                    <span>
                      Open Jobs
                    </span>

                    <strong>
                      {openJobs}
                    </strong>

                  </div>


                  <div className="recruitment-row">

                    <span>
                      Closed Jobs
                    </span>

                    <strong>
                      {closedJobs}
                    </strong>

                  </div>


                  <div className="recruitment-row">

                    <span>
                      Total Applicants
                    </span>

                    <strong>
                      {totalApplicants}
                    </strong>

                  </div>

                </div>

              </div>

            </section>

          </>
        )}

      </div>

    </main>
  );
}


export default RecruiterDashboard;