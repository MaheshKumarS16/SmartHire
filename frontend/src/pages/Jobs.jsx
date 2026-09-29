import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  Bookmark,
  Filter,
  X,
  ArrowUpDown
} from "lucide-react";
import { getAllJobs, searchJobs } from "../services/jobService";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import "./Jobs.css";

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

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search input state
  const initialTitle = searchParams.get("title") || "";
  const initialLocation = searchParams.get("location") || "";

  const [title, setTitle] = useState(initialTitle);
  const [location, setLocation] = useState(initialLocation);
  const [status, setStatus] = useState("OPEN");

  // Raw data & loading state
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  // Client-side filter states for rich mockup experience
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [sortBy, setSortBy] = useState("latest");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Saved jobs bookmark state
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const stored = localStorage.getItem("smarthire_saved_jobs");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  function toggleSaveJob(jobId) {
    setSavedJobIds((prev) => {
      const isSaved = prev.includes(jobId);
      const next = isSaved ? prev.filter((id) => id !== jobId) : [...prev, jobId];
      try {
        localStorage.setItem("smarthire_saved_jobs", JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save bookmark", e);
      }
      return next;
    });
  }

  // Load jobs (API)
  async function fetchAll() {
    setIsLoading(true);
    setError("");
    try {
      const res = await getAllJobs();
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.content)
        ? res.content
        : [];
      setJobs(list);
    } catch (err) {
      setError(err.message || "Unable to load jobs.");
    } finally {
      setIsLoading(false);
    }
  }

  // Execute Search (API)
  async function executeSearch(queryTitle, queryLocation) {
    setIsSearching(true);
    setError("");
    try {
      const res = await searchJobs(
        queryTitle.trim(),
        queryLocation.trim(),
        status === "ALL" ? "" : status
      );
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.content)
        ? res.content
        : [];
      setJobs(list);
    } catch (err) {
      setError(err.message || "Unable to search jobs.");
    } finally {
      setIsSearching(false);
    }
  }

  // Trigger on initial mount with searchParams
  useEffect(() => {
    if (initialTitle || initialLocation) {
      executeSearch(initialTitle, initialLocation);
    } else {
      fetchAll();
    }
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const nextParams = {};
    if (title.trim()) nextParams.title = title.trim();
    if (location.trim()) nextParams.location = location.trim();
    setSearchParams(nextParams);
    executeSearch(title, location);
  }

  function handleClearAll() {
    setTitle("");
    setLocation("");
    setStatus("OPEN");
    setSelectedTypes([]);
    setSelectedExperience([]);
    setSelectedLocations([]);
    setSortBy("latest");
    setSearchParams({});
    fetchAll();
  }

  // Filter and sort jobs in memory
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Filter by type if selected
    if (selectedTypes.length > 0) {
      result = result.filter((j) => {
        const text = `${j.title} ${j.description}`.toLowerCase();
        return selectedTypes.some((type) => {
          if (type === "Full-time") return !text.includes("intern") && !text.includes("part-time");
          if (type === "Part-time") return text.includes("part-time") || text.includes("part time");
          if (type === "Internship") return text.includes("intern");
          if (type === "Contract") return text.includes("contract") || text.includes("freelance");
          return true;
        });
      });
    }

    // Filter by location checkbox if selected
    if (selectedLocations.length > 0) {
      result = result.filter((j) => {
        const loc = (j.location || "").toLowerCase();
        return selectedLocations.some((l) => loc.includes(l.toLowerCase()));
      });
    }

    // Sorting
    if (sortBy === "salary_high") {
      result.sort((a, b) => (b.salary || "").localeCompare(a.salary || ""));
    } else if (sortBy === "title_asc") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "company_asc") {
      result.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
    } else {
      // Default: latest by id
      result.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return result;
  }, [jobs, selectedTypes, selectedLocations, sortBy]);

  function handleTypeToggle(type) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  function handleLocationToggle(loc) {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  }

  return (
    <main className="page jobs-page">
      {/* Top Search Banner */}
      <section className="jobs-search-banner">
        <div className="container">
          <form className="jobs-top-search-form" onSubmit={handleSearchSubmit}>
            <div className="search-bar-input-group">
              <Search size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Job title, keyword or company"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-label="Job title"
              />
            </div>

            <div className="search-bar-divider"></div>

            <div className="search-bar-input-group">
              <MapPin size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Location"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary search-submit-btn"
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>
        </div>
      </section>

      {/* Main Listing Layout: Left Sidebar + Right Job Cards */}
      <div className="container jobs-layout-container">
        {/* Mobile Filter Button */}
        <div className="mobile-filter-bar">
          <button
            type="button"
            className="btn btn-outline mobile-filter-toggle-btn"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <Filter size={16} />
            <span>Filters ({selectedTypes.length + selectedLocations.length})</span>
          </button>
          <div className="mobile-count-text">
            <strong>{filteredJobs.length}</strong> jobs found
          </div>
        </div>

        {/* Sidebar Filters */}
        <aside
          className={`jobs-sidebar-filters ${
            isMobileFiltersOpen ? "mobile-open" : ""
          }`}
        >
          <div className="sidebar-header">
            <div className="sidebar-title-row">
              <h3>Filters</h3>
              <button
                type="button"
                className="clear-filters-btn"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            </div>
            {isMobileFiltersOpen && (
              <button
                type="button"
                className="mobile-filter-close"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Job Type Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">Job Type</h4>
            <div className="filter-options-list">
              {["Full-time", "Part-time", "Contract", "Internship"].map((t) => (
                <label key={t} className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(t)}
                    onChange={() => handleTypeToggle(t)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">Experience Level</h4>
            <div className="filter-options-list">
              {["Fresher (0-1 yr)", "1-3 years", "3-5 years", "5+ years"].map((exp) => (
                <label key={exp} className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedExperience.includes(exp)}
                    onChange={() =>
                      setSelectedExperience((prev) =>
                        prev.includes(exp)
                          ? prev.filter((e) => e !== exp)
                          : [...prev, exp]
                      )
                    }
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">{exp}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">Popular Locations</h4>
            <div className="filter-options-list">
              {["Bangalore", "Chennai", "Hyderabad", "Remote"].map((loc) => (
                <label key={loc} className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(loc)}
                    onChange={() => handleLocationToggle(loc)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">{loc}</span>
                </label>
              ))}
            </div>
          </div>

          {isMobileFiltersOpen && (
            <button
              type="button"
              className="btn btn-primary w-full apply-mobile-filters-btn"
              onClick={() => setIsMobileFiltersOpen(false)}
            >
              Show {filteredJobs.length} Jobs
            </button>
          )}
        </aside>

        {/* Backdrop for mobile filter drawer */}
        {isMobileFiltersOpen && (
          <div
            className="mobile-filter-backdrop"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
        )}

        {/* Main Job Cards Feed */}
        <section className="jobs-feed-section">
          {/* Top Feed Bar */}
          <div className="feed-header-bar">
            <div className="feed-count">
              <strong>{filteredJobs.length}</strong> Jobs Found
            </div>

            <div className="feed-sort-wrap">
              <label htmlFor="sort-select" className="sort-label">
                <ArrowUpDown size={14} /> Sort by:
              </label>
              <select
                id="sort-select"
                className="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Latest</option>
                <option value="salary_high">Salary: High to Low</option>
                <option value="title_asc">Title: A-Z</option>
                <option value="company_asc">Company: A-Z</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && <ErrorMessage message={error} />}

          {/* Loading Indicator */}
          {isLoading ? (
            <div className="jobs-loading-wrap">
              <Loading />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="jobs-empty-state">
              <div className="empty-icon-wrap">
                <Briefcase size={36} />
              </div>
              <h3>No matching jobs found</h3>
              <p>
                Try adjusting your search criteria, clear filters, or check back
                shortly for new listings.
              </p>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleClearAll}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="jobs-cards-stack">
              {filteredJobs.map((job) => {
                const initials = (job.company || "Job")
                  .substring(0, 2)
                  .toUpperCase();
                const isSaved = savedJobIds.includes(job.id);
                const isRemote = (job.location || "")
                  .toLowerCase()
                  .includes("remote");

                return (
                  <article key={job.id} className="job-feed-card">
                    <div className="job-card-main-col">
                      <div className="job-card-header-line">
                        <div
                          className="job-card-monogram"
                          style={{
                            background: getCompanyAvatarColor(job.company)
                          }}
                        >
                          {initials}
                        </div>
                        <div className="job-card-title-group">
                          <h3 className="job-title-link">
                            <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                          </h3>
                          <div className="job-company-row">
                            <span className="job-company-name">
                              {job.company}
                            </span>
                            <span className="dot-sep">•</span>
                            <span className="job-location-text">
                              <MapPin size={13} className="pin-icon" />
                              {job.location}
                            </span>
                          </div>
                        </div>

                        {/* Save Bookmark button */}
                        <button
                          type="button"
                          className={`btn-save-bookmark ${
                            isSaved ? "saved" : ""
                          }`}
                          onClick={() => toggleSaveJob(job.id)}
                          title={isSaved ? "Remove bookmark" : "Save job"}
                          aria-label="Save job"
                        >
                          <Bookmark
                            size={18}
                            fill={isSaved ? "#2563eb" : "none"}
                            color={isSaved ? "#2563eb" : "#94a3b8"}
                          />
                        </button>
                      </div>

                      {/* Description preview snippet */}
                      <p className="job-card-snippet">
                        {job.description
                          ? job.description.length > 150
                            ? job.description.substring(0, 150) + "..."
                            : job.description
                          : "No detailed description provided."}
                      </p>

                      {/* Badges Row */}
                      <div className="job-card-pills-row">
                        <span className="job-pill pill-type">Full-time</span>
                        <span className="job-pill pill-mode">
                          {isRemote ? "Remote" : "On-site"}
                        </span>
                        {job.salary && (
                          <span className="job-pill pill-salary">
                            {job.salary}
                          </span>
                        )}
                        <span
                          className={`job-pill ${
                            job.status === "OPEN"
                              ? "pill-status-open"
                              : "pill-status-closed"
                          }`}
                        >
                          {job.status === "OPEN" ? "Active" : "Closed"}
                        </span>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="job-card-action-col">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="btn btn-primary btn-view-job-full"
                      >
                        View Job
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Jobs;