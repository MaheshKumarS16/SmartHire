import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getApplicationsForJob,
  updateApplicationStatus,
} from "../services/applicationService";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

import "./Applicants.css";

function Applicants() {
  const { jobId } = useParams();

  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  async function loadApplicants() {
    try {
      setLoading(true);
      setError("");

      const response = await getApplicationsForJob(jobId);

      setApplications(response.data || []);
    } catch (err) {
      setError(err.message || "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplicants();
  }, [jobId]);

  async function handleStatusChange(applicationId, status) {
    try {
      setUpdatingId(applicationId);
      setError("");

      const response = await updateApplicationStatus(
        applicationId,
        status
      );

      const updatedApplication = response.data;

      setApplications((previousApplications) =>
        previousApplications.map((application) =>
          application.id === applicationId
            ? updatedApplication
            : application
        )
      );
    } catch (err) {
      setError(
        err.message || "Failed to update application status"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function getStatusClass(status) {
    switch (status) {
      case "APPLIED":
        return "status-badge status-applied";

      case "SHORTLISTED":
        return "status-badge status-shortlisted";

      case "REJECTED":
        return "status-badge status-rejected";

      case "HIRED":
        return "status-badge status-hired";

      default:
        return "status-badge";
    }
  }

  function formatStatus(status) {
    if (!status) {
      return "Unknown";
    }

    return status.charAt(0) + status.slice(1).toLowerCase();
  }

  if (loading) {
    return (
      <main className="applicants-page page">
        <div className="container">
          <Loading message="Loading applicants..." />
        </div>
      </main>
    );
  }

  return (
    <main className="applicants-page page">
      <div className="container">

        {/* Page Header */}

        <section className="applicants-header">
          <div>
            <p className="applicants-eyebrow">
              RECRUITER
            </p>

            <h1>
              Applicants
            </h1>

            <p className="applicants-subtitle">
              Review candidates and manage their application status.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/my-jobs")}
          >
            ← Back to My Jobs
          </button>
        </section>

        {/* Error Message */}

        <ErrorMessage
          message={error}
          onRetry={loadApplicants}
        />

        {/* Summary */}

        {!error && (
          <section className="applicants-summary">
            <div className="applicants-summary-card">
              <span className="applicants-summary-number">
                {applications.length}
              </span>

              <span className="applicants-summary-label">
                {applications.length === 1
                  ? "Applicant"
                  : "Applicants"}
              </span>
            </div>
          </section>
        )}

        {/* Empty State */}

        {!error && applications.length === 0 && (
          <section className="applicants-empty">
            <div className="applicants-empty-icon">
              👤
            </div>

            <h2>
              No applicants yet
            </h2>

            <p>
              Candidates who apply for this job will appear here.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/my-jobs")}
            >
              Back to My Jobs
            </button>
          </section>
        )}

        {/* Applicants List */}

        {!error && applications.length > 0 && (
          <section className="applicants-list">

            {applications.map((application) => (
              <article
                className="applicant-card"
                key={application.id}
              >

                {/* Candidate Header */}

                <div className="applicant-card-header">

                  <div className="applicant-avatar">
                    {application.candidateName
                      ? application.candidateName
                          .charAt(0)
                          .toUpperCase()
                      : "C"}
                  </div>

                  <div className="applicant-candidate-info">

                    <h2>
                      {application.candidateName ||
                        "Unknown Candidate"}
                    </h2>

                    <p>
                      {application.candidateEmail ||
                        "No email available"}
                    </p>

                  </div>

                  <span className={getStatusClass(application.status)}>
                    {formatStatus(application.status)}
                  </span>

                </div>

                {/* Application Information */}

                <div className="applicant-details">

                  <div className="applicant-detail">

                    <span className="applicant-detail-label">
                      Position
                    </span>

                    <strong>
                      {application.jobTitle ||
                        "Job position"}
                    </strong>

                  </div>

                  <div className="applicant-detail">

                    <span className="applicant-detail-label">
                      Company
                    </span>

                    <strong>
                      {application.company ||
                        "Company"}
                    </strong>

                  </div>

                  <div className="applicant-detail">

                    <span className="applicant-detail-label">
                      Application ID
                    </span>

                    <strong>
                      #{application.id}
                    </strong>

                  </div>

                </div>

                {/* Status Actions */}

                <div className="applicant-actions">

                  <span className="applicant-actions-label">
                    Update application status
                  </span>

                  <div className="applicant-status-buttons">

                    <button
                      type="button"
                      className="btn btn-outline applicant-status-button"
                      disabled={updatingId === application.id}
                      onClick={() =>
                        handleStatusChange(
                          application.id,
                          "SHORTLISTED"
                        )
                      }
                    >
                      Shortlist
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline applicant-status-button"
                      disabled={updatingId === application.id}
                      onClick={() =>
                        handleStatusChange(
                          application.id,
                          "REJECTED"
                        )
                      }
                    >
                      Reject
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary applicant-status-button"
                      disabled={updatingId === application.id}
                      onClick={() =>
                        handleStatusChange(
                          application.id,
                          "HIRED"
                        )
                      }
                    >
                      Hire
                    </button>

                  </div>

                  {updatingId === application.id && (
                    <span className="applicant-updating">
                      Updating status...
                    </span>
                  )}

                </div>

              </article>
            ))}

          </section>
        )}

      </div>
    </main>
  );
}

export default Applicants;