import { useNavigate, Link } from "react-router-dom";
import { Compass, ArrowLeft, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function NotFound() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const dashboardPath = user?.role === "RECRUITER" ? "/recruiter-dashboard" : "/dashboard";

  return (
    <main className="page not-found-page" style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 20px",
      minHeight: "calc(100vh - 140px)"
    }}>
      <div className="container" style={{ maxWidth: 540, textAlign: "center" }}>
        <div style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          padding: "48px 36px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)"
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "#eff6ff",
            color: "#2563eb",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20
          }}>
            <Compass size={32} />
          </div>

          <span style={{
            display: "inline-block",
            padding: "4px 10px",
            background: "#f1f5f9",
            color: "#64748b",
            borderRadius: 999,
            fontSize: "0.74rem",
            fontWeight: 700,
            textTransform: "uppercase",
            marginBottom: 12
          }}>
            Error 404
          </span>

          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "1.8rem",
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: 10
          }}>
            Page Not Found
          </h1>

          <p style={{
            color: "#64748b",
            fontSize: "0.9rem",
            lineHeight: 1.6,
            marginBottom: 28
          }}>
            The page you are looking for doesn&apos;t exist or may have been moved. Let&apos;s get you back on track.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link to="/" className="btn btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Home size={16} />
              <span>Back to Home</span>
            </Link>

            {isAuthenticated ? (
              <Link to={dashboardPath} className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <Link to="/jobs" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span>Browse Jobs</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
