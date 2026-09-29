import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  FileText,
  User,
  LogOut,
  Briefcase,
  CheckCircle,
  Clock,
  Award,
  ChevronRight,
  MapPin,
  ExternalLink
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMyApplications } from "../services/applicationService";
import { getAllJobs } from "../services/jobService";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import "./Dashboard.css";

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

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      setError("");
      try {
        const [appsRes, jobsRes] = await Promise.allSettled([
          getMyApplications(),
          getAllJobs()
        ]);

        if (isMounted) {
          if (appsRes.status === "fulfilled") {
            const list = Array.isArray(appsRes.value)
              ? appsRes.value
              : Array.isArray(appsRes.value?.data)
              ? appsRes.value.data
              : [];
            setApplications(list);
          } else {
            console.error("Failed to load applications", appsRes.reason);
          }

          if (jobsRes.status === "fulfilled") {
            const jobsList = Array.isArray(jobsRes.value)
              ? jobsRes.value
              : Array.isArray(jobsRes.value?.data)
              ? jobsRes.value.data
              : [];
            setRecommendedJobs(jobsList.slice(0, 3));
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load dashboard data");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalApplications = applications.length;
  const appliedCount = applications.filter((a) => a.status === "APPLIED").length;
  const shortlistedCount = applications.filter((a) => a.status === "SHORTLISTED").length;
  const hiredCount = applications.filter((a) => a.status === "HIRED").length;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function getStatusBadge(status) {
    switch (status) {
      case "SHORTLISTED":
        return <span className="dash-status-pill status-shortlisted">Shortlisted</span>;
      case "HIRED":
        return <span className="dash-status-pill status-hired">Hired</span>;
      case "REJECTED":
        return <span className="dash-status-pill status-rejected">Rejected</span>;
      default:
        return <span className="dash-status-pill status-applied">Applied</span>;
    }
  }

  return (
    <main className="page candidate-dash-page">
      <div className="container dash-main-layout">
        {/* Left Sidebar */}
        <aside className="dash-sidebar">
          <nav className="dash-sidebar-nav">
            <Link to="/dashboard" className="dash-sidebar-link active">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/jobs" className="dash-sidebar-link">
              <Search size={18} />
              <span>Find Jobs</span>
            </Link>
            <Link to="/applications" className="dash-sidebar-link">
              <FileText size={18} />
              <span>My Applications</span>
            </Link>
            <Link to="/profile" className="dash-sidebar-link">
              <User size={18} />
              <span>Profile &amp; Resume</span>
            </Link>
          </nav>

          <div className="dash-sidebar-footer">
            <button
              type="button"
              className="dash-sidebar-logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Right Dashboard Content */}
        <section className="dash-content-area">
          {/* Header */}
          <div className="dash-header-banner">
            <div>
              <h1 className="dash-welcome-title">
                Welcome back, {user?.name || "Candidate"}! 👋
              </h1>
              <p className="dash-welcome-sub">
                Here&apos;s an overview of your job search journey and recent applications.
              </p>
            </div>
            <Link to="/jobs" className="btn btn-primary btn-dash-action">
              Find New Jobs
            </Link>
          </div>

          {error && <ErrorMessage message={error} />}

          {isLoading ? (
            <div className="dash-loading-wrap">
              <Loading />
            </div>
          ) : (
            <>
              {/* 4 Stat Metric Cards */}
              <div className="dash-metrics-grid">
                <div className="metric-box box-blue">
                  <div className="metric-icon-wrap">
                    <Briefcase size={22} />
                  </div>
                  <div className="metric-val-wrap">
                    <span className="metric-number">{totalApplications}</span>
                    <span className="metric-label">Applied Jobs</span>
                  </div>
                </div>

                <div className="metric-box box-purple">
                  <div className="metric-icon-wrap">
                    <Award size={22} />
                  </div>
                  <div className="metric-val-wrap">
                    <span className="metric-number">{shortlistedCount}</span>
                    <span className="metric-label">Shortlisted</span>
                  </div>
                </div>

                <div className="metric-box box-amber">
                  <div className="metric-icon-wrap">
                    <Clock size={22} />
                  </div>
                  <div className="metric-val-wrap">
                    <span className="metric-number">{appliedCount}</span>
                    <span className="metric-label">Under Review</span>
                  </div>
                </div>

                <div className="metric-box box-emerald">
                  <div className="metric-icon-wrap">
                    <CheckCircle size={22} />
                  </div>
                  <div className="metric-val-wrap">
                    <span className="metric-number">{hiredCount}</span>
                    <span className="metric-label">Offers Received</span>
                  </div>
                </div>
              </div>

              {/* Recent Applications Section */}
              <div className="dash-section-panel">
                <div className="panel-header-line">
                  <h2 className="panel-heading">Recent Applications</h2>
                  <Link to="/applications" className="panel-view-all">
                    <span>View All</span>
                    <ChevronRight size={15} />
                  </Link>
                </div>

                {applications.length === 0 ? (
                  <div className="dash-empty-box">
                    <p>You haven&apos;t applied to any jobs yet.</p>
                    <Link to="/jobs" className="btn btn-primary" style={{ marginTop: 12 }}>
                      Explore Openings
                    </Link>
                  </div>
                ) : (
                  <div className="dash-list-table">
                    {applications.slice(0, 5).map((app) => {
                      const companyName = app.company || "Company";
                      const initials = companyName.substring(0, 2).toUpperCase();
                      return (
                        <div key={app.id} className="dash-app-row">
                          <div className="app-row-company-info">
                            <div
                              className="dash-monogram"
                              style={{ background: getCompanyAvatarColor(companyName) }}
                            >
                              {initials}
                            </div>
                            <div>
                              <strong className="app-job-title">{app.jobTitle}</strong>
                              <span className="app-company-name">{companyName}</span>
                            </div>
                          </div>

                          <div className="app-row-location">
                            <MapPin size={13} className="pin-icon" />
                            <span>{app.location || "Remote / On-site"}</span>
                          </div>

                          <div className="app-row-status">
                            {getStatusBadge(app.status)}
                          </div>

                          <div className="app-row-action">
                            {app.jobId ? (
                              <Link
                                to={`/jobs/${app.jobId}`}
                                className="btn-dash-view"
                              >
                                View Job
                              </Link>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recommended Jobs Section */}
              {recommendedJobs.length > 0 && (
                <div className="dash-section-panel">
                  <div className="panel-header-line">
                    <h2 className="panel-heading">Recommended Opportunities</h2>
                    <Link to="/jobs" className="panel-view-all">
                      <span>View All Jobs</span>
                      <ChevronRight size={15} />
                    </Link>
                  </div>

                  <div className="recommended-jobs-row">
                    {recommendedJobs.map((job) => {
                      const initials = (job.company || "Job").substring(0, 2).toUpperCase();
                      return (
                        <div key={job.id} className="recommended-card">
                          <div className="rec-card-header">
                            <div
                              className="rec-monogram"
                              style={{ background: getCompanyAvatarColor(job.company) }}
                            >
                              {initials}
                            </div>
                            <div className="rec-titles">
                              <h3 className="rec-job-title">{job.title}</h3>
                              <span className="rec-company">{job.company}</span>
                            </div>
                          </div>

                          <div className="rec-meta">
                            <span className="rec-pill">{job.location}</span>
                            {job.salary && <span className="rec-pill salary-pill">{job.salary}</span>}
                          </div>

                          <Link to={`/jobs/${job.id}`} className="rec-view-link">
                            <span>View Details</span>
                            <ExternalLink size={13} />
                          </Link>
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

export default Dashboard;