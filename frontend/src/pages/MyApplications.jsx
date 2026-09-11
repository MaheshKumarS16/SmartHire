import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getMyApplications } from "../services/applicationService";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

import "./MyApplications.css";


function MyApplications() {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");


  async function loadApplications() {
    setIsLoading(true);
    setError("");

    try {
      const response = await getMyApplications();

      setApplications(response.data || []);
    } catch (error) {
      setError(
        error.message ||
        "Unable to load your applications."
      );
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    loadApplications();
  }, []);


  function getStatusClass(status) {
    if (status === "HIRED") {
      return "application-status application-status-hired";
    }

    if (status === "SHORTLISTED") {
      return "application-status application-status-shortlisted";
    }

    if (status === "REJECTED") {
      return "application-status application-status-rejected";
    }

    return "application-status application-status-applied";
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


  function getStatusMessage(status) {
    if (status === "HIRED") {
      return "Congratulations! You have been hired.";
    }

    if (status === "SHORTLISTED") {
      return "Your application has been shortlisted.";
    }

    if (status === "REJECTED") {
      return "Unfortunately, your application was not selected.";
    }

    return "Your application has been submitted successfully.";
  }


  return (
    <main className="page applications-page">

      <div className="container">

        {/* Page Header */}

        <section className="applications-header">

          <div>

            <p className="applications-eyebrow">
              APPLICATION TRACKER
            </p>

            <h1>
              My Applications
            </h1>

            <p className="applications-subtitle">
              Track all your job applications in one place.
            </p>

          </div>


          <div className="applications-header-actions">

            <button
              type="button"
              className="btn btn-secondary"
              onClick={loadApplications}
              disabled={isLoading}
            >
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>

            <Link
              to="/jobs"
              className="btn btn-primary"
            >
              Browse Jobs
            </Link>

          </div>

        </section>


        {/* Candidate Information */}

        <section className="candidate-info-card">

          <div className="candidate-avatar">
            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "C"}
          </div>

          <div>

            <span>
              Candidate
            </span>

            <strong>
              {user?.name || "Candidate"}
            </strong>

            <small>
              {user?.email || ""}
            </small>

          </div>

        </section>


        {/* Loading */}

        {isLoading && (

          <div className="applications-state">

            <Loading
              message="Loading your applications..."
            />

          </div>

        )}


        {/* Error */}

        {!isLoading && error && (

          <div className="applications-state">

            <ErrorMessage
              message={error}
              onRetry={loadApplications}
            />

          </div>

        )}


        {/* Applications */}

        {!isLoading &&
          !error &&
          applications.length > 0 && (

            <section className="applications-section">

              <div className="applications-section-header">

                <div>

                  <h2>
                    Your Applications
                  </h2>

                  <p>
                    {applications.length}{" "}
                    {applications.length === 1
                      ? "application"
                      : "applications"}{" "}
                    found
                  </p>

                </div>

              </div>


              <div className="applications-list">

                {applications.map((application) => {

                  const job =
                    application.job || {};

                  const jobId =
                    application.jobId ||
                    job.id;

                  const jobTitle =
                    application.jobTitle ||
                    job.title ||
                    "Job Application";

                  const company =
                    application.company ||
                    job.company ||
                    "Company";

                  const location =
                    application.location ||
                    job.location ||
                    "Location not specified";

                  const salary =
                    application.salary ||
                    job.salary ||
                    "Salary not specified";

                  const status =
                    application.status ||
                    "APPLIED";

                  const candidateName =
                    application.candidateName ||
                    application.userName ||
                    user?.name ||
                    "Candidate";

                  const candidateEmail =
                    application.candidateEmail ||
                    application.userEmail ||
                    user?.email ||
                    "";


                  return (

                    <article
                      key={application.id}
                      className="application-card"
                    >

                      {/* Application Top */}

                      <div className="application-card-top">

                        <div className="application-job-info">

                          <div className="application-company-icon">
                            {company
                              ?.charAt(0)
                              ?.toUpperCase() || "C"}
                          </div>


                          <div>

                            <p className="application-label">
                              JOB APPLICATION
                            </p>

                            <h3>
                              {jobTitle}
                            </h3>

                            <p className="application-company">
                              {company}
                            </p>

                          </div>

                        </div>


                        <span
                          className={getStatusClass(status)}
                        >
                          {formatStatus(status)}
                        </span>

                      </div>


                      {/* Job Information */}

                      <div className="application-job-details">

                        <div className="application-detail">

                          <span className="application-detail-icon">
                            L
                          </span>

                          <div>

                            <span>
                              Location
                            </span>

                            <strong>
                              {location}
                            </strong>

                          </div>

                        </div>


                        <div className="application-detail">

                          <span className="application-detail-icon">
                            ₹
                          </span>

                          <div>

                            <span>
                              Salary
                            </span>

                            <strong>
                              {salary}
                            </strong>

                          </div>

                        </div>


                        <div className="application-detail">

                          <span className="application-detail-icon">
                            A
                          </span>

                          <div>

                            <span>
                              Candidate
                            </span>

                            <strong>
                              {candidateName}
                            </strong>

                          </div>

                        </div>

                      </div>


                      {/* Application Footer */}

                      <div className="application-card-footer">

                        <div>

                          <strong>
                            {getStatusMessage(status)}
                          </strong>

                          <span>
                            {candidateEmail}
                          </span>

                        </div>


                        {jobId && (

                          <Link
                            to={`/jobs/${jobId}`}
                            className="application-view-button"
                          >
                            View Job →
                          </Link>

                        )}

                      </div>

                    </article>

                  );

                })}

              </div>

            </section>

          )}


        {/* Empty State */}

        {!isLoading &&
          !error &&
          applications.length === 0 && (

            <section className="applications-empty">

              <div className="applications-empty-icon">
                A
              </div>

              <h2>
                No applications yet
              </h2>

              <p>
                You haven't applied for any jobs yet.
                Start exploring opportunities and submit
                your first application.
              </p>

              <Link
                to="/jobs"
                className="btn btn-primary"
              >
                Browse Jobs
              </Link>

            </section>

          )}

      </div>

    </main>
  );
}


export default MyApplications;