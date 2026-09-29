import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  Users,
  CheckCircle,
  TrendingUp,
  Zap,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAllJobs } from "../services/jobService";
import "./Home.css";

// Helper for consistent avatar color
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

function Home() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [latestJobs, setLatestJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const popularSearches = [
    "Software Engineer",
    "Data Analyst",
    "Web Developer",
    "Business Analyst",
    "Java Developer"
  ];

  useEffect(() => {
    let isMounted = true;
    async function fetchJobs() {
      try {
        const data = await getAllJobs();
        if (isMounted) {
          const list = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.content)
            ? data.content
            : [];
          setLatestJobs(list.slice(0, 4));
        }
      } catch (err) {
        console.error("Error loading latest jobs:", err);
      } finally {
        if (isMounted) setLoadingJobs(false);
      }
    }
    fetchJobs();
    return () => {
      isMounted = false;
    };
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle.trim()) params.append("title", searchTitle.trim());
    if (searchLocation.trim()) params.append("location", searchLocation.trim());
    navigate(`/jobs?${params.toString()}`);
  }

  function handleTagClick(tag) {
    navigate(`/jobs?title=${encodeURIComponent(tag)}`);
  }

  return (
    <main className="page home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-bg-glow"></div>
        <div className="container home-hero-content">
          <div className="home-hero-main">
            {/* Pill Badge */}
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              <span className="hero-badge-text">500+ Active Jobs Posted</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-title">
              Find Your Next <br />
              <span className="text-gradient">Opportunity</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle">
              Discover jobs that match your skills, experience, and career goals.
              Connect directly with verified recruiters and apply with one click.
            </p>

            {/* Interactive Search Bar Form */}
            <form className="hero-search-box" onSubmit={handleSearchSubmit}>
              <div className="search-field">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Job title, keyword, or company"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  aria-label="Job title or keyword"
                />
              </div>

              <div className="search-divider"></div>

              <div className="search-field">
                <MapPin size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Location (e.g. Bangalore, Remote)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  aria-label="Location"
                />
              </div>

              <button type="submit" className="hero-search-submit-btn">
                <span>Search Jobs</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Popular Searches */}
            <div className="hero-popular-tags">
              <span className="popular-label">Popular:</span>
              <div className="popular-tag-list">
                {popularSearches.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="popular-tag-btn"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="home-stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrap icon-blue">
                <Briefcase size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-number">500+</span>
                <span className="stat-label">Active Jobs</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap icon-indigo">
                <Building2 size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-number">300+</span>
                <span className="stat-label">Hiring Companies</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap icon-emerald">
                <Users size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-number">1K+</span>
                <span className="stat-label">Candidates Placed</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap icon-purple">
                <Zap size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-number">100+</span>
                <span className="stat-label">Verified Recruiters</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="home-latest-jobs-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Latest Jobs</h2>
              <p className="section-subtitle">
                Explore the newest opportunities from top companies
              </p>
            </div>
            <Link to="/jobs" className="view-all-link">
              <span>View All Jobs</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {loadingJobs ? (
            <div className="latest-jobs-grid">
              {[1, 2, 3].map((n) => (
                <div key={n} className="job-card-skeleton">
                  <div className="skeleton-avatar"></div>
                  <div className="skeleton-line-title"></div>
                  <div className="skeleton-line-sub"></div>
                  <div className="skeleton-line-tags"></div>
                </div>
              ))}
            </div>
          ) : latestJobs.length > 0 ? (
            <div className="latest-jobs-grid">
              {latestJobs.map((job) => {
                const initials = (job.company || "Job")
                  .substring(0, 2)
                  .toUpperCase();
                return (
                  <article key={job.id} className="home-job-card">
                    <div className="card-top-row">
                      <div
                        className="company-monogram"
                        style={{ background: getCompanyAvatarColor(job.company) }}
                      >
                        {initials}
                      </div>
                      <div className="company-text-group">
                        <h3 className="job-card-title">
                          <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                        </h3>
                        <p className="job-card-company">{job.company}</p>
                      </div>
                    </div>

                    <div className="job-card-location">
                      <MapPin size={14} className="pin-icon" />
                      <span>{job.location}</span>
                    </div>

                    <div className="job-card-tags">
                      <span className="tag-badge badge-type">Full-time</span>
                      <span className="tag-badge badge-mode">
                        {job.location?.toLowerCase().includes("remote")
                          ? "Remote"
                          : "On-site"}
                      </span>
                      {job.salary && (
                        <span className="tag-badge badge-salary">{job.salary}</span>
                      )}
                    </div>

                    <div className="card-action-footer">
                      <Link to={`/jobs/${job.id}`} className="btn-view-job">
                        View Job
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-jobs-preview">
              <p>No jobs currently posted. Be the first to post!</p>
              <Link to="/jobs" className="btn btn-primary">
                Browse All Jobs
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose SmartHire */}
      <section className="home-why-section">
        <div className="container">
          <div className="section-centered-header">
            <h2 className="section-title">Why Choose SmartHire?</h2>
            <p className="section-subtitle">
              Engineered for seamless candidate discovery and high-velocity hiring.
            </p>
          </div>

          <div className="features-quad-grid">
            <div className="feature-quad-card">
              <div className="feature-quad-icon icon-verified">
                <ShieldCheck size={24} />
              </div>
              <h3>Verified Jobs</h3>
              <p>Only genuine, manually reviewed job postings from authenticated companies.</p>
            </div>

            <div className="feature-quad-card">
              <div className="feature-quad-icon icon-direct">
                <Zap size={24} />
              </div>
              <h3>Direct Connect</h3>
              <p>Skip middlemen and connect straight with hiring managers and lead recruiters.</p>
            </div>

            <div className="feature-quad-card">
              <div className="feature-quad-icon icon-growth">
                <TrendingUp size={24} />
              </div>
              <h3>Career Growth</h3>
              <p>Transparent salary data, required skills, and clear progression paths.</p>
            </div>

            <div className="feature-quad-card">
              <div className="feature-quad-icon icon-free">
                <CheckCircle size={24} />
              </div>
              <h3>Easy & Free</h3>
              <p>100% free for job seekers. Apply in seconds with zero hidden charges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Split CTA Banners for Job Seekers & Recruiters */}
      <section className="home-cta-split-section">
        <div className="container cta-split-grid">
          {/* Seeker CTA */}
          <div className="cta-card cta-seeker-card">
            <div className="cta-copy">
              <span className="cta-tag">For Job Seekers</span>
              <h3 className="cta-title">Find the right job and grow your career</h3>
              <p className="cta-desc">
                Browse hundreds of curated tech and business positions. Track all your applications live.
              </p>
              <Link to="/jobs" className="cta-action-btn btn-seeker">
                <span>Explore Opportunities</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Recruiter CTA */}
          <div className="cta-card cta-recruiter-card">
            <div className="cta-copy">
              <span className="cta-tag">For Recruiters</span>
              <h3 className="cta-title">Hire top talent for your high-impact team</h3>
              <p className="cta-desc">
                Post jobs in minutes, manage candidate pipelines, and review applications smoothly.
              </p>
              <Link
                to={isAuthenticated ? (user?.role === "RECRUITER" ? "/create-job" : "/recruiter-dashboard") : "/register?role=RECRUITER"}
                className="cta-action-btn btn-recruiter"
              >
                <span>Start Hiring</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
