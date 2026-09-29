import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Users,
  User,
  LogOut,
  CheckCircle,
  ChevronRight,
  FileCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMyJobs } from "../services/recruiterJobService";
import { getApplicationsForJob } from "../services/applicationService";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import "./RecruiterDashboard.css";

const AVATAR_COLORS = [
  "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
  "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
  "linear-gradient(135deg, #10b981 0%, #047857 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)"
];

function getCompanyAvatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function RecruiterDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [shortlistedCount, setShortlistedCount] = useState(0);
  const [hiredCount, setHiredCount] = useState(0);
  const [jobApplicantCounts, setJobApplicantCounts] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setIsLoading(true);
    setError("");

    try {
      const jobsResponse = await getMyJobs();
      const recruiterJobs = Array.isArray(jobsResponse)
        ? jobsResponse
        : Array.isArray(jobsResponse?.data)
        ? jobsResponse.data
        : [];
      setJobs(recruiterJobs);

      let total = 0;
      let shortlisted = 0;
      let hired = 0;
      const countsMap = {};
      const allApps = [];

      for (const job of recruiterJobs) {
        try {
          const appRes = await getApplicationsForJob(job.id);
          const apps = Array.isArray(appRes)
            ? appRes
            : Array.isArray(appRes?.data)
            ? appRes.data
            : [];
          countsMap[job.id] = apps.length;
          total += apps.length;

          apps.forEach((a) => {
            if (a.status === "SHORTLISTED") shortlisted++;
            if (a.status === "HIRED") hired++;
            allApps.push({ ...a, jobId: job.id, jobTitle: job.title });
          });
        } catch (err) {
          console.error(`Unable to load applicants for job ${job.id}`, err);
        }
      }

      setTotalApplicants(total);
      setShortlistedCount(shortlisted);
      setHiredCount(hired);
      setJobApplicantCounts(countsMap);
      setRecentApplications(allApps.slice(0, 5));
    } catch (err) {
      setError(err.message || "Unable to load recruiter dashboard.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const openJobs = jobs.filter((j) => j.status === "OPEN").length;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <main className="page recruiter-dash-page">
      <div className="container recruiter-main-layout">
        {/* Recruiter Sidebar Navigation */}
        <aside className="recruiter-sidebar">
          <nav className="recruiter-sidebar-nav">
            <Link to="/recruiter-dashboard" className="recruiter-sidebar-link active">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/my-jobs" className="recruiter-sidebar-link">
              <Briefcase size={18} />
              <span>My Jobs</span>
            </Link>
            <Link to="/create-job" className="recruiter-sidebar-link">
              <PlusCircle size={18} />
              <span>Create Job</span>
            </Link>
            <Link to="/profile" className="recruiter-sidebar-link">
              <User size={18} />
              <span>Profile</span>
            </Link>
          </nav>

          <div className="recruiter-sidebar-footer">
            <button
              type="button"
              className="recruiter-sidebar-logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Recruiter Dashboard Main Content */}
        <section className="recruiter-content-area">
          {/* Welcome Header */}
          <div className="recruiter-header-banner">
            <div>
              <h1 className="recruiter-welcome-title">
                Welcome, {user?.name || "Recruiter"}! 👋
              </h1>
              <p className="recruiter-welcome-sub">
                Manage your job listings, track applicants, and review hiring decisions.
              </p>
            </div>
            <Link to="/create-job" className="btn btn-primary btn-post-job-action">
              <PlusCircle size={16} style={{ marginRight: 6 }} />
              Post a New Job
            </Link>
          </div>

          {error && <ErrorMessage message={error} />}

          {isLoading ? (
            <div className="recruiter-loading-wrap">
              <Loading />
            </div>
          ) : (
            <>
              {/* 4 Metrics Row */}
              <div className="recruiter-metrics-grid">
                <div className="rec-metric-card box-emerald">
                  <div className="rec-metric-icon">
                    <Briefcase size={22} />
                  </div>
                  <div className="rec-metric-text">
                    <span className="rec-metric-number">{openJobs}</span>
                    <span className="rec-metric-label">Active Jobs</span>
                  </div>
                </div>

                <div className="rec-metric-card box-blue">
                  <div className="rec-metric-icon">
                    <Users size={22} />
                  </div>
                  <div className="rec-metric-text">
                    <span className="rec-metric-number">{totalApplicants}</span>
                    <span className="rec-metric-label">Total Applications</span>
                  </div>
                </div>

                <div className="rec-metric-card box-purple">
                  <div className="rec-metric-icon">
                    <FileCheck size={22} />
                  </div>
                  <div className="rec-metric-text">
                    <span className="rec-metric-number">{shortlistedCount}</span>
                    <span className="rec-metric-label">Shortlisted</span>
                  </div>
                </div>

                <div className="rec-metric-card box-teal">
                  <div className="rec-metric-icon">
                    <CheckCircle size={22} />
                  </div>
                  <div className="rec-metric-text">
                    <span className="rec-metric-number">{hiredCount}</span>
                    <span className="rec-metric-label">Hired Candidates</span>
                  </div>
                </div>
              </div>

              {/* Recent Jobs Section */}
              <div className="recruiter-section-panel">
                <div className="rec-panel-header">
                  <h2 className="rec-panel-title">Recent Job Postings</h2>
                  <Link to="/my-jobs" className="rec-panel-link">
                    <span>View All Jobs</span>
                    <ChevronRight size={15} />
                  </Link>
                </div>

                {jobs.length === 0 ? (
                  <div className="rec-empty-state">
                    <p>You haven&apos;t posted any jobs yet.</p>
                    <Link to="/create-job" className="btn btn-primary" style={{ marginTop: 12 }}>
                      Create Your First Job
                    </Link>
                  </div>
                ) : (
                  <div className="rec-jobs-list">
                    {jobs.slice(0, 5).map((job) => {
                      const count = jobApplicantCounts[job.id] || 0;
                      const initials = (job.title || "JB").substring(0, 2).toUpperCase();
                      const isOpen = job.status === "OPEN";

                      return (
                        <div key={job.id} className="rec-job-row">
                          <div className="rec-job-info-col">
                            <div
                              className="rec-job-monogram"
                              style={{ background: getCompanyAvatarColor(job.title) }}
                            >
                              {initials}
                            </div>
                            <div>
                              <h3 className="rec-job-name">{job.title}</h3>
                              <span className="rec-job-meta">
                                {job.location} • {job.salary || "Competitive"}
                              </span>
                            </div>
                          </div>

                          <div className="rec-job-applicants-badge">
                            <span className="app-count-number">{count}</span>
                            <span className="app-count-label">Applications</span>
                          </div>

                          <div className="rec-job-status-col">
                            <span
                              className={`rec-status-badge ${
                                isOpen ? "status-active" : "status-inactive"
                              }`}
                            >
                              {isOpen ? "Active" : "Closed"}
                            </span>
                          </div>

                          <div className="rec-job-action-col">
                            <Link
                              to={`/recruiter/applicants/${job.id}`}
                              className="btn btn-outline btn-view-applicants-btn"
                            >
                              <Users size={14} style={{ marginRight: 6 }} />
                              View Applicants
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Applicants Section */}
              {recentApplications.length > 0 && (
                <div className="recruiter-section-panel">
                  <div className="rec-panel-header">
                    <h2 className="rec-panel-title">Recent Candidate Applications</h2>
                  </div>

                  <div className="rec-applicants-list">
                    {recentApplications.map((app) => {
                      const candName = app.candidateName || app.candidateEmail || "Candidate";
                      const initials = candName.substring(0, 2).toUpperCase();
                      return (
                        <div key={app.id} className="rec-applicant-row">
                          <div className="applicant-user-info">
                            <div className="applicant-avatar">{initials}</div>
                            <div>
                              <strong className="applicant-name">{candName}</strong>
                              <span className="applicant-sub">
                                Applied for <strong>{app.jobTitle}</strong>
                              </span>
                            </div>
                          </div>

                          <div className="applicant-status-pill">
                            <span
                              className={`dash-status-pill status-${(
                                app.status || "applied"
                              ).toLowerCase()}`}
                            >
                              {app.status}
                            </span>
                          </div>

                          <div className="applicant-action-btn">
                            <Link
                              to={`/recruiter/applicants/${app.jobId}`}
                              className="btn-dash-view"
                            >
                              Review
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default RecruiterDashboard;