import { apiRequest, API_BASE_URL } from "./api";

export async function getProfile() {
  return apiRequest("/profile");
}

export async function updateProfile(profileData) {
  return apiRequest("/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest("/profile/resume", {
    method: "POST",
    body: formData,
  });
}

export async function deleteResume() {
  return apiRequest("/profile/resume", {
    method: "DELETE",
  });
}

export async function downloadResume() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/profile/resume`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    let msg = "Failed to download resume";
    try {
      const err = JSON.parse(text);
      msg = err.message || msg;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");
  let filename = "resume.pdf";
  if (disposition && disposition.includes("filename=")) {
    filename = disposition.split("filename=")[1].replace(/["']/g, "").trim();
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function downloadApplicantResume(applicationId, candidateName) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/resume`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    let msg = "Failed to download applicant resume";
    try {
      const err = JSON.parse(text);
      msg = err.message || msg;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");
  let filename = `${(candidateName || "applicant").replace(/\s+/g, "_")}_resume.pdf`;
  if (disposition && disposition.includes("filename=")) {
    filename = disposition.split("filename=")[1].replace(/["']/g, "").trim();
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
