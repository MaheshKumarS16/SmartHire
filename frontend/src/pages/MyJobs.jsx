import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Briefcase,
  PlusCircle,
  Users,
  Edit3,
  Trash2,
  ToggleLeft,
  ToggleRight,
  MapPin,
  IndianRupee,
  Search,
  ExternalLink,
  AlertTriangle
} from "lucide-react";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import {
  getMyJobs,
  updateJobStatus,
  deleteJob,
} from "../services/recruiterJobService";
import "./MyJobs.css";

const AVATAR_COLORS = [
  "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
  "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
  "linear-gradient(135deg, #10b981 0%, #047857 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)"
];

function getJobAvatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function MyJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deleteCandidateJob, setDeleteCandidateJob] = useState(null);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getMyJobs();
      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];
      setJobs(list);
    } catch (err) {
      setError(err.message || "Failed to load jobs");
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
        currentJobs.map((cj) =>
          cj.id === job.id ? { ...cj, status: newStatus } : cj
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update job status");
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteCandidateJob) return;
    try {
      setActionLoading(`delete-${deleteCandidateJob.id}`);
      setError("");
      await deleteJob(deleteCandidateJob.id);
      setJobs((currentJobs) =>
        currentJobs.filter((cj) => cj.id !== deleteCandidateJob.id)
      );
      setDeleteCandidateJob(null);
    } catch (err) {
      setError(err.message || "Failed to delete job");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        (job.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.location || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilter]);

  const openCount = jobs.filter((j) => j.status === "OPEN").length;
  const closedCount = jobs.filter((j) => j.status === "CLOSED").length;

  if (loading) {
    return (
      <main className="page my-jobs-page">
        <div className="container">
          <Loading message="Loading your job listings..." />
        </div>
      </main>
    );
  }

  return (
    <main className="page my-jobs-page">
      <div className="container">
        {/* Header Banner */}
        <section className="my-jobs-header-card">
          <div className="header-text-group">
            <span className="eyebrow-pill">RECRUITER MANAGEMENT</span>
            <h1 className="header-main-title">My Job Postings</h1>
            <p className="header-main-desc">
              Manage your active listings, view candidate applicants, and update status.
            </p>
          </div>

          <div className="header-btn-wrap">
            <Link to="/create-job" className="btn btn-primary btn-create-new-job">
              <PlusCircle size={17} style={{ marginRight: 6 }} />
              Post a New Job
            </Link>
          </div>
        </section>

        {error && <ErrorMessage message={error} onRetry={loadJobs} />}

        {/* Stats Row */}
        <div className="my-jobs-stats-row">
          <div className="stat-summary-card">
            <span className="stat-summary-num">{jobs.length}</span>
            <span className="stat-summary-lbl">Total Jobs</span>
          </div>
          <div className="stat-summary-card">
            <span className="stat-summary-num num-active">{openCount}</span>
            <span className="stat-summary-lbl">Active &amp; Accepting</span>
          </div>
          <div className="stat-summary-card">
            <span className="stat-summary-num num-closed">{closedCount}</span>
            <span className="stat-summary-lbl">Closed Postings</span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="my-jobs-toolbar">
          <div className="toolbar-search-box">
            <Search size={16} className="search-box-icon" />
            <input
              type="text"
              placeholder="Search by job title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="toolbar-filter-group">
            <button
              type="button"
              className={`toolbar-filter-btn ${statusFilter === "ALL" ? "active" : ""}`}
              onClick={() => setStatusFilter("ALL")}
            >
              All ({jobs.length})
            </button>
            <button
              type="button"
              className={`toolbar-filter-btn ${statusFilter === "OPEN" ? "active" : ""}`}
              onClick={() => setStatusFilter("OPEN")}
            >
              Active ({openCount})
            </button>
            <button
              type="button"
              className={`toolbar-filter-btn ${statusFilter === "CLOSED" ? "active" : ""}`}
              onClick={() => setStatusFilter("CLOSED")}
            >
              Closed ({closedCount})
            </button>
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="my-jobs-empty">
            <div className="empty-icon-circle">
              <Briefcase size={36} />
            </div>
            <h3>No jobs found</h3>
            <p>
              {searchTerm || statusFilter !== "ALL"
                ? "No listings match your search criteria."
                : "You have not posted any jobs yet."}
            </p>
            <Link to="/create-job" className="btn btn-primary" style={{ marginTop: 12 }}>
              Create Your First Job
            </Link>
          </div>
        ) : (
          <div className="my-jobs-card-stack">
            {filteredJobs.map((job) => {
              const isOpen = job.status === "OPEN";
              const initials = (job.title || "JB").substring(0, 2).toUpperCase();
              const isStatusBusy = actionLoading === `status-${job.id}`;

              return (
                <article key={job.id} className="recruiter-job-card">
                  <div className="rec-card-main">
                    <div className="rec-card-header">
                      <div
                        className="rec-job-avatar"
                        style={{ background: getJobAvatarColor(job.title) }}
                      >
                        {initials}
                      </div>

                      <div className="rec-job-heading">
                        <div className="rec-job-title-row">
                          <h2 className="rec-job-title">
                            <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                          </h2>
                          <span
                            className={`rec-status-badge ${
                              isOpen ? "status-active" : "status-inactive"
                            }`}
                          >
                            {isOpen ? "Active" : "Closed"}
                          </span>
                        </div>

                        <div className="rec-job-meta-row">
                          <span className="rec-meta-span">
                            <MapPin size={13} />
                            {job.location}
                          </span>
                          <span className="meta-dot">•</span>
                          <span className="rec-meta-span">
                            <IndianRupee size={13} />
                            {job.salary || "Competitive"}
                          </span>
                          <span className="meta-dot">•</span>
                          <span className="rec-meta-span">{job.company}</span>
                        </div>
                      </div>
                    </div>

                    <p className="rec-job-desc-snippet">
                      {job.description
                        ? job.description.length > 160
                          ? job.description.substring(0, 160) + "..."
                          : job.description
                        : "No description provided."}
                    </p>
                  </div>

                  {/* Actions Column */}
                  <div className="rec-card-actions">
                    <Link
                      to={`/recruiter/applicants/${job.id}`}
                      className="btn btn-primary btn-action-applicants"
                    >
                      <Users size={15} style={{ marginRight: 6 }} />
                      View Applicants
                    </Link>

                    <div className="rec-secondary-actions">
                      <Link
                        to={`/edit-job/${job.id}`}
                        className="btn-icon-action"
                        title="Edit Job"
                      >
                        <Edit3 size={16} />
                      </Link>

                      <button
                        type="button"
                        className="btn-icon-action"
                        onClick={() => handleToggleStatus(job)}
                        disabled={isStatusBusy}
                        title={isOpen ? "Close Job" : "Re-open Job"}
                      >
                        {isOpen ? (
                          <ToggleRight size={20} color="#16a34a" />
                        ) : (
                          <ToggleLeft size={20} color="#94a3b8" />
                        )}
                      </button>

                      <button
                        type="button"
                        className="btn-icon-action btn-danger-action"
                        onClick={() => setDeleteCandidateJob(job)}
                        title="Delete Job"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteCandidateJob && (
          <div className="modal-backdrop" onClick={() => setDeleteCandidateJob(null)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-alert-icon">
                <AlertTriangle size={32} color="#dc2626" />
              </div>
              <h3 className="modal-title">Delete Job Listing?</h3>
              <p className="modal-text">
                Are you sure you want to permanently delete{" "}
                <strong>&quot;{deleteCandidateJob.title}&quot;</strong>? This action cannot be
                undone.
              </p>
              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setDeleteCandidateJob(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  disabled={actionLoading === `delete-${deleteCandidateJob.id}`}
                >
                  {actionLoading === `delete-${deleteCandidateJob.id}`
                    ? "Deleting..."
                    : "Yes, Delete Job"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default MyJobs;