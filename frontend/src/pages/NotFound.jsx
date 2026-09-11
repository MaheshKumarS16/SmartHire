import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NotFound() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const handleGoHome = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "RECRUITER") {
      navigate("/recruiter-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div>
      <h1>404</h1>

      <h2>Page Not Found</h2>

      <p>
        The page you are looking for
        does not exist.
      </p>

      <button onClick={handleGoHome}>
        Go to Dashboard
      </button>
    </div>
  );
}

export default NotFound;