import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  IndianRupee,
  RefreshCw,
  ChevronRight
} from "lucide-react";
import { getMyApplications } from "../services/applicationService";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import "./MyApplications.css";

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

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState("ALL");

  async function loadApplications() {
    setIsLoading(true);
    setError("");
    try {
      const response = await getMyApplications();
      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];
      setApplications(list);
    } catch (err) {
      setError(err.message || "Unable to load your applications.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

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
    if (selectedTab === "ALL") return applications;
    return applications.filter((a) => a.status === selectedTab);
  }, [applications, selectedTab]);

  function getStatusStageIndex(status) {
    if (status === "HIRED") return 3;
    if (status === "SHORTLISTED") return 2;
    if (status === "REJECTED") return -1;
    return 1; // APPLIED / Under Review
  }

  return (
    <main className="page applications-page">
      <div className="container">
        {/* Header Banner */}
        <section className="applications-header-card">
          <div className="header-info-group">
            <span className="app-badge-pill">CANDIDATE TRACKER</span>
            <h1 className="app-main-title">My Applications</h1>
            <p className="app-main-desc">
              Track your submitted job applications, interview status, and recruiter decisions in real time.
            </p>
          </div>

          <div className="header-action-group">
            <button
              type="button"
              className="btn btn-outline btn-refresh-apps"
              onClick={loadApplications}
              disabled={isLoading}
            >
              <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
              <span>Refresh Status</span>
            </button>
            <Link to="/jobs" className="btn btn-primary">
              Find More Jobs
            </Link>
          </div>
        </section>

        {error && <ErrorMessage message={error} onRetry={loadApplications} />}

        {/* Status Filter Tabs */}
        <div className="apps-filter-tabs">
          {[
            { id: "ALL", label: "All Applications", count: counts.ALL },
            { id: "APPLIED", label: "In Review", count: counts.APPLIED },
            { id: "SHORTLISTED", label: "Shortlisted", count: counts.SHORTLISTED },
            { id: "HIRED", label: "Hired / Offers", count: counts.HIRED },
            { id: "REJECTED", label: "Archived", count: counts.REJECTED },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`apps-tab-btn ${selectedTab === tab.id ? "active" : ""}`}
              onClick={() => setSelectedTab(tab.id)}
            >
              <span>{tab.label}</span>
              <span className="tab-bubble">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="apps-loading-box">
            <Loading message="Fetching your applications..." />
          </div>
        ) : displayedApplications.length === 0 ? (
          <div className="apps-empty-box">
            <div className="empty-briefcase-icon">
              <Briefcase size={36} />
            </div>
            <h3>No applications in this category</h3>
            <p>
              {selectedTab === "ALL"
                ? "You have not submitted any applications yet. Discover open roles and apply today!"
                : `You currently have 0 applications marked as ${selectedTab.toLowerCase()}.`}
            </p>
            <Link to="/jobs" className="btn btn-primary" style={{ marginTop: 12 }}>
              Explore Jobs
            </Link>
          </div>
        ) : (
          <div className="applications-stack">
            {displayedApplications.map((app) => {
              const companyName = app.company || "Company";
              const initials = companyName.substring(0, 2).toUpperCase();
              const stageIdx = getStatusStageIndex(app.status);
              const isRejected = app.status === "REJECTED";

              return (
                <article key={app.id} className="application-tracking-card">
                  <div className="app-card-top">
                    <div className="app-company-info">
                      <div
                        className="app-company-monogram"
                        style={{ background: getCompanyAvatarColor(companyName) }}
                      >
                        {initials}
                      </div>

                      <div>
                        <h2 className="app-job-title">
                          {app.jobId ? (
                            <Link to={`/jobs/${app.jobId}`}>{app.jobTitle}</Link>
                          ) : (
                            app.jobTitle
                          )}
                        </h2>
                        <div className="app-meta-line">
                          <span className="app-company-text">{companyName}</span>
                          <span className="meta-dot">•</span>
                          <span className="app-location-text">
                            <MapPin size={13} />
                            {app.location || "Remote / On-site"}
                          </span>
                          {app.salary && (
                            <>
                              <span className="meta-dot">•</span>
                              <span className="app-salary-text">
                                <IndianRupee size={13} />
                                {app.salary}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="app-status-badge-wrap">
                      <span
                        className={`dash-status-pill status-${(
                          app.status || "applied"
                        ).toLowerCase()}`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>

                  {/* Visual Status Pipeline Progress */}
                  <div className="application-stepper-wrap">
                    <div className="stepper-track">
                      <div
                        className={`stepper-step ${stageIdx >= 1 ? "step-completed" : ""} ${
                          isRejected ? "step-rejected" : ""
                        }`}
                      >
                        <span className="step-circle">1</span>
                        <span className="step-name">Submitted</span>
                      </div>

                      <div className="stepper-line"></div>

                      <div
                        className={`stepper-step ${stageIdx >= 1 ? "step-active" : ""}`}
                      >
                        <span className="step-circle">2</span>
                        <span className="step-name">In Review</span>
                      </div>

                      <div className="stepper-line"></div>

                      <div
                        className={`stepper-step ${stageIdx >= 2 ? "step-completed" : ""}`}
                      >
                        <span className="step-circle">3</span>
                        <span className="step-name">Shortlisted</span>
                      </div>

                      <div className="stepper-line"></div>

                      <div
                        className={`stepper-step ${
                          stageIdx === 3
                            ? "step-hired"
                            : isRejected
                            ? "step-rejected"
                            : ""
                        }`}
                      >
                        <span className="step-circle">
                          {stageIdx === 3 ? "✓" : isRejected ? "✕" : "4"}
                        </span>
                        <span className="step-name">
                          {isRejected ? "Not Selected" : "Hired"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="app-card-footer">
                    <span className="app-status-msg">
                      {app.status === "HIRED" && (
                        <span className="msg-hired">🎉 Congratulations! You have received an offer.</span>
                      )}
                      {app.status === "SHORTLISTED" && (
                        <span className="msg-shortlisted">✨ Great news! The hiring manager has shortlisted your profile.</span>
                      )}
                      {app.status === "APPLIED" && (
                        <span className="msg-applied">Application received and pending recruiter review.</span>
                      )}
                      {app.status === "REJECTED" && (
                        <span className="msg-rejected">Application was not moved forward for this cycle.</span>
                      )}
                    </span>

                    {app.jobId && (
                      <Link to={`/jobs/${app.jobId}`} className="btn-view-job-link">
                        <span>View Job Details</span>
                        <ChevronRight size={14} />
                      </Link>
                    )}
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

export default MyApplications;