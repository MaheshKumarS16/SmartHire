import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAllJobs,
  searchJobs
} from "../services/jobService";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

import "./Jobs.css";


function Jobs() {
  const [jobs, setJobs] = useState([]);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("OPEN");

  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [error, setError] = useState("");


  async function loadJobs() {
    setIsLoading(true);
    setError("");

    try {
      const response = await getAllJobs();

      setJobs(response.data || []);
    } catch (error) {
      setError(
        error.message ||
        "Unable to load jobs."
      );
    } finally {
      setIsLoading(false);
    }
  }


  async function handleSearch(event) {
    event.preventDefault();

    setIsSearching(true);
    setError("");

    try {
      const response = await searchJobs(
        title.trim(),
        location.trim(),
        status
      );

      setJobs(response.data || []);
    } catch (error) {
      setError(
        error.message ||
        "Unable to search jobs."
      );
    } finally {
      setIsSearching(false);
    }
  }


  function handleClearSearch() {
    setTitle("");
    setLocation("");
    setStatus("OPEN");

    loadJobs();
  }


  useEffect(() => {
    loadJobs();
  }, []);


  function getStatusClass(jobStatus) {
    if (jobStatus === "OPEN") {
      return "job-status-badge job-status-open";
    }

    if (jobStatus === "CLOSED") {
      return "job-status-badge job-status-closed";
    }

    return "job-status-badge";
  }


  function formatStatus(jobStatus) {
    if (!jobStatus) {
      return "Unknown";
    }

    return (
      jobStatus.charAt(0) +
      jobStatus.slice(1).toLowerCase()
    );
  }


  function formatSalary(salary) {
    if (!salary) {
      return "Salary not specified";
    }

    return salary;
  }


  return (
    <main className="page jobs-page">

      <div className="container">

        {/* Page Header */}

        <section className="jobs-header">

          <div>

            <p className="jobs-eyebrow">
              Career Opportunities
            </p>

            <h1 className="jobs-title">
              Find your next opportunity
            </h1>

            <p className="jobs-subtitle">
              Explore job opportunities and find a role
              that matches your skills and career goals.
            </p>

          </div>

        </section>


        {/* Search Section */}

        <section className="jobs-search-card">

          <form
            className="jobs-search-form"
            onSubmit={handleSearch}
          >

            <div className="search-field">

              <label htmlFor="job-title">
                Job Title
              </label>

              <input
                id="job-title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. Data Analyst"
              />

            </div>


            <div className="search-field">

              <label htmlFor="job-location">
                Location
              </label>

              <input
                id="job-location"
                type="text"
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                placeholder="e.g. Bangalore"
              />

            </div>


            <div className="search-field">

              <label htmlFor="job-status">
                Status
              </label>

              <select
                id="job-status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
              >

                <option value="">
                  All Jobs
                </option>

                <option value="OPEN">
                  Open
                </option>

                <option value="CLOSED">
                  Closed
                </option>

              </select>

            </div>


            <div className="search-actions">

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSearching}
              >
                {isSearching
                  ? "Searching..."
                  : "Search Jobs"}
              </button>


              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClearSearch}
                disabled={isSearching}
              >
                Clear
              </button>

            </div>

          </form>

        </section>


        {/* Results Header */}

        {!isLoading && !error && (
          <div className="jobs-results-header">

            <div>

              <h2>
                Available Jobs
              </h2>

              <p>
                {jobs.length}{" "}
                {jobs.length === 1
                  ? "job"
                  : "jobs"}{" "}
                found
              </p>

            </div>

          </div>
        )}


        {/* Loading */}

        {isLoading && (
          <Loading message="Loading jobs..." />
        )}


        {/* Error */}

        {!isLoading && error && (
          <ErrorMessage
            message={error}
            onRetry={loadJobs}
          />
        )}


        {/* Jobs */}

        {!isLoading && !error && (

          jobs.length === 0 ? (

            <div className="jobs-empty-state">

              <div className="jobs-empty-icon">
                J
              </div>

              <h2>
                No jobs found
              </h2>

              <p>
                We couldn't find any jobs matching
                your search criteria.
              </p>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClearSearch}
              >
                Clear Search
              </button>

            </div>

          ) : (

            <section className="jobs-grid">

              {jobs.map((job) => (

                <article
                  className="job-card"
                  key={job.id}
                >

                  {/* Card Top */}

                  <div className="job-card-top">

                    <div className="job-company-icon">
                      {job.company
                        ?.charAt(0)
                        ?.toUpperCase() || "C"}
                    </div>


                    <span
                      className={getStatusClass(
                        job.status
                      )}
                    >
                      {formatStatus(job.status)}
                    </span>

                  </div>


                  {/* Job Information */}

                  <div className="job-card-content">

                    <h2 className="job-card-title">
                      {job.title ||
                        "Untitled Position"}
                    </h2>

                    <p className="job-company">
                      {job.company ||
                        "Company"}
                    </p>


                    <div className="job-meta">

                      {job.location && (
                        <span className="job-meta-item">

                          <span className="job-meta-icon">
                            ●
                          </span>

                          {job.location}

                        </span>
                      )}


                      <span className="job-meta-item">

                        <span className="job-meta-icon">
                          ₹
                        </span>

                        {formatSalary(job.salary)}

                      </span>

                    </div>


                    {job.description && (
                      <p className="job-description">
                        {job.description}
                      </p>
                    )}

                  </div>


                  {/* Card Footer */}

                  <div className="job-card-footer">

                    <Link
                      to={`/jobs/${job.id}`}
                      className="job-view-link"
                    >
                      View Details

                      <span>
                        →
                      </span>

                    </Link>

                  </div>

                </article>

              ))}

            </section>

          )

        )}

      </div>

    </main>
  );
}


export default Jobs;