import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

function Home() {
  const { isAuthenticated, user } = useAuth();

  const dashboardPath =
    user?.role === "RECRUITER" ? "/recruiter-dashboard" : "/dashboard";

  return (
    <main className="page home-page">
      <section className="home-hero">
        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <p className="eyebrow">SmartHire Job Portal</p>
            <h1>Connect talent with the right opportunity.</h1>
            <p className="home-hero-text">
              SmartHire is a recruitment platform for candidates and recruiters.
              Browse openings, apply in a few steps, and manage hiring from one
              professional dashboard.
            </p>

            <div className="home-hero-actions">
              <Link to="/jobs" className="btn btn-primary">
                Browse jobs
              </Link>

              {isAuthenticated ? (
                <Link to={dashboardPath} className="btn btn-outline">
                  Go to dashboard
                </Link>
              ) : (
                <Link to="/register" className="btn btn-outline">
                  Create an account
                </Link>
              )}
            </div>
          </div>

          <div className="home-hero-panel">
            <article className="home-stat-card">
              <h2>For candidates</h2>
              <p>Search jobs, apply online, and track application status.</p>
            </article>
            <article className="home-stat-card">
              <h2>For recruiters</h2>
              <p>Post jobs, review applicants, and update hiring decisions.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="container">
          <div className="home-section-header">
            <p className="eyebrow">How it works</p>
            <h2>A simple hiring workflow</h2>
          </div>

          <div className="home-feature-grid">
            <article className="home-feature-card">
              <span>01</span>
              <h3>Create your account</h3>
              <p>
                Register as a candidate or recruiter and sign in with a secure
                JWT session.
              </p>
            </article>

            <article className="home-feature-card">
              <span>02</span>
              <h3>Discover or post jobs</h3>
              <p>
                Candidates browse and filter openings. Recruiters create and
                manage job listings.
              </p>
            </article>

            <article className="home-feature-card">
              <span>03</span>
              <h3>Apply and hire</h3>
              <p>
                Submit applications, review candidates, and update statuses such
                as shortlisted, hired, or rejected.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
