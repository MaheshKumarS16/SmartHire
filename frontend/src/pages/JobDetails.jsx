import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  getJobById
} from "../services/jobService";

import {
  applyForJob
} from "../services/applicationService";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

import "./JobDetails.css";


function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  async function loadJob() {
    setIsLoading(true);
    setError("");

    try {
      const response = await getJobById(id);

      setJob(response.data);
    } catch (error) {
      setError(
        error.message ||
        "Unable to load job details."
      );
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    loadJob();
  }, [id]);


  async function handleApply() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "CANDIDATE") {
      return;
    }

    if (job?.status !== "OPEN") {
      return;
    }

    setIsApplying(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await applyForJob(job.id);

      setSuccessMessage(
        response.message ||
        "Application submitted successfully."
      );
    } catch (error) {
      setError(
        error.message ||
        "Unable to submit application."
      );
    } finally {
      setIsApplying(false);
    }
  }


  function getStatusClass(status) {
    if (status === "OPEN") {
      return "job-detail-status job-detail-status-open";
    }

    if (status === "CLOSED") {
      return "job-detail-status job-detail-status-closed";
    }

    return "job-detail-status";
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


  if (isLoading) {
    return (
      <main className="page job-details-page">
        <div className="container">
          <Loading message="Loading job details..." />
        </div>
      </main>
    );
  }


  if (error && !job) {
    return (
      <main className="page job-details-page">
        <div className="container">

          <ErrorMessage
            message={error}
            onRetry={loadJob}
          />

          <Link
            to="/jobs"
            className="btn btn-secondary job-back-button"
          >
            ← Back to Jobs
          </Link>

        </div>
      </main>
    );
  }


  if (!job) {
    return null;
  }


  const isCandidate =
    isAuthenticated &&
    user?.role === "CANDIDATE";

  const isRecruiter =
    isAuthenticated &&
    user?.role === "RECRUITER";

  const isOpen = job.status === "OPEN";


  return (
    <main className="page job-details-page">

      <div className="container">

        {/* Back Navigation */}

        <Link
          to="/jobs"
          className="job-details-back-link"
        >
          ← Back to Jobs
        </Link>


        {/* Main Job Header */}

        <section className="job-details-header">

          <div className="job-details-company-icon">
            {job.company
              ?.charAt(0)
              ?.toUpperCase() || "C"}
          </div>


          <div className="job-details-header-content">

            <div className="job-details-title-row">

              <div>

                <p className="job-details-eyebrow">
                  Job Opportunity
                </p>

                <h1 className="job-details-title">
                  {job.title}
                </h1>

                <p className="job-details-company">
                  {job.company}
                </p>

              </div>


              <span
                className={getStatusClass(
                  job.status
                )}
              >
                {formatStatus(job.status)}
              </span>

            </div>

          </div>

        </section>


        {/* Job Information */}

        <section className="job-details-layout">

          <div className="job-details-main">

            {/* Job Overview */}

            <div className="job-details-card">

              <h2>
                Job Overview
              </h2>

              <div className="job-overview-grid">

                <div className="job-overview-item">

                  <div className="job-overview-icon">
                    L
                  </div>

                  <div>

                    <span>
                      Location
                    </span>

                    <strong>
                      {job.location ||
                        "Not specified"}
                    </strong>

                  </div>

                </div>


                <div className="job-overview-item">

                  <div className="job-overview-icon">
                    ₹
                  </div>

                  <div>

                    <span>
                      Salary
                    </span>

                    <strong>
                      {job.salary ||
                        "Not specified"}
                    </strong>

                  </div>

                </div>


                <div className="job-overview-item">

                  <div className="job-overview-icon">
                    S
                  </div>

                  <div>

                    <span>
                      Status
                    </span>

                    <strong>
                      {formatStatus(job.status)}
                    </strong>

                  </div>

                </div>

              </div>

            </div>


            {/* Description */}

            <div className="job-details-card">

              <h2>
                Job Description
              </h2>

              <p className="job-full-description">
                {job.description ||
                  "No job description available."}
              </p>

            </div>


            {/* Application Message */}

            {successMessage && (

              <div className="job-success-message">

                <div className="job-message-icon">
                  ✓
                </div>

                <div>

                  <strong>
                    Application submitted
                  </strong>

                  <p>
                    {successMessage}
                  </p>

                </div>

              </div>

            )}


            {error && job && (

              <div className="job-error-message">

                <strong>
                  Unable to apply
                </strong>

                <p>
                  {error}
                </p>

              </div>

            )}

          </div>


          {/* Application Sidebar */}

          <aside className="job-details-sidebar">

            <div className="apply-card">

              <h2>
                Interested in this job?
              </h2>

              <p>
                Take the next step and submit
                your application.
              </p>


              {isCandidate && isOpen && (

                <>
                  <button
                    type="button"
                    className="btn btn-primary apply-button"
                    onClick={handleApply}
                    disabled={isApplying}
                  >
                    {isApplying
                      ? "Applying..."
                      : "Apply Now"}
                  </button>


                  {successMessage && (

                    <button
                      type="button"
                      className="btn btn-secondary apply-secondary-button"
                      onClick={() =>
                        navigate("/applications")
                      }
                    >
                      View My Applications
                    </button>

                  )}

                </>

              )}


              {!isAuthenticated && isOpen && (

                <button
                  type="button"
                  className="btn btn-primary apply-button"
                  onClick={handleApply}
                >
                  Login to Apply
                </button>

              )}


              {isRecruiter && (

                <div className="apply-info-message">

                  <strong>
                    Recruiter Account
                  </strong>

                  <p>
                    Recruiters cannot apply for jobs.
                  </p>

                </div>

              )}


              {isAuthenticated &&
                isCandidate &&
                !isOpen && (

                  <div className="apply-info-message">

                    <strong>
                      Applications Closed
                    </strong>

                    <p>
                      This job is no longer accepting
                      applications.
                    </p>

                  </div>

                )}


              {!isAuthenticated && !isOpen && (

                <div className="apply-info-message">

                  <strong>
                    Applications Closed
                  </strong>

                  <p>
                    This job is no longer accepting
                    applications.
                  </p>

                </div>

              )}

            </div>


            {/* Company Card */}

            <div className="company-card">

              <div className="company-card-icon">
                {job.company
                  ?.charAt(0)
                  ?.toUpperCase() || "C"}
              </div>

              <div>

                <span>
                  Hiring Company
                </span>

                <h3>
                  {job.company}
                </h3>

              </div>

            </div>

          </aside>

        </section>

      </div>

    </main>
  );
}


export default JobDetails;