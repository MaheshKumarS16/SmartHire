import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { getJobById } from "../services/jobService";
import { updateJob } from "../services/recruiterJobService";
import Loading from "../components/Loading";
import "./EditJob.css";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadJob();
  }, [id]);

  async function loadJob() {
    try {
      setLoading(true);
      setError("");
      const response = await getJobById(id);
      const job = response?.data || response;

      setFormData({
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        salary: job.salary || "",
        description: job.description || "",
      });
    } catch (err) {
      setError(err.message || "Unable to load job details.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
    setSuccess("");
  }

  function validateForm() {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Job title is required.";
    if (!formData.company.trim()) newErrors.company = "Company name is required.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    if (!formData.salary.trim()) newErrors.salary = "Salary is required.";
    if (!formData.description.trim()) {
      newErrors.description = "Job description is required.";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Job description must contain at least 20 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (!validateForm()) return;

    try {
      setSaving(true);
      await updateJob(id, {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        salary: formData.salary.trim(),
        description: formData.description.trim(),
      });

      setSuccess("Job listing updated successfully.");
      setTimeout(() => {
        navigate("/my-jobs");
      }, 900);
    } catch (err) {
      setError(err.message || "Failed to update job.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="page edit-job-page">
        <div className="container">
          <Loading message="Loading job details..." />
        </div>
      </main>
    );
  }

  return (
    <main className="page edit-job-page">
      <div className="container">
        {/* Back Link */}
        <div className="edit-job-nav">
          <Link to="/my-jobs" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to My Jobs</span>
          </Link>
        </div>

        {/* Edit Form Container */}
        <div className="edit-job-container">
          <div className="form-card-header">
            <span className="form-badge-pill">EDIT LISTING</span>
            <h1 className="form-main-title">Update Job Posting</h1>
            <p className="form-main-subtitle">
              Modify position details, compensation, location, or requirements. Changes take effect immediately.
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

          <form className="edit-job-form" onSubmit={handleSubmit} noValidate>
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
                    value={formData.salary}
                    onChange={handleChange}
                    className={`form-text-input ${errors.salary ? "has-error" : ""}`}
                  />
                </div>
                {errors.salary && <span className="field-error-msg">{errors.salary}</span>}
              </div>
            </div>

            {/* Description */}
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
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-save-job"
                disabled={saving}
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default EditJob;