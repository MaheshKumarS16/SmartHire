const API_BASE_URL = "http://localhost:8080/api";

export async function apiRequest(
  endpoint,
  options = {}
) {
  const token = localStorage.getItem("token");

  const headers = {
    ...options.headers,
  };

  if (options.body) {
    headers["Content-Type"] =
      "application/json";
  }

  if (token) {
    headers["Authorization"] =
      `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  const text = await response.text();

  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error(
        "Server returned an invalid response"
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
}