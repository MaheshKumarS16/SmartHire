import { apiRequest } from "./api";

export async function getAllJobs() {
  return apiRequest("/jobs");
}

export async function searchJobs(
  title,
  location,
  status
) {
  const params = new URLSearchParams();

  if (title) {
    params.append("title", title);
  }

  if (location) {
    params.append("location", location);
  }

  if (status) {
    params.append("status", status);
  }

  const queryString = params.toString();

  const endpoint = queryString
    ? `/jobs/search?${queryString}`
    : "/jobs/search";

  return apiRequest(endpoint);
}

export async function getJobById(jobId) {
  return apiRequest(`/jobs/${jobId}`);
}