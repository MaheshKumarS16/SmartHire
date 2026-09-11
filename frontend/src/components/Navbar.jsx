import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

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
    return isActive
      ? "navbar-link navbar-link-active"
      : "navbar-link";
  }


  function getMobileNavLinkClass({ isActive }) {
    return isActive
      ? "navbar-mobile-link navbar-mobile-link-active"
      : "navbar-mobile-link";
  }


  function getUserInitial() {
    if (!user?.name) {
      return "U";
    }

    return user.name.charAt(0).toUpperCase();
  }


  function getRoleLabel() {
    if (!user?.role) {
      return "";
    }

    return user.role === "RECRUITER"
      ? "Recruiter"
      : "Candidate";
  }


  function getDashboardPath() {
    return user?.role === "RECRUITER"
      ? "/recruiter-dashboard"
      : "/dashboard";
  }


  return (
    <header className="navbar">

      <div className="navbar-container">

        {/* =====================================================
            Brand
        ===================================================== */}

        <NavLink
          to={isAuthenticated ? getDashboardPath() : "/jobs"}
          className="navbar-brand"
          onClick={closeMenu}
        >
          <span className="navbar-brand-icon">
            S
          </span>

          <span className="navbar-brand-name">
            SmartHire
          </span>
        </NavLink>


        {/* =====================================================
            Desktop Navigation
        ===================================================== */}

        {isAuthenticated && (
          <nav className="navbar-links">

            {user?.role === "CANDIDATE" && (
              <>
                <NavLink
                  to="/dashboard"
                  className={getNavLinkClass}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/jobs"
                  className={getNavLinkClass}
                >
                  Jobs
                </NavLink>

                <NavLink
                  to="/applications"
                  className={getNavLinkClass}
                >
                  My Applications
                </NavLink>
              </>
            )}


            {user?.role === "RECRUITER" && (
              <>
                <NavLink
                  to="/recruiter-dashboard"
                  className={getNavLinkClass}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/create-job"
                  className={getNavLinkClass}
                >
                  Create Job
                </NavLink>

                <NavLink
                  to="/my-jobs"
                  className={getNavLinkClass}
                >
                  My Jobs
                </NavLink>
              </>
            )}

          </nav>
        )}


        {/* =====================================================
            Desktop User
        ===================================================== */}

        {isAuthenticated && user && (
          <div className="navbar-user">

            <div className="navbar-user-avatar">
              {getUserInitial()}
            </div>

            <div className="navbar-user-info">
              <strong>
                {user.name}
              </strong>

              <span>
                {getRoleLabel()}
              </span>
            </div>

            <button
              type="button"
              className="navbar-logout"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        )}


        {/* =====================================================
            Guest Login
        ===================================================== */}

        {!isAuthenticated && (
          <div className="navbar-guest-actions">

            <NavLink
              to="/login"
              className="navbar-login-link"
            >
              Login
            </NavLink>

          </div>
        )}


        {/* =====================================================
            MOBILE MENU BUTTON
        ===================================================== */}

        <button
          type="button"
          className="navbar-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={
            isMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation-menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>


      {/* =======================================================
          MOBILE MENU
      ======================================================= */}

      {isMenuOpen && (
        <div
          id="mobile-navigation-menu"
          className="navbar-mobile-menu"
        >

          <nav className="navbar-mobile-links">

            {/* Candidate */}

            {isAuthenticated &&
              user?.role === "CANDIDATE" && (
                <>
                  <NavLink
                    to="/dashboard"
                    className={getMobileNavLinkClass}
                    onClick={closeMenu}
                  >
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/jobs"
                    className={getMobileNavLinkClass}
                    onClick={closeMenu}
                  >
                    Jobs
                  </NavLink>

                  <NavLink
                    to="/applications"
                    className={getMobileNavLinkClass}
                    onClick={closeMenu}
                  >
                    My Applications
                  </NavLink>
                </>
              )}


            {/* Recruiter */}

            {isAuthenticated &&
              user?.role === "RECRUITER" && (
                <>
                  <NavLink
                    to="/recruiter-dashboard"
                    className={getMobileNavLinkClass}
                    onClick={closeMenu}
                  >
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/create-job"
                    className={getMobileNavLinkClass}
                    onClick={closeMenu}
                  >
                    Create Job
                  </NavLink>

                  <NavLink
                    to="/my-jobs"
                    className={getMobileNavLinkClass}
                    onClick={closeMenu}
                  >
                    My Jobs
                  </NavLink>
                </>
              )}


            {/* Guest */}

            {!isAuthenticated && (
              <>
                <NavLink
                  to="/jobs"
                  className={getMobileNavLinkClass}
                  onClick={closeMenu}
                >
                  Jobs
                </NavLink>

                <NavLink
                  to="/login"
                  className={getMobileNavLinkClass}
                  onClick={closeMenu}
                >
                  Login
                </NavLink>
              </>
            )}

          </nav>


          {/* Mobile User */}

          {isAuthenticated && user && (
            <div className="navbar-mobile-user">

              <div className="navbar-mobile-user-info">

                <div className="navbar-user-avatar">
                  {getUserInitial()}
                </div>

                <div>
                  <strong>
                    {user.name}
                  </strong>

                  <span>
                    {getRoleLabel()}
                  </span>
                </div>

              </div>


              <button
                type="button"
                className="navbar-mobile-logout"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>
          )}

        </div>
      )}

    </header>
  );
}


export default Navbar;