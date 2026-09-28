import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NotFound() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  function handleGoHome() {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    if (user?.role === "RECRUITER") {
      navigate("/recruiter-dashboard");
      return;
    }

    navigate("/dashboard");
  }

  return (
    <main className="page not-found-page">
      <div className="container">
        <section className="not-found-card">
          <p className="eyebrow">Error 404</p>
          <h1>Page not found</h1>
          <p>
            The page you are looking for does not exist or has been moved.
          </p>
          <button type="button" className="btn btn-primary" onClick={handleGoHome}>
            {isAuthenticated ? "Go to dashboard" : "Back to home"}
          </button>
        </section>
      </div>
    </main>
  );
}

export default NotFound;
