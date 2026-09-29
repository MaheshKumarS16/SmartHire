import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Mail,
  CheckCircle,
  XCircle,
  Award,
  Clock,
  Download
} from "lucide-react";
import {
  getApplicationsForJob,
  updateApplicationStatus,
} from "../services/applicationService";
import { getJobById } from "../services/jobService";
import { downloadApplicantResume } from "../services/profileService";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import "./Applicants.css";

const AVATAR_COLORS = [
  "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
  "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
  "linear-gradient(135deg, #10b981 0%, #047857 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)"
];

function getCandidateAvatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function Applicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [downloadingResumeId, setDownloadingResumeId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  async function handleDownloadApplicantResume(applicationId, candidateName) {
    try {
      setDownloadingResumeId(applicationId);
      setError("");
      await downloadApplicantResume(applicationId, candidateName);
    } catch (err) {
      setError(err.message || "Failed to download candidate resume.");
    } finally {
      setDownloadingResumeId(null);
    }
  }

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [appsRes, jobRes] = await Promise.allSettled([
        getApplicationsForJob(jobId),
        getJobById(jobId)
      ]);

      if (appsRes.status === "fulfilled") {
        const list = Array.isArray(appsRes.value)
          ? appsRes.value
          : Array.isArray(appsRes.value?.data)
          ? appsRes.value.data
          : [];
        setApplications(list);
      } else {
        throw new Error(appsRes.reason?.message || "Failed to load applicants");
      }

      if (jobRes.status === "fulfilled") {
        setJob(jobRes.value?.data || jobRes.value);
      }
    } catch (err) {
      setError(err.message || "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [jobId]);

  async function handleStatusChange(applicationId, newStatus) {
    try {
      setUpdatingId(applicationId);
      setError("");

      const response = await updateApplicationStatus(applicationId, newStatus);
      const updated = response?.data || response;

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus, ...updated } : app
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update application status");
    } finally {
      setUpdatingId(null);
    }
  }

  const counts = useMemo(() => {
    return {
      ALL: applications.length,
      APPLIED: applications.filter((a) => a.status === "APPLIED").length,
      SHORTLISTED: applications.filter((a) => a.status === "SHORTLISTED").length,
      HIRED: applications.filter((a) => a.status === "HIRED").length,
      REJECTED: applications.filter((a) => a.status === "REJECTED").length,
    };
  }, [applications]);

  const displayedApplications = useMemo(() => {
    if (selectedFilter === "ALL") return applications;
    return applications.filter((a) => a.status === selectedFilter);
  }, [applications, selectedFilter]);

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
        {/* Breadcrumb Back Link */}
        <div className="applicants-top-nav">
          <Link to="/my-jobs" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to My Jobs</span>
          </Link>
        </div>

        {/* Job Header Banner */}
        <section className="applicants-header-card">
          <div className="applicants-header-left">
            <span className="applicants-badge-chip">Recruiter ATS</span>
            <h1 className="applicants-title">
              {job?.title ? `Applicants for ${job.title}` : "Job Applicants"}
            </h1>
            <p className="applicants-subtitle">
              {job?.company && <span>{job.company} • </span>}
              {job?.location && <span>{job.location} • </span>}
              <span>Review submitted profiles and advance candidates through hiring stages.</span>
            </p>
          </div>

          <div className="applicants-header-stats">
            <div className="stat-pill-box">
              <span className="stat-pill-num">{applications.length}</span>
              <span className="stat-pill-text">Total Candidates</span>
            </div>
          </div>
        </section>

        {error && <ErrorMessage message={error} onRetry={loadData} />}

        {/* Filter Tabs */}
        <div className="applicant-filter-tabs">
          {[
            { id: "ALL", label: "All Applicants", count: counts.ALL },
            { id: "APPLIED", label: "Applied / In Review", count: counts.APPLIED },
            { id: "SHORTLISTED", label: "Shortlisted", count: counts.SHORTLISTED },
            { id: "HIRED", label: "Hired", count: counts.HIRED },
            { id: "REJECTED", label: "Rejected", count: counts.REJECTED },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`filter-tab-pill ${selectedFilter === tab.id ? "active" : ""}`}
              onClick={() => setSelectedFilter(tab.id)}
            >
              <span>{tab.label}</span>
              <span className="tab-count-badge">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Applicants Content List */}
        {displayedApplications.length === 0 ? (
          <div className="applicants-empty-box">
            <div className="empty-user-icon">
              <Users size={36} />
            </div>
            <h3>No candidates found in this stage</h3>
            <p>
              {selectedFilter === "ALL"
                ? "No applications have been submitted for this position yet."
                : `There are currently no candidates marked as "${selectedFilter.toLowerCase()}".`}
            </p>
            {selectedFilter !== "ALL" && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSelectedFilter("ALL")}
              >
                View All Applicants
              </button>
            )}
          </div>
        ) : (
          <div className="applicants-cards-grid">
            {displayedApplications.map((app) => {
              const name = app.candidateName || app.candidateEmail || "Candidate";
              const initials = name.substring(0, 2).toUpperCase();
              const isUpdating = updatingId === app.id;

              return (
                <article key={app.id} className="applicant-profile-card">
                  <div className="profile-card-header">
                    <div
                      className="candidate-avatar-circle"
                      style={{ background: getCandidateAvatarColor(name) }}
                    >
                      {initials}
                    </div>

                    <div className="candidate-info-col">
                      <h2 className="candidate-name">{name}</h2>
                      <div className="candidate-meta-line">
                        <span className="meta-icon-text">
                          <Mail size={13} />
                          {app.candidateEmail || "No email provided"}
                        </span>
                      </div>
                    </div>

                    <div className="candidate-status-wrap">
                      <span
                        className={`dash-status-pill status-${(
                          app.status || "applied"
                        ).toLowerCase()}`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>

                  <div className="profile-card-details">
                    <div className="detail-item">
                      <span className="detail-label">Position</span>
                      <strong className="detail-val">
                        {app.jobTitle || job?.title || "Role"}
                      </strong>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Location</span>
                      <strong className="detail-val">
                        {app.location || job?.location || "Not specified"}
                      </strong>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Applied Status</span>
                      <strong className="detail-val">{app.status}</strong>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Resume Document</span>
                      {app.hasResume ? (
                        <button
                          type="button"
                          className="btn btn-outline btn-download-applicant-resume"
                          onClick={() => handleDownloadApplicantResume(app.id, name)}
                          disabled={downloadingResumeId === app.id}
                          title="Download Candidate Resume"
                          style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", fontSize: "0.78rem" }}
                        >
                          <Download size={13} />
                          <span>{downloadingResumeId === app.id ? "Downloading..." : "View Resume"}</span>
                        </button>
                      ) : (
                        <span className="detail-val text-muted" style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                          No Resume Uploaded
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ATS Action Stage Controls */}
                  <div className="profile-card-actions">
                    <span className="action-prompt">Update Stage:</span>
                    <div className="action-buttons-group">
                      <button
                        type="button"
                        className={`btn-stage-action btn-shortlist ${
                          app.status === "SHORTLISTED" ? "active-stage" : ""
                        }`}
                        onClick={() => handleStatusChange(app.id, "SHORTLISTED")}
                        disabled={isUpdating}
                        title="Mark Shortlisted"
                      >
                        <Award size={14} />
                        <span>Shortlist</span>
                      </button>

                      <button
                        type="button"
                        className={`btn-stage-action btn-hire ${
                          app.status === "HIRED" ? "active-stage" : ""
                        }`}
                        onClick={() => handleStatusChange(app.id, "HIRED")}
                        disabled={isUpdating}
                        title="Mark Hired"
                      >
                        <CheckCircle size={14} />
                        <span>Hire</span>
                      </button>

                      <button
                        type="button"
                        className={`btn-stage-action btn-reject ${
                          app.status === "REJECTED" ? "active-stage" : ""
                        }`}
                        onClick={() => handleStatusChange(app.id, "REJECTED")}
                        disabled={isUpdating}
                        title="Mark Rejected"
                      >
                        <XCircle size={14} />
                        <span>Reject</span>
                      </button>

                      {app.status !== "APPLIED" && (
                        <button
                          type="button"
                          className="btn-stage-action btn-reset"
                          onClick={() => handleStatusChange(app.id, "APPLIED")}
                          disabled={isUpdating}
                          title="Reset to Applied"
                        >
                          <Clock size={14} />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default Applicants;