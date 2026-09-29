import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Sparkles,
  ArrowLeft,
  FileCheck,
  ShieldCheck,
  Award
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getProfile,
  updateProfile,
  uploadResume,
  downloadResume,
  deleteResume
} from "../services/profileService";
import Loading from "../components/Loading";
import "./Profile.css";

const AVATAR_COLORS = [
  "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
  "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
  "linear-gradient(135deg, #10b981 0%, #047857 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)"
];

function getAvatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    summary: "",
    skills: "",
    education: "",
    experience: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [downloadingResume, setDownloadingResume] = useState(false);
  const [deletingResume, setDeletingResume] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  async function loadProfile() {
    try {
      setLoading(true);
      setErrorMessage("");
      const res = await getProfile();
      const data = res?.data || res;
      setProfile(data);
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        location: data.location || "",
        summary: data.summary || "",
        skills: data.skills || "",
        education: data.education || "",
        experience: data.experience || "",
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage("");
    setErrorMessage("");
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await updateProfile(formData);
      const updated = res?.data || res;
      setProfile(updated);
      setSuccessMessage("Profile updated successfully!");
    } catch (err) {
      setErrorMessage(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const validExtensions = ["pdf", "doc", "docx"];
    const ext = file.name.split(".").pop().toLowerCase();

    if (!validExtensions.includes(ext)) {
      setErrorMessage("Invalid file format. Please upload a PDF, DOC, or DOCX document.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File is too large. Maximum allowed size is 10MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      setUploadingResume(true);
      setErrorMessage("");
      setSuccessMessage("");
      const res = await uploadResume(file);
      const updated = res?.data || res;
      setProfile(updated);
      setSuccessMessage("Resume uploaded and saved successfully!");
    } catch (err) {
      setErrorMessage(err.message || "Failed to upload resume.");
    } finally {
      setUploadingResume(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDownloadResume() {
    try {
      setDownloadingResume(true);
      setErrorMessage("");
      await downloadResume();
    } catch (err) {
      setErrorMessage(err.message || "Could not download resume.");
    } finally {
      setDownloadingResume(false);
    }
  }

  async function handleDeleteResume() {
    if (!window.confirm("Are you sure you want to delete your uploaded resume?")) {
      return;
    }

    try {
      setDeletingResume(true);
      setErrorMessage("");
      setSuccessMessage("");
      const res = await deleteResume();
      const updated = res?.data || res;
      setProfile(updated);
      setSuccessMessage("Resume deleted successfully.");
    } catch (err) {
      setErrorMessage(err.message || "Failed to delete resume.");
    } finally {
      setDeletingResume(false);
    }
  }

  if (loading) {
    return (
      <main className="page profile-page">
        <div className="container">
          <Loading message="Loading profile..." />
        </div>
      </main>
    );
  }

  const isCandidate = profile?.role === "CANDIDATE" || user?.role === "CANDIDATE";
  const initials = (profile?.name || user?.name || "U").substring(0, 2).toUpperCase();

  const skillsList = formData.skills
    ? formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <main className="page profile-page">
      <div className="container profile-container">
        {/* Navigation Breadcrumb */}
        <div className="profile-top-nav">
          <Link
            to={isCandidate ? "/dashboard" : "/recruiter-dashboard"}
            className="back-link"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Hero Header Card */}
        <section className="profile-hero-card">
          <div className="profile-hero-inner">
            <div
              className="profile-avatar-large"
              style={{ background: getAvatarColor(profile?.name || "") }}
            >
              {initials}
            </div>

            <div className="profile-hero-info">
              <div className="profile-title-line">
                <h1 className="profile-user-name">{profile?.name || "User Profile"}</h1>
                <span className="profile-role-pill">
                  {isCandidate ? "Candidate Account" : "Recruiter Account"}
                </span>
              </div>

              <div className="profile-meta-grid">
                <span className="meta-cell">
                  <Mail size={14} className="meta-icon" />
                  {profile?.email}
                </span>
                {profile?.phone && (
                  <span className="meta-cell">
                    <Phone size={14} className="meta-icon" />
                    {profile.phone}
                  </span>
                )}
                {profile?.location && (
                  <span className="meta-cell">
                    <MapPin size={14} className="meta-icon" />
                    {profile.location}
                  </span>
                )}
                <span className="meta-cell verified-cell">
                  <ShieldCheck size={14} className="meta-icon" />
                  Verified Account
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Status Alerts */}
        {successMessage && (
          <div className="profile-alert alert-success">
            <CheckCircle size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="profile-alert alert-error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="profile-tabs-bar">
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            <User size={16} />
            <span>General Info</span>
          </button>

          {isCandidate && (
            <>
              <button
                type="button"
                className={`profile-tab-btn ${activeTab === "experience" ? "active" : ""}`}
                onClick={() => setActiveTab("experience")}
              >
                <Briefcase size={16} />
                <span>Experience &amp; Skills</span>
              </button>

              <button
                type="button"
                className={`profile-tab-btn ${activeTab === "resume" ? "active" : ""}`}
                onClick={() => setActiveTab("resume")}
              >
                <FileText size={16} />
                <span>Resume Management</span>
                {profile?.hasResume && (
                  <span className="tab-dot-badge" title="Resume on file"></span>
                )}
              </button>
            </>
          )}
        </div>

        {/* Tab 1: General Info Form */}
        {activeTab === "general" && (
          <form onSubmit={handleSaveProfile} className="profile-section-card">
            <div className="section-header-row">
              <div>
                <h2 className="section-title">Personal &amp; Contact Details</h2>
                <p className="section-subtitle">
                  Update your contact information visible to recruiters.
                </p>
              </div>
            </div>

            <div className="form-grid-2col">
              <div className="form-group">
                <label htmlFor="name" className="form-lbl">
                  Full Name <span className="req-star">*</span>
                </label>
                <div className="input-icon-wrap">
                  <User size={16} className="field-icon" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Mahesh Kumar"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-lbl">
                  Email Address (Primary)
                </label>
                <div className="input-icon-wrap">
                  <Mail size={16} className="field-icon" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="disabled-input"
                  />
                </div>
                <span className="field-helper-text">
                  Email address is linked to your login and cannot be changed.
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-lbl">
                  Phone Number
                </label>
                <div className="input-icon-wrap">
                  <Phone size={16} className="field-icon" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-lbl">
                  Location (City, Country)
                </label>
                <div className="input-icon-wrap">
                  <MapPin size={16} className="field-icon" />
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Bangalore, India (or Remote)"
                  />
                </div>
              </div>
            </div>

            <div className="form-group mt-4">
              <label htmlFor="summary" className="form-lbl">
                Professional Bio &amp; Career Summary
              </label>
              <textarea
                id="summary"
                name="summary"
                rows={4}
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Briefly describe your career background, expertise, and what drives you..."
                className="profile-textarea"
              />
            </div>

            <div className="form-footer-actions">
              <button
                type="submit"
                className="btn btn-primary btn-save-profile"
                disabled={saving}
              >
                {saving ? "Saving Changes..." : "Save Profile Details"}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Experience & Skills */}
        {activeTab === "experience" && isCandidate && (
          <form onSubmit={handleSaveProfile} className="profile-section-card">
            <div className="section-header-row">
              <div>
                <h2 className="section-title">Experience, Education &amp; Skills</h2>
                <p className="section-subtitle">
                  Help recruiters evaluate your qualifications and match open job roles.
                </p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="skills" className="form-lbl">
                Technical Skills (Comma-separated)
              </label>
              <div className="input-icon-wrap">
                <Sparkles size={16} className="field-icon" />
                <input
                  id="skills"
                  name="skills"
                  type="text"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g. React, Java, Spring Boot, TypeScript, Docker, Kubernetes, AWS"
                />
              </div>

              {skillsList.length > 0 && (
                <div className="skills-preview-row">
                  {skillsList.map((skill, idx) => (
                    <span key={idx} className="skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group mt-4">
              <label htmlFor="experience" className="form-lbl">
                Work Experience &amp; Highlights
              </label>
              <textarea
                id="experience"
                name="experience"
                rows={4}
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="Detail your recent roles, accomplishments, tech stack, and key projects..."
                className="profile-textarea"
              />
            </div>

            <div className="form-group mt-4">
              <label htmlFor="education" className="form-lbl">
                Education &amp; Certifications
              </label>
              <textarea
                id="education"
                name="education"
                rows={3}
                value={formData.education}
                onChange={handleInputChange}
                placeholder="e.g. B.Tech in Computer Science, AWS Certified Solutions Architect..."
                className="profile-textarea"
              />
            </div>

            <div className="form-footer-actions">
              <button
                type="submit"
                className="btn btn-primary btn-save-profile"
                disabled={saving}
              >
                {saving ? "Saving Changes..." : "Save Qualifications"}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Resume Management */}
        {activeTab === "resume" && isCandidate && (
          <div className="profile-section-card">
            <div className="section-header-row">
              <div>
                <h2 className="section-title">Resume &amp; CV Document</h2>
                <p className="section-subtitle">
                  Upload and manage your official CV used for 1-click applications.
                </p>
              </div>
            </div>

            {/* Current Resume Display */}
            {profile?.hasResume ? (
              <div className="current-resume-card">
                <div className="resume-icon-badge">
                  <FileCheck size={28} color="#2563eb" />
                </div>

                <div className="resume-file-info">
                  <strong className="resume-filename">
                    {profile.resumeFileName || "resume.pdf"}
                  </strong>
                  <span className="resume-meta-text">
                    Uploaded on{" "}
                    {profile.resumeUpdatedAt
                      ? new Date(profile.resumeUpdatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Recent upload"}
                  </span>
                  <span className="resume-ready-pill">
                    <CheckCircle size={12} /> Ready for Applications
                  </span>
                </div>

                <div className="resume-actions-group">
                  <button
                    type="button"
                    className="btn btn-outline btn-resume-action"
                    onClick={handleDownloadResume}
                    disabled={downloadingResume}
                  >
                    <Download size={15} />
                    <span>{downloadingResume ? "Downloading..." : "Download"}</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary btn-resume-action"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingResume}
                  >
                    <Upload size={15} />
                    <span>{uploadingResume ? "Replacing..." : "Replace"}</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger-ghost btn-resume-action"
                    onClick={handleDeleteResume}
                    disabled={deletingResume}
                    title="Delete Resume"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="resume-empty-dropzone">
                <div className="dropzone-icon">
                  <Upload size={36} color="#64748b" />
                </div>
                <h3>Upload Your Professional Resume</h3>
                <p className="dropzone-desc">
                  Supported formats: <strong>PDF, DOC, DOCX</strong> (Max file size: 10MB).
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-upload-cta"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingResume}
                >
                  <Upload size={16} style={{ marginRight: 6 }} />
                  <span>{uploadingResume ? "Uploading..." : "Select Resume File"}</span>
                </button>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />

            {/* Resume Tips */}
            <div className="resume-tips-box">
              <div className="tips-header">
                <Award size={18} color="#2563eb" />
                <strong>Resume Best Practices:</strong>
              </div>
              <ul className="tips-list">
                <li>Include measurable achievements and metrics from past engineering roles.</li>
                <li>Ensure contact details (email, phone, LinkedIn/GitHub) are up-to-date.</li>
                <li>PDF format is strongly recommended for consistent formatting across devices.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Profile;
