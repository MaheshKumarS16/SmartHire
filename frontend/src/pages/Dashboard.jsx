import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getMyApplications } from "../services/applicationService";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

import "./Dashboard.css";


function Dashboard() {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");


  async function loadApplications() {
    setIsLoading(true);
    setError("");

    try {
      const response = await getMyApplications();

      setApplications(response.data || []);
    } catch (error) {
      setError(error.message || "Unable to load your applications.");
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    loadApplications();
  }, []);


  const totalApplications = applications.length;

  const appliedApplications = applications.filter(
    (application) => application.status === "APPLIED"
  ).length;

  const shortlistedApplications = applications.filter(
    (application) => application.status === "SHORTLISTED"
  ).length;

  const hiredApplications = applications.filter(
    (application) => application.status === "HIRED"
  ).length;

  const rejectedApplications = applications.filter(
    (application) => application.status === "REJECTED"
  ).length;


  function getStatusClass(status) {
    switch (status) {
      case "APPLIED":
        return "badge badge-applied";

      case "SHORTLISTED":
        return "badge badge-shortlisted";

      case "HIRED":
        return "badge badge-hired";

      case "REJECTED":
        return "badge badge-rejected";

      default:
        return "badge";
    }
  }


  function formatStatus(status) {
    if (!status) {
      return "Unknown";
    }

    return status.charAt(0) + status.slice(1).toLowerCase();
  }


  return (
    <main className="page dashboard-page">
      <div className="container">

        {/* Dashboard Header */}

        <section className="dashboard-header">

          <div>
            <p className="dashboard-eyebrow">
              Candidate Dashboard
            </p>

            <h1 className="dashboard-title">
              Welcome back, {user?.name || "Candidate"}!
            </h1>

            <p className="dashboard-subtitle">
              Track your job applications and discover your next
              career opportunity.
            </p>
          </div>

          <div className="dashboard-header-actions">
            <Link to="/jobs" className="btn btn-primary">
              Browse Jobs
            </Link>
          </div>

        </section>


        {/* Loading */}

        {isLoading && (
          <Loading message="Loading your dashboard..." />
        )}


        {/* Error */}

        {!isLoading && error && (
          <ErrorMessage
            message={error}
            onRetry={loadApplications}
          />
        )}


        {/* Dashboard Content */}

        {!isLoading && !error && (
          <>

            {/* Statistics */}

            <section className="stats-grid">

              <div className="stat-card">

                <div className="stat-icon stat-icon-primary">
                  A
                </div>

                <div>
                  <p className="stat-label">
                    Total Applications
                  </p>

                  <h2 className="stat-value">
                    {totalApplications}
                  </h2>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon stat-icon-blue">
                  ↑
                </div>

                <div>
                  <p className="stat-label">
                    Applied
                  </p>

                  <h2 className="stat-value">
                    {appliedApplications}
                  </h2>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon stat-icon-warning">
                  ★
                </div>

                <div>
                  <p className="stat-label">
                    Shortlisted
                  </p>

                  <h2 className="stat-value">
                    {shortlistedApplications}
                  </h2>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon stat-icon-success">
                  ✓
                </div>

                <div>
                  <p className="stat-label">
                    Hired
                  </p>

                  <h2 className="stat-value">
                    {hiredApplications}
                  </h2>
                </div>

              </div>

            </section>


            {/* Main Dashboard Content */}

            <section className="dashboard-content-grid">

              {/* Recent Applications */}

              <div className="dashboard-panel">

                <div className="panel-header">

                  <div>
                    <h2>Recent Applications</h2>

                    <p>
                      Keep track of your latest job applications.
                    </p>
                  </div>

                  {applications.length > 0 && (
                    <Link
                      to="/applications"
                      className="panel-link"
                    >
                      View All
                    </Link>
                  )}

                </div>


                {applications.length === 0 ? (

                  <div className="dashboard-empty-state">

                    <div className="empty-icon">
                      J
                    </div>

                    <h3>No applications yet</h3>

                    <p>
                      You haven't applied for any jobs yet.
                      Start exploring available opportunities.
                    </p>

                    <Link
                      to="/jobs"
                      className="btn btn-primary"
                    >
                      Explore Jobs
                    </Link>

                  </div>

                ) : (

                  <div className="application-list">

                    {applications.slice(0, 5).map((application) => (

                      <div
                        className="application-item"
                        key={application.id}
                      >

                        <div className="application-main">

                          <div className="application-company-icon">
                            {application.job?.companyName
                              ?.charAt(0)
                              ?.toUpperCase() || "C"}
                          </div>

                          <div className="application-info">

                            <h3>
                              {application.job?.title ||
                                "Job Application"}
                            </h3>

                            <p>
                              {application.job?.companyName ||
                                "Company"}
                            </p>

                            {application.job?.location && (
                              <span className="application-location">
                                {application.job.location}
                              </span>
                            )}

                          </div>

                        </div>


                        <div className="application-status">

                          <span
                            className={getStatusClass(
                              application.status
                            )}
                          >
                            {formatStatus(application.status)}
                          </span>

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>


              {/* Quick Actions */}

              <div className="dashboard-panel quick-actions-panel">

                <div className="panel-header">

                  <div>
                    <h2>Quick Actions</h2>

                    <p>
                      Manage your job search quickly.
                    </p>
                  </div>

                </div>


                <div className="quick-actions">

                  <Link
                    to="/jobs"
                    className="quick-action"
                  >

                    <div className="quick-action-icon">
                      J
                    </div>

                    <div>
                      <h3>Browse Jobs</h3>

                      <p>
                        Find new opportunities
                      </p>
                    </div>

                    <span className="quick-action-arrow">
                      →
                    </span>

                  </Link>


                  <Link
                    to="/applications"
                    className="quick-action"
                  >

                    <div className="quick-action-icon">
                      A
                    </div>

                    <div>
                      <h3>My Applications</h3>

                      <p>
                        Track your applications
                      </p>
                    </div>

                    <span className="quick-action-arrow">
                      →
                    </span>

                  </Link>

                </div>


                {/* Application Summary */}

                <div className="application-summary">

                  <h3>
                    Application Summary
                  </h3>

                  <div className="summary-row">
                    <span>Applied</span>
                    <strong>{appliedApplications}</strong>
                  </div>

                  <div className="summary-row">
                    <span>Shortlisted</span>
                    <strong>{shortlistedApplications}</strong>
                  </div>

                  <div className="summary-row">
                    <span>Hired</span>
                    <strong>{hiredApplications}</strong>
                  </div>

                  <div className="summary-row">
                    <span>Rejected</span>
                    <strong>{rejectedApplications}</strong>
                  </div>

                </div>

              </div>

            </section>

          </>
        )}

      </div>
    </main>
  );
}


export default Dashboard;