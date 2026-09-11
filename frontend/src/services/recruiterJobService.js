import { apiRequest } from "./api";

export async function getMyJobs() {
  return apiRequest("/jobs/my");
}

export async function createJob(jobData) {
  return apiRequest("/jobs", {
    method: "POST",
    body: JSON.stringify(jobData),
  });
}

export async function updateJob(
  jobId,
  jobData
) {
  return apiRequest(`/jobs/${jobId}`, {
    method: "PUT",
    body: JSON.stringify(jobData),
  });
}

export async function updateJobStatus(
  jobId,
  status
) {
  return apiRequest(
    `/jobs/${jobId}/status?status=${status}`,
    {
      method: "PATCH",
    }
  );
}

export async function deleteJob(jobId) {
  return apiRequest(`/jobs/${jobId}`, {
    method: "DELETE",
  });
}