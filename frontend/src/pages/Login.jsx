import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setLoginError("");
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    return newErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoginError("");

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const loggedInUser = await login(
        formData.email.trim(),
        formData.password
      );

      if (loggedInUser.role === "RECRUITER") {
        navigate("/recruiter-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setLoginError(error.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-container">

        {/* Left Section */}
        <section className="login-intro">
          <div className="login-brand">
            <div className="brand-icon login-brand-icon">S</div>
            <span>SmartHire</span>
          </div>

          <div className="login-intro-content">
            <h1>Build your next career move.</h1>

            <p>
              Connect talented candidates with great opportunities
              through a simple and smart recruitment platform.
            </p>

            <div className="login-features">
              <div className="login-feature">
                <span className="feature-icon">✓</span>
                <span>Discover relevant job opportunities</span>
              </div>

              <div className="login-feature">
                <span className="feature-icon">✓</span>
                <span>Track your applications easily</span>
              </div>

              <div className="login-feature">
                <span className="feature-icon">✓</span>
                <span>Manage recruitment efficiently</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Section */}
        <section className="login-form-section">
          <div className="login-card">

            <div className="login-header">
              <h2>Welcome back</h2>

              <p>
                Sign in to continue to your SmartHire account.
              </p>
            </div>

            {loginError && (
              <div className="message message-error">
                {loginError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-input ${
                    errors.email ? "form-input-error" : ""
                  }`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />

                {errors.email && (
                  <span className="form-error">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`form-input ${
                    errors.password ? "form-input-error" : ""
                  }`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

                {errors.password && (
                  <span className="form-error">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary login-submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

            </form>

            <div className="login-footer">
              <p>
                SmartHire Recruitment Management System
              </p>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}

export default Login;