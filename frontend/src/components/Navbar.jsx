import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Briefcase, LogOut, Menu, X, PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function handleLogout() {
    closeMenu();
    logout();
    navigate("/login");
  }

  function getNavLinkClass({ isActive }) {
    return isActive ? "nav-link active" : "nav-link";
  }

  function getMobileNavLinkClass({ isActive }) {
    return isActive ? "mobile-nav-link active" : "mobile-nav-link";
  }

  function getUserInitial() {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  }

  const dashboardPath = user?.role === "RECRUITER" ? "/recruiter-dashboard" : "/dashboard";

  return (
    <header className="navbar-root">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link
          to="/"
          className="brand-link"
          onClick={closeMenu}
          aria-label="SmartHire Home"
        >
          <span className="brand-logo-icon">
            <Briefcase size={18} strokeWidth={2.5} />
          </span>
          <span className="brand-title">SmartHire</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <NavLink to="/" className={getNavLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/jobs" className={getNavLinkClass}>
            Find Jobs
          </NavLink>

          {isAuthenticated ? (
            user?.role === "CANDIDATE" ? (
              <>
                <NavLink to="/dashboard" className={getNavLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/applications" className={getNavLinkClass}>
                  My Applications
                </NavLink>
                <NavLink to="/profile" className={getNavLinkClass}>
                  Profile &amp; Resume
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/recruiter-dashboard" className={getNavLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/my-jobs" className={getNavLinkClass}>
                  My Jobs
                </NavLink>
                <NavLink to="/create-job" className={getNavLinkClass}>
                  <PlusCircle size={15} style={{ marginRight: 4, verticalAlign: "middle" }} />
                  Post a Job
                </NavLink>
                <NavLink to="/profile" className={getNavLinkClass}>
                  Profile
                </NavLink>
              </>
            )
          ) : (
            <>
              <Link to="/register?role=RECRUITER" className="nav-link">
                For Recruiters
              </Link>
            </>
          )}
        </nav>

        {/* Desktop Right Actions */}
        <div className="desktop-actions">
          {isAuthenticated && user ? (
            <div className="user-profile-menu">
              <Link to={dashboardPath} className="user-profile-chip" title="Go to Dashboard">
                <span className="user-avatar-circle">{getUserInitial()}</span>
                <div className="user-text-col">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role-badge">
                    {user.role === "RECRUITER" ? "Recruiter" : "Candidate"}
                  </span>
                </div>
              </Link>
              <button
                type="button"
                className="btn-logout-icon"
                onClick={handleLogout}
                title="Log out"
                aria-label="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="guest-action-buttons">
              <Link to="/login" className="btn btn-login-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-register-primary">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={closeMenu}>
          <div className="mobile-drawer-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="brand-link">
                <span className="brand-logo-icon">
                  <Briefcase size={18} strokeWidth={2.5} />
                </span>
                <span className="brand-title">SmartHire</span>
              </div>
              <button
                type="button"
                className="mobile-close-btn"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {isAuthenticated && user && (
              <div className="mobile-user-card">
                <span className="user-avatar-circle">{getUserInitial()}</span>
                <div className="mobile-user-details">
                  <strong className="mobile-user-name">{user.name}</strong>
                  <span className="mobile-user-role">
                    {user.role === "RECRUITER" ? "Recruiter Account" : "Candidate Account"}
                  </span>
                  <span className="mobile-user-email">{user.email}</span>
                </div>
              </div>
            )}

            <nav className="mobile-nav-list">
              <NavLink to="/" className={getMobileNavLinkClass} onClick={closeMenu} end>
                Home
              </NavLink>
              <NavLink to="/jobs" className={getMobileNavLinkClass} onClick={closeMenu}>
                Find Jobs
              </NavLink>

              {isAuthenticated ? (
                user?.role === "CANDIDATE" ? (
                  <>
                    <NavLink to="/dashboard" className={getMobileNavLinkClass} onClick={closeMenu}>
                      Dashboard
                    </NavLink>
                    <NavLink to="/applications" className={getMobileNavLinkClass} onClick={closeMenu}>
                      My Applications
                    </NavLink>
                    <NavLink to="/profile" className={getMobileNavLinkClass} onClick={closeMenu}>
                      Profile &amp; Resume
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink to="/recruiter-dashboard" className={getMobileNavLinkClass} onClick={closeMenu}>
                      Dashboard
                    </NavLink>
                    <NavLink to="/create-job" className={getMobileNavLinkClass} onClick={closeMenu}>
                      Post a Job
                    </NavLink>
                    <NavLink to="/my-jobs" className={getMobileNavLinkClass} onClick={closeMenu}>
                      My Jobs
                    </NavLink>
                    <NavLink to="/profile" className={getMobileNavLinkClass} onClick={closeMenu}>
                      Profile
                    </NavLink>
                  </>
                )
              ) : (
                <>
                  <Link to="/register?role=RECRUITER" className="mobile-nav-link" onClick={closeMenu}>
                    For Recruiters
                  </Link>
                </>
              )}
            </nav>

            <div className="mobile-drawer-footer">
              {isAuthenticated ? (
                <button
                  type="button"
                  className="btn btn-outline w-full mobile-logout-btn"
                  onClick={handleLogout}
                >
                  <LogOut size={16} style={{ marginRight: 8 }} />
                  Log Out
                </button>
              ) : (
                <div className="mobile-auth-stack">
                  <Link
                    to="/login"
                    className="btn btn-outline w-full text-center"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary w-full text-center"
                    onClick={closeMenu}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;