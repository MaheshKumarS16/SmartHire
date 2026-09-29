import { Link } from "react-router-dom";
import { Briefcase, Mail, Phone, MapPin, Shield, Sparkles } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="container footer-content">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">
              <span className="footer-logo-badge">
                <Briefcase size={18} strokeWidth={2.5} />
              </span>
              <span className="footer-brand-name">SmartHire</span>
            </Link>
            <p className="footer-brand-desc">
              Next-generation hiring and career discovery platform connecting ambitious talent with visionary companies worldwide.
            </p>
            <div className="footer-social-links">
              <span className="footer-tagline-pill">
                <Sparkles size={14} className="sparkle-icon" /> AI-Enhanced Job Matching
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-nav-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/jobs">Find Jobs</Link></li>
              <li><Link to="/login">Recruiter Portal</Link></li>
              <li><Link to="/register">Create Account</Link></li>
            </ul>
          </div>

          {/* Column 3: For Candidates */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">For Job Seekers</h4>
            <ul className="footer-nav-list">
              <li><Link to="/jobs">Browse Openings</Link></li>
              <li><Link to="/dashboard">Candidate Dashboard</Link></li>
              <li><Link to="/applications">Track Applications</Link></li>
              <li><Link to="/register">Join Talent Pool</Link></li>
            </ul>
          </div>

          {/* Column 4: For Recruiters */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">For Recruiters</h4>
            <ul className="footer-nav-list">
              <li><Link to="/create-job">Post a Job</Link></li>
              <li><Link to="/my-jobs">Manage Listings</Link></li>
              <li><Link to="/recruiter-dashboard">Hiring Analytics</Link></li>
              <li><Link to="/register">Recruiter Signup</Link></li>
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div className="footer-contact-col">
            <h4 className="footer-col-title">Contact</h4>
            <ul className="footer-contact-list">
              <li>
                <Mail size={15} />
                <span>support@smarthire.com</span>
              </li>
              <li>
                <Phone size={15} />
                <span>+91 98765 43210</span>
              </li>
              <li>
                <MapPin size={15} />
                <span>Bangalore, Karnataka, India</span>
              </li>
              <li className="footer-verified-badge">
                <Shield size={14} />
                <span>100% Verified Job Postings</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © {new Date().getFullYear()} SmartHire Inc. All rights reserved. Built for modern recruitment.
          </div>
          <div className="footer-legal-links">
            <Link to="#">Privacy Policy</Link>
            <span className="dot">•</span>
            <Link to="#">Terms of Service</Link>
            <span className="dot">•</span>
            <Link to="#">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
