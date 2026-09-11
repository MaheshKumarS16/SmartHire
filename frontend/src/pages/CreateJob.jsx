import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.salary.trim()) {
      newErrors.salary = "Salary is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Job description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description =
        "Job description must be at least 20 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      await createJob({
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        salary: formData.salary.trim(),
        description: formData.description.trim(),
      });

      setSuccess("Job created successfully.");

      setFormData({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
      });

      setTimeout(() => {
        navigate("/my-jobs");
      }, 800);
    } catch (err) {
      setError(err.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page create-job-page">
      <div className="container">

        <section className="create-job-header">
          <span className="eyebrow">RECRUITER PORTAL</span>

          <h1>Create a New Job</h1>

          <p>
            Post a new opportunity and find the right candidate for your
            team.
          </p>
        </section>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="form-success">
            ✓ {success}
          </div>
        )}

        <div className="create-job-layout">

          <section className="create-job-card">

            <form
              className="create-job-form"
              onSubmit={handleSubmit}
            >

              <div className="form-row">

                <div className="form-group">
                  <label htmlFor="title">
                    Job Title
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g. Java Full Stack Developer"
                    value={formData.title}
                    onChange={handleChange}
                  />

                  {errors.title && (
                    <p className="field-error">
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="company">
                    Company
                  </label>

                  <input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="e.g. SmartHire Technologies"
                    value={formData.company}
                    onChange={handleChange}
                  />

                  {errors.company && (
                    <p className="field-error">
                      {errors.company}
                    </p>
                  )}
                </div>

              </div>

              <div className="form-row">

                <div className="form-group">
                  <label htmlFor="location">
                    Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g. Bangalore"
                    value={formData.location}
                    onChange={handleChange}
                  />

                  {errors.location && (
                    <p className="field-error">
                      {errors.location}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="salary">
                    Salary
                  </label>

                  <input
                    id="salary"
                    name="salary"
                    type="text"
                    placeholder="e.g. 6-9 LPA"
                    value={formData.salary}
                    onChange={handleChange}
                  />

                  {errors.salary && (
                    <p className="field-error">
                      {errors.salary}
                    </p>
                  )}
                </div>

              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Job Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the role, responsibilities, required skills and experience..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="7"
                />

                {errors.description && (
                  <p className="field-error">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="form-actions">

                <button
                  type="submit"
                  className="primary-button"
                  disabled={loading}
                >
                  {loading ? "Creating Job..." : "Create Job"}
                </button>

                <button
                  type="button"
                  className="back-button"
                  onClick={() => navigate("/my-jobs")}
                  disabled={loading}
                >
                  Cancel
                </button>

              </div>

            </form>

          </section>

          <aside className="create-job-tips">

            <h2>Posting Tips</h2>

            <p>
              Create a clear and attractive job posting to reach the right
              candidates.
            </p>

            <div className="tip-list">

              <div className="tip-item">
                <div className="tip-icon">1</div>

                <div>
                  <h3>Clear job title</h3>

                  <p>
                    Use a specific title that accurately describes the
                    position.
                  </p>
                </div>
              </div>

              <div className="tip-item">
                <div className="tip-icon">2</div>

                <div>
                  <h3>Detailed description</h3>

                  <p>
                    Explain the responsibilities, skills and expectations
                    clearly.
                  </p>
                </div>
              </div>

              <div className="tip-item">
                <div className="tip-icon">3</div>

                <div>
                  <h3>Salary information</h3>

                  <p>
                    Adding a salary range helps candidates understand the
                    opportunity.
                  </p>
                </div>
              </div>

            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}

export default CreateJob;