import { getCsrfToken } from "../context/AuthContext";

const BASE_URL = "http://localhost:5000/api";

export async function apiFetch(endpoint, options = {}, retries = 2) {
  const csrfToken = await getCsrfToken(); // ⚡️ CSRF-token är nu alltid med

  const headers = {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrfToken || "",
    ...options.headers,
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: "include",
      ...options,
      headers,
    });

    if (res.status === 429 && retries > 0) {
      console.warn("⚠️ Rate limit reached — retrying...");
      await new Promise((r) => setTimeout(r, 3000));
      return apiFetch(endpoint, options, retries - 1);
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Request failed (${res.status}): ${text || res.statusText}`
      );
    }

    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) return res.json();
    return null;
  } catch (err) {
    console.error(`❌ API error on ${endpoint}:`, err);
    throw err;
  }
}
