import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

import {
  getMyJobs,
  updateJobStatus,
  deleteJob,
} from "../services/recruiterJobService";

import "./MyJobs.css";

function MyJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyJobs();

      setJobs(response.data || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === "OPEN" ? "CLOSED" : "OPEN";

    try {
      setActionLoading(`status-${job.id}`);
      setError("");

      await updateJobStatus(job.id, newStatus);

      setJobs((currentJobs) =>
        currentJobs.map((currentJob) =>
          currentJob.id === job.id
            ? { ...currentJob, status: newStatus }
            : currentJob
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update job status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (job) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${job.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(`delete-${job.id}`);
      setError("");

      await deleteJob(job.id);

      setJobs((currentJobs) =>
        currentJobs.filter((currentJob) => currentJob.id !== job.id)
      );
    } catch (err) {
      setError(err.message || "Failed to delete job");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <main className="page my-jobs-page">
        <div className="container">
          <Loading message="Loading your jobs..." />
        </div>
      </main>
    );
  }

  return (
    <main className="page my-jobs-page">
      <div className="container">

        <section className="page-header my-jobs-header">
          <div>
            <span className="eyebrow">RECRUITER PORTAL</span>

            <h1>My Jobs</h1>

            <p>
              Manage the jobs you have posted and track your recruitment
              activity.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/create-job")}
          >
            + Create New Job
          </button>
        </section>

        <ErrorMessage
          message={error}
          onRetry={loadJobs}
        />

        {jobs.length === 0 ? (
          <section className="empty-state">
            <div className="empty-icon">J</div>

            <h2>No jobs posted yet</h2>

            <p>
              You haven't created any jobs yet. Start by posting your first
              job opportunity.
            </p>

            <button
              className="primary-button"
              onClick={() => navigate("/create-job")}
            >
              Create Your First Job
            </button>
          </section>
        ) : (
          <>
            <div className="jobs-summary">
              <div>
                <strong>{jobs.length}</strong>
                <span>
                  {jobs.length === 1 ? " Job Posted" : " Jobs Posted"}
                </span>
              </div>

              <div className="jobs-summary-stats">
                <span>
                  <strong>
                    {jobs.filter((job) => job.status === "OPEN").length}
                  </strong>{" "}
                  Open
                </span>

                <span>
                  <strong>
                    {jobs.filter((job) => job.status === "CLOSED").length}
                  </strong>{" "}
                  Closed
                </span>
              </div>
            </div>

            <section className="my-jobs-grid">
              {jobs.map((job) => {
                const isOpen = job.status === "OPEN";
                const statusLoading =
                  actionLoading === `status-${job.id}`;
                const deleteLoading =
                  actionLoading === `delete-${job.id}`;

                return (
                  <article className="my-job-card" key={job.id}>

                    <div className="my-job-card-top">
                      <div className="company-avatar">
                        {job.company
                          ? job.company.charAt(0).toUpperCase()
                          : "C"}
                      </div>

                      <span
                        className={`status-badge ${
                          isOpen ? "status-open" : "status-closed"
                        }`}
                      >
                        <span className="status-dot"></span>
                        {isOpen ? "Open" : "Closed"}
                      </span>
                    </div>

                    <div className="my-job-card-content">

                      <h2>{job.title}</h2>

                      <p className="company-name">
                        {job.company}
                      </p>

                      <div className="job-meta">
                        <span>
                          <span className="meta-icon">⌖</span>
                          {job.location}
                        </span>

                        <span>
                          <span className="meta-icon">₹</span>
                          {job.salary}
                        </span>
                      </div>

                      <p className="job-description">
                        {job.description}
                      </p>

                    </div>

                    <div className="my-job-actions">

                      <button
                        className="secondary-button"
                        onClick={() =>
                          navigate(`/edit-job/${job.id}`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className={`status-action-button ${
                          isOpen
                            ? "close-button"
                            : "open-button"
                        }`}
                        onClick={() =>
                          handleToggleStatus(job)
                        }
                        disabled={statusLoading || deleteLoading}
                      >
                        {statusLoading
                          ? "Updating..."
                          : isOpen
                          ? "Close Job"
                          : "Reopen Job"}
                      </button>

                      <button
                        className="applicants-button"
                        onClick={() =>
                          navigate(
                            `/recruiter/applicants/${job.id}`
                          )
                        }
                      >
                        View Applicants
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => handleDelete(job)}
                        disabled={statusLoading || deleteLoading}
                      >
                        {deleteLoading ? "Deleting..." : "Delete"}
                      </button>

                    </div>
                  </article>
                );
              })}
            </section>
          </>
        )}

      </div>
    </main>
  );
}

export default MyJobs;