import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="page login-page-root">
      <div className="login-card-container">
        {/* Card Header */}
        <div className="login-header-col">
          <div className="login-brand-badge">
            <Briefcase size={20} strokeWidth={2.5} />
          </div>
          <h1 className="login-welcome-title">Welcome to SmartHire</h1>
          <p className="login-welcome-sub">
            Sign in to access your recruitment portal or candidate dashboard.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-alert-error" role="alert">
            <AlertCircle size={18} className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form-body">
          <div className="form-field-group">
            <label htmlFor="email" className="field-lbl">
              Email Address
            </label>
            <div className="input-icon-shell">
              <Mail size={16} className="input-leading-icon" />
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-field-group">
            <div className="field-split-label">
              <label htmlFor="password" className="field-lbl">
                Password
              </label>
            </div>
            <div className="input-icon-shell">
              <Lock size={16} className="input-leading-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="pwd-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-submit-auth"
            disabled={loading}
          >
            <span>{loading ? "Signing in..." : "Sign In to Account"}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Footer Link */}
        <div className="login-card-footer">
          <span>Don&apos;t have an account yet?</span>
          <Link to="/register" className="auth-switch-link">
            Create an account
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Login;