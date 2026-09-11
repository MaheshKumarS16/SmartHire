const API_URL =
  "http://localhost:8080/api/auth";

export async function loginUser(
  email,
  password
) {
  const response = await fetch(
    `${API_URL}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
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
      data.message || "Login failed"
    );
  }

  return data;
}