import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CANDIDATE",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name || !email || !form.password || !form.confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (name.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password: form.password,
          role: form.role,
        }),
      });

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-container">

        {/* Left side */}
        <section className="register-side">
          <div className="register-side-content">

            <div className="register-brand">
              <div className="register-logo">S</div>

              <div>
                <h1>SmartHire</h1>
                <p>Recruitment Management System</p>
              </div>
            </div>

            <div className="register-side-text">
              <span className="register-badge">
                SMART RECRUITMENT
              </span>

              <h2>
                Build your next
                <br />
                career move.
              </h2>

              <p>
                Join SmartHire to discover opportunities,
                connect with recruiters, and manage your
                career journey from one place.
              </p>
            </div>

            <div className="register-features">

              <div className="register-feature">
                <span>✓</span>

                <div>
                  <strong>Discover Opportunities</strong>
                  <p>
                    Find jobs that match your skills and goals.
                  </p>
                </div>
              </div>

              <div className="register-feature">
                <span>✓</span>

                <div>
                  <strong>Easy Applications</strong>
                  <p>
                    Apply for jobs and track your applications.
                  </p>
                </div>
              </div>

              <div className="register-feature">
                <span>✓</span>

                <div>
                  <strong>Recruiter Tools</strong>
                  <p>
                    Post jobs and manage candidates efficiently.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Right side */}
        <section className="register-card">

          <div className="register-header">
            <p className="register-eyebrow">
              Get started
            </p>

            <h2>Create your account</h2>

            <p>
              Register with SmartHire and start your journey.
            </p>
          </div>

          {error && (
            <div className="register-message register-error">
              <span className="message-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="register-message register-success">
              <span className="message-icon">✓</span>
              <span>{success}</span>
            </div>
          )}

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            <div className="register-form-group">
              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                disabled={loading}
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="role">
                Account Type
              </label>

              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="CANDIDATE">
                  Candidate
                </option>

                <option value="RECRUITER">
                  Recruiter
                </option>
              </select>
            </div>

            <div className="register-form-row">

              <div className="register-form-group">
                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>

              <div className="register-form-group">
                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>

            </div>

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>

          </form>

          <div className="register-login">
            <span>Already have an account?</span>

            <Link to="/login">
              Sign in
            </Link>
          </div>

          <div className="register-footer">
            <Link to="/">
              ← Back to SmartHire
            </Link>
          </div>

        </section>

      </div>
    </main>
  );
}

export default Register;