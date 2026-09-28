import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const user = await login(email.trim(), password);

      if (user?.role === "RECRUITER") {
        navigate("/recruiter-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">

        <section className="login-card">

          <div className="login-brand">
            <div className="login-logo">S</div>

            <div>
              <h1>SmartHire</h1>
              <p>Recruitment Management System</p>
            </div>
          </div>

          <div className="login-header">
            <p className="login-eyebrow">Welcome back</p>

            <h2>Sign in to your account</h2>

            <p>
              Access your dashboard and continue your hiring journey.
            </p>
          </div>

          {error && (
            <div className="login-error" role="alert">
              <span className="error-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">

            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <div className="password-label-row">
                <label htmlFor="password">
                  Password
                </label>
              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="login-divider">
            <span>New to SmartHire?</span>
          </div>

          <div className="register-prompt">
            <p>
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="register-link"
            >
              Create an account
            </Link>
          </div>

          <div className="login-footer">
            <Link to="/">
              ← Back to SmartHire
            </Link>
          </div>

        </section>

        <section className="login-side">

          <div className="side-content">

            <span className="side-badge">
              SMART RECRUITMENT
            </span>

            <h2>
              Find opportunities.
              <br />
              Build careers.
            </h2>

            <p>
              SmartHire connects talented candidates with
              the right opportunities while helping recruiters
              manage the hiring process efficiently.
            </p>

            <div className="side-features">

              <div className="side-feature">
                <span>✓</span>
                <div>
                  <strong>For Candidates</strong>
                  <p>Discover and apply for opportunities.</p>
                </div>
              </div>

              <div className="side-feature">
                <span>✓</span>
                <div>
                  <strong>For Recruiters</strong>
                  <p>Manage jobs and applicants in one place.</p>
                </div>
              </div>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}

export default Login;