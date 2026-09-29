import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Briefcase,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Building2
} from "lucide-react";
import { apiRequest } from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "RECRUITER" ? "RECRUITER" : "CANDIDATE";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: initialRole,
  });

  const [showPassword, setShowPassword] = useState(false);
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

  const handleRoleSelect = (selectedRole) => {
    setForm((prev) => ({ ...prev, role: selectedRole }));
    setError("");
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

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1100);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page register-page-root">
      <div className="register-card-container">
        {/* Header */}
        <div className="register-header-col">
          <div className="register-brand-badge">
            <Briefcase size={20} strokeWidth={2.5} />
          </div>
          <h1 className="register-title">Join SmartHire</h1>
          <p className="register-sub">
            Create an account to browse jobs or manage company recruitment.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="role-selector-wrap">
          <button
            type="button"
            className={`role-select-card ${form.role === "CANDIDATE" ? "active" : ""}`}
            onClick={() => handleRoleSelect("CANDIDATE")}
          >
            <User size={18} />
            <div className="role-card-text">
              <strong>Job Seeker</strong>
              <span>Looking for jobs</span>
            </div>
          </button>

          <button
            type="button"
            className={`role-select-card ${form.role === "RECRUITER" ? "active" : ""}`}
            onClick={() => handleRoleSelect("RECRUITER")}
          >
            <Building2 size={18} />
            <div className="role-card-text">
              <strong>Recruiter</strong>
              <span>Hiring talent</span>
            </div>
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="register-alert-error" role="alert">
            <AlertCircle size={18} className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="register-alert-success" role="alert">
            <CheckCircle size={18} className="success-icon" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="register-form-body">
          {/* Full Name */}
          <div className="form-field-group">
            <label htmlFor="name" className="field-lbl">
              Full Name
            </label>
            <div className="input-icon-shell">
              <User size={16} className="input-leading-icon" />
              <input
                id="name"
                name="name"
                type="text"
                placeholder={form.role === "RECRUITER" ? "e.g. Sarah Jenkins (HR Lead)" : "e.g. Mahesh Kumar"}
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-field-group">
            <label htmlFor="email" className="field-lbl">
              Work / Personal Email
            </label>
            <div className="input-icon-shell">
              <Mail size={16} className="input-leading-icon" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Password & Confirm Password in 2-cols */}
          <div className="register-pwd-grid">
            <div className="form-field-group">
              <label htmlFor="password" className="field-lbl">
                Password
              </label>
              <div className="input-icon-shell">
                <Lock size={16} className="input-leading-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-field-group">
              <label htmlFor="confirmPassword" className="field-lbl">
                Confirm Password
              </label>
              <div className="input-icon-shell">
                <Lock size={16} className="input-leading-icon" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="pwd-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-submit-register"
            disabled={loading}
          >
            <span>
              {loading
                ? "Creating Account..."
                : `Create ${form.role === "RECRUITER" ? "Recruiter" : "Candidate"} Account`}
            </span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Footer */}
        <div className="register-card-footer">
          <span>Already registered with SmartHire?</span>
          <Link to="/login" className="auth-switch-link">
            Sign In here
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Register;