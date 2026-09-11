import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getJobById } from "../services/jobService";
import { updateJob } from "../services/recruiterJobService";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

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
      const job = response.data;

      setFormData({
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        salary: job.salary || "",
        description: job.description || "",
      });
    } catch (err) {
      setError(err.message || "Unable to load job.");
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

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required.";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    }

    if (!formData.salary.trim()) {
      newErrors.salary = "Salary is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Job description is required.";
    } else if (formData.description.trim().length < 20) {
      newErrors.description =
        "Job description must contain at least 20 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      await updateJob(id, {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        salary: formData.salary.trim(),
        description: formData.description.trim(),
      });

      setSuccess("Job updated successfully.");

      setTimeout(() => {
        navigate("/my-jobs");
      }, 1000);
    } catch (err) {
      setError(err.message || "Unable to update job.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Loading message="Loading job details..." />;
  }

  return (
    <main className="page edit-job-page">
      <div className="container edit-job-container">

        <div className="page-header">
          <div>
            <p className="eyebrow">RECRUITER PORTAL</p>

            <h1>Edit Job</h1>

            <p>
              Update the details of your job posting.
            </p>
          </div>
        </div>

        <ErrorMessage
          message={error}
          onRetry={loadJob}
        />

        {success && (
          <div className="success-message">
            <strong>✓ {success}</strong>

            <span>
              Redirecting to My Jobs...
            </span>
          </div>
        )}

        {!error && (
          <form
            className="job-form-card"
            onSubmit={handleSubmit}
          >

            {/* Job Information */}

            <div className="form-section">

              <div className="form-section-header">
                <h2>Job Information</h2>

                <p>
                  Keep the job information accurate and up to date.
                </p>
              </div>

              <div className="form-grid">

                {/* Job Title */}

                <div className="form-group">

                  <label htmlFor="title">
                    Job Title <span>*</span>
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Java Full Stack Developer"
                    className={errors.title ? "input-error" : ""}
                  />

                  {errors.title && (
                    <small className="field-error">
                      {errors.title}
                    </small>
                  )}

                </div>

                {/* Company */}

                <div className="form-group">

                  <label htmlFor="company">
                    Company <span>*</span>
                  </label>

                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. SmartHire Technologies"
                    className={errors.company ? "input-error" : ""}
                  />

                  {errors.company && (
                    <small className="field-error">
                      {errors.company}
                    </small>
                  )}

                </div>

                {/* Location */}

                <div className="form-group">

                  <label htmlFor="location">
                    Location <span>*</span>
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Bangalore"
                    className={errors.location ? "input-error" : ""}
                  />

                  {errors.location && (
                    <small className="field-error">
                      {errors.location}
                    </small>
                  )}

                </div>

                {/* Salary */}

                <div className="form-group">

                  <label htmlFor="salary">
                    Salary <span>*</span>
                  </label>

                  <input
                    id="salary"
                    name="salary"
                    type="text"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g. 6-9 LPA"
                    className={errors.salary ? "input-error" : ""}
                  />

                  {errors.salary && (
                    <small className="field-error">
                      {errors.salary}
                    </small>
                  )}

                </div>

              </div>

            </div>

            {/* Description */}

            <div className="form-section">

              <div className="form-section-header">

                <h2>Job Description</h2>

                <p>
                  Describe the responsibilities, skills and requirements.
                </p>

              </div>

              <div className="form-group">

                <label htmlFor="description">
                  Description <span>*</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the role, responsibilities and required skills..."
                  rows="8"
                  className={
                    errors.description ? "input-error" : ""
                  }
                />

                <div className="textarea-footer">

                  <span>
                    Minimum 20 characters
                  </span>

                  <span>
                    {formData.description.length} characters
                  </span>

                </div>

                {errors.description && (
                  <small className="field-error">
                    {errors.description}
                  </small>
                )}

              </div>

            </div>

            {/* Actions */}

            <div className="form-actions">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/my-jobs")}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving Changes..."
                  : "Save Changes"}
              </button>

            </div>

          </form>
        )}

      </div>
    </main>
  );
}

export default EditJob;