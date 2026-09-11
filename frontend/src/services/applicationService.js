import { apiRequest } from "./api";

export async function applyForJob(jobId) {
  return apiRequest("/applications", {
    method: "POST",
    body: JSON.stringify({
      jobId: jobId,
    }),
  });
}

export async function getMyApplications() {
  return apiRequest("/applications/my");
}

export async function getApplicationsForJob(jobId) {
  return apiRequest(
    `/applications/job/${jobId}`
  );
}

export async function updateApplicationStatus(
  applicationId,
  status
) {
  return apiRequest(
    `/applications/${applicationId}/status?status=${status}`,
    {
      method: "PATCH",
    }
  );
}