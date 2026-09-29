import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  IndianRupee,
  Users,
  Bookmark,
  Share2,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Check,
  Calendar
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getJobById } from "../services/jobService";
import { applyForJob } from "../services/applicationService";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import "./JobDetails.css";

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

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedLink, setCopiedLink] = useState(false);

  // Bookmark state
  const [isSaved, setIsSaved] = useState(() => {
    try {
      const stored = localStorage.getItem("smarthire_saved_jobs");
      const list = stored ? JSON.parse(stored) : [];
      return list.includes(Number(id));
    } catch {
      return false;
    }
  });

  function toggleSave() {
    try {
      const stored = localStorage.getItem("smarthire_saved_jobs");
      const list = stored ? JSON.parse(stored) : [];
      const numId = Number(id);
      const next = list.includes(numId)
        ? list.filter((item) => item !== numId)
        : [...list, numId];
      localStorage.setItem("smarthire_saved_jobs", JSON.stringify(next));
      setIsSaved(!isSaved);
    } catch (e) {
      console.error(e);
    }
  }

  function handleShare() {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  }

  async function loadJob() {
    setIsLoading(true);
    setError("");
    try {
      const res = await getJobById(id);
      setJob(res?.data || res);
    } catch (err) {
      setError(err.message || "Unable to load job details.");
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
        response.message || "Your application was submitted successfully!"
      );
    } catch (err) {
      setError(err.message || "Unable to submit application.");
    } finally {
      setIsApplying(false);
    }
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
          <ErrorMessage message={error} onRetry={loadJob} />
          <div style={{ marginTop: 20 }}>
            <Link to="/jobs" className="btn btn-secondary">
              ← Back to Jobs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!job) return null;

  const isCandidate = isAuthenticated && user?.role === "CANDIDATE";
  const isRecruiter = isAuthenticated && user?.role === "RECRUITER";
  const isOpen = job.status === "OPEN";
  const initials = (job.company || "Job").substring(0, 2).toUpperCase();

  return (
    <main className="page job-details-page">
      <div className="container">
        {/* Breadcrumb Back Link */}
        <div className="job-nav-breadcrumb">
          <Link to="/jobs" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Jobs</span>
          </Link>
        </div>

        {/* Top Header Card */}
        <section className="job-hero-card">
          <div className="job-hero-top">
            <div className="job-hero-left">
              <div
                className="company-logo-badge"
                style={{ background: getCompanyAvatarColor(job.company) }}
              >
                {initials}
              </div>

              <div className="job-hero-titles">
                <h1 className="job-main-title">{job.title}</h1>
                <p className="job-main-company">{job.company}</p>

                {/* Metadata Pills */}
                <div className="job-hero-meta-row">
                  <span className="meta-item">
                    <MapPin size={15} className="meta-icon" />
                    {job.location}
                  </span>
                  <span className="meta-item">
                    <Briefcase size={15} className="meta-icon" />
                    Full-time
                  </span>
                  <span className="meta-item">
                    <Clock size={15} className="meta-icon" />
                    2-4 years
                  </span>
                  {job.salary && (
                    <span className="meta-item meta-salary">
                      <IndianRupee size={15} className="meta-icon" />
                      {job.salary}
                    </span>
                  )}
                  <span className="meta-item">
                    <Calendar size={15} className="meta-icon" />
                    Posted recently
                  </span>
                  <span className="meta-item meta-applicants">
                    <Users size={15} className="meta-icon" />
                    Active hiring
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Top Right */}
            <div className="job-hero-actions">
              {isOpen && isCandidate && (
                <button
                  type="button"
                  className="btn btn-primary btn-hero-apply"
                  onClick={handleApply}
                  disabled={isApplying || !!successMessage}
                >
                  {isApplying
                    ? "Applying..."
                    : successMessage
                    ? "Applied"
                    : "Apply Now"}
                </button>
              )}

              {isOpen && !isAuthenticated && (
                <Link to="/login" className="btn btn-primary btn-hero-apply">
                  Apply Now
                </Link>
              )}

              {isRecruiter && (
                <Link
                  to={`/recruiter/applicants/${job.id}`}
                  className="btn btn-primary btn-hero-apply"
                >
                  View Applicants
                </Link>
              )}

              <button
                type="button"
                className={`btn-action-round ${isSaved ? "saved" : ""}`}
                onClick={toggleSave}
                title={isSaved ? "Saved" : "Save Job"}
                aria-label="Save Job"
              >
                <Bookmark
                  size={18}
                  fill={isSaved ? "#2563eb" : "none"}
                  color={isSaved ? "#2563eb" : "#475569"}
                />
              </button>

              <button
                type="button"
                className="btn-action-round"
                onClick={handleShare}
                title={copiedLink ? "Copied!" : "Share Job"}
                aria-label="Share Job"
              >
                {copiedLink ? (
                  <Check size={18} color="#16a34a" />
                ) : (
                  <Share2 size={18} color="#475569" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="job-tabs-bar">
          <button
            type="button"
            className={`job-tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            type="button"
            className={`job-tab-btn ${
              activeTab === "responsibilities" ? "active" : ""
            }`}
            onClick={() => setActiveTab("responsibilities")}
          >
            Responsibilities
          </button>
          <button
            type="button"
            className={`job-tab-btn ${
              activeTab === "requirements" ? "active" : ""
            }`}
            onClick={() => setActiveTab("requirements")}
          >
            Requirements
          </button>
          <button
            type="button"
            className={`job-tab-btn ${activeTab === "company" ? "active" : ""}`}
            onClick={() => setActiveTab("company")}
          >
            About Company
          </button>
        </div>

        {/* Feedback Alerts */}
        {successMessage && (
          <div className="job-status-banner banner-success">
            <CheckCircle size={20} className="banner-icon-success" />
            <div>
              <strong>Application Submitted Successfully!</strong>
              <p>
                The recruiter has received your profile. You can monitor the
                progress under{" "}
                <Link to="/applications" className="link-inline">
                  My Applications
                </Link>
                .
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="job-status-banner banner-error">
            <AlertCircle size={20} className="banner-icon-error" />
            <div>
              <strong>Application Notice</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* 2-Column Main Layout */}
        <div className="job-content-columns">
          {/* Left Column: Tabbed sections */}
          <div className="job-main-article">
            {activeTab === "overview" && (
              <div className="details-section-card">
                <h2 className="section-heading">Job Description</h2>
                <div className="job-description-body">
                  <p>{job.description}</p>

                  <h3 className="sub-heading">Role Overview</h3>
                  <p>
                    As a {job.title} at {job.company}, you will work with
                    cross-functional teams to design, build, and deploy
                    high-reliability systems. This position offers a competitive
                    salary package and strong career advancement opportunities.
                  </p>

                  <h3 className="sub-heading">Key Highlights</h3>
                  <ul className="details-bullet-list">
                    <li>
                      Collaborative engineering and product-driven culture.
                    </li>
                    <li>
                      Direct mentorship and exposure to modern technical
                      tooling.
                    </li>
                    <li>
                      Competitive compensation package with performance-based
                      incentives.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "responsibilities" && (
              <div className="details-section-card">
                <h2 className="section-heading">Key Responsibilities</h2>
                <ul className="details-bullet-list">
                  <li>
                    Analyze technical and business requirements to deliver
                    robust solutions.
                  </li>
                  <li>
                    Collaborate closely with team leads, product managers, and
                    designers.
                  </li>
                  <li>
                    Write clean, maintainable, and well-tested code following
                    industry standards.
                  </li>
                  <li>
                    Troubleshoot, debug, and optimize performance across
                    application layers.
                  </li>
                  <li>
                    Participate actively in code reviews and architecture
                    discussions.
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "requirements" && (
              <div className="details-section-card">
                <h2 className="section-heading">Requirements & Qualifications</h2>
                <ul className="details-bullet-list">
                  <li>
                    Bachelor&apos;s or Master&apos;s degree in Computer Science,
                    Engineering, or related field.
                  </li>
                  <li>
                    Strong analytical, problem-solving, and communication
                    skills.
                  </li>
                  <li>
                    Hands-on experience relevant to the role domain and modern
                    frameworks.
                  </li>
                  <li>
                    Demonstrated ability to self-start and work in a
                    collaborative team environment.
                  </li>
                  <li>
                    Familiarity with Git, modern CI/CD, and agile workflows.
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "company" && (
              <div className="details-section-card">
                <h2 className="section-heading">About {job.company}</h2>
                <p className="company-desc-text">
                  {job.company} is a fast-growing, innovative organization
                  dedicated to delivering excellence and pushing technical
                  frontiers. We value craftsmanship, ownership, and inclusivity.
                </p>
                <div className="company-facts-grid">
                  <div className="fact-item">
                    <span className="fact-label">Industry</span>
                    <strong className="fact-value">
                      Technology &amp; Software
                    </strong>
                  </div>
                  <div className="fact-item">
                    <span className="fact-label">Location</span>
                    <strong className="fact-value">{job.location}</strong>
                  </div>
                  <div className="fact-item">
                    <span className="fact-label">Verification</span>
                    <strong className="fact-value verified-text">
                      <ShieldCheck size={14} /> Verified Employer
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: About Company & Job Summary Cards */}
          <aside className="job-sidebar-column">
            {/* About Company Card */}
            <div className="job-side-card">
              <div className="side-card-company-header">
                <div
                  className="side-monogram"
                  style={{ background: getCompanyAvatarColor(job.company) }}
                >
                  {initials}
                </div>
                <div>
                  <h3 className="side-company-name">{job.company}</h3>
                  <span className="side-company-sub">
                    Technology • 50-200 employees
                  </span>
                </div>
              </div>
              <p className="side-company-bio">
                {job.company} is a verified partner company on SmartHire,
                actively reviewing candidates.
              </p>
            </div>

            {/* Job Details Summary Card */}
            <div className="job-side-card">
              <h3 className="side-card-title">Job Details</h3>
              <div className="side-detail-list">
                <div className="side-detail-row">
                  <span className="side-detail-label">Job Type</span>
                  <span className="side-detail-value">Full-time</span>
                </div>
                <div className="side-detail-row">
                  <span className="side-detail-label">Experience</span>
                  <span className="side-detail-value">2 - 4 years</span>
                </div>
                <div className="side-detail-row">
                  <span className="side-detail-label">Salary</span>
                  <span className="side-detail-value">
                    {job.salary || "Competitive"}
                  </span>
                </div>
                <div className="side-detail-row">
                  <span className="side-detail-label">Location</span>
                  <span className="side-detail-value">{job.location}</span>
                </div>
                <div className="side-detail-row">
                  <span className="side-detail-label">Status</span>
                  <span
                    className={`side-detail-status ${
                      isOpen ? "status-open" : "status-closed"
                    }`}
                  >
                    {isOpen ? "Active" : "Closed"}
                  </span>
                </div>
              </div>

              {/* Sidebar Action Button */}
              {isOpen && isCandidate && (
                <button
                  type="button"
                  className="btn btn-primary w-full side-apply-btn"
                  onClick={handleApply}
                  disabled={isApplying || !!successMessage}
                >
                  {isApplying
                    ? "Applying..."
                    : successMessage
                    ? "Application Sent"
                    : "Apply For This Position"}
                </button>
              )}

              {isOpen && !isAuthenticated && (
                <Link to="/login" className="btn btn-primary w-full side-apply-btn">
                  Login to Apply
                </Link>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default JobDetails;