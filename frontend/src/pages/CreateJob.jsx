import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { createJob } from "../services/recruiterJobService";
import "./CreateJob.css";

function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
    setError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.salary.trim()) newErrors.salary = "Salary information is required";
    if (!formData.description.trim()) {
      newErrors.description = "Job description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Job description must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      await createJob({
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        salary: formData.salary.trim(),
        description: formData.description.trim(),
      });

      setSuccess("Job listing published successfully!");
      setFormData({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
      });

      setTimeout(() => {
        navigate("/my-jobs");
      }, 900);
    } catch (err) {
      setError(err.message || "Failed to create job posting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page create-job-page">
      <div className="container">
        {/* Back Link */}
        <div className="create-job-nav">
          <Link to="/my-jobs" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to My Jobs</span>
          </Link>
        </div>

        {/* Form Container Card */}
        <div className="create-job-container">
          <div className="form-card-header">
            <span className="form-badge-pill">RECRUITER PORTAL</span>
            <h1 className="form-main-title">Create a New Job Listing</h1>
            <p className="form-main-subtitle">
              Publish an opening on SmartHire to reach verified, qualified candidates across tech and operations.
            </p>
          </div>

          {error && (
            <div className="form-alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="form-alert alert-success">
              <CheckCircle size={18} />
              <span>{success}</span>
            </div>
          )}

          <form className="create-job-form" onSubmit={handleSubmit} noValidate>
            <div className="form-grid-row">
              {/* Job Title */}
              <div className="form-field-wrap">
                <label className="field-label" htmlFor="title">
                  Job Title <span className="req-star">*</span>
                </label>
                <div className="input-with-icon">
                  <Briefcase size={17} className="field-icon" />
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g. Senior Frontend Engineer"
                    value={formData.title}
                    onChange={handleChange}
                    className={`form-text-input ${errors.title ? "has-error" : ""}`}
                  />
                </div>
                {errors.title && <span className="field-error-msg">{errors.title}</span>}
              </div>

              {/* Company Name */}
              <div className="form-field-wrap">
                <label className="field-label" htmlFor="company">
                  Company Name <span className="req-star">*</span>
                </label>
                <div className="input-with-icon">
                  <Building2 size={17} className="field-icon" />
                  <input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="e.g. Accelera Technologies"
                    value={formData.company}
                    onChange={handleChange}
                    className={`form-text-input ${errors.company ? "has-error" : ""}`}
                  />
                </div>
                {errors.company && <span className="field-error-msg">{errors.company}</span>}
              </div>
            </div>

            <div className="form-grid-row">
              {/* Location */}
              <div className="form-field-wrap">
                <label className="field-label" htmlFor="location">
                  Location <span className="req-star">*</span>
                </label>
                <div className="input-with-icon">
                  <MapPin size={17} className="field-icon" />
                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g. Bangalore, India (or Remote)"
                    value={formData.location}
                    onChange={handleChange}
                    className={`form-text-input ${errors.location ? "has-error" : ""}`}
                  />
                </div>
                {errors.location && <span className="field-error-msg">{errors.location}</span>}
              </div>

              {/* Salary */}
              <div className="form-field-wrap">
                <label className="field-label" htmlFor="salary">
                  Salary / Compensation <span className="req-star">*</span>
                </label>
                <div className="input-with-icon">
                  <IndianRupee size={17} className="field-icon" />
                  <input
                    id="salary"
                    name="salary"
                    type="text"
                    placeholder="e.g. ₹12 - 18 LPA"
                    value={formData.salary}
                    onChange={handleChange}
                    className={`form-text-input ${errors.salary ? "has-error" : ""}`}
                  />
                </div>
                {errors.salary && <span className="field-error-msg">{errors.salary}</span>}
              </div>
            </div>

            {/* Job Description */}
            <div className="form-field-wrap">
              <div className="field-label-row">
                <label className="field-label" htmlFor="description">
                  Job Description &amp; Responsibilities <span className="req-star">*</span>
                </label>
                <span className="char-count-text">
                  {formData.description.length} characters
                </span>
              </div>
              <textarea
                id="description"
                name="description"
                rows={6}
                placeholder="Describe role responsibilities, key requirements, tech stack, and ideal candidate background..."
                value={formData.description}
                onChange={handleChange}
                className={`form-textarea-input ${errors.description ? "has-error" : ""}`}
              />
              {errors.description && (
                <span className="field-error-msg">{errors.description}</span>
              )}
            </div>

            {/* Actions */}
            <div className="form-actions-row">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate("/my-jobs")}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-submit-job"
                disabled={loading}
              >
                {loading ? "Publishing Job..." : "Publish Job Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default CreateJob;