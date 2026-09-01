/**
 * Global API Client Configuration for Production Readiness.
 * Single Source of Truth for base API URLs and HTTP request helpers.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * Global fetch wrapper with automatic credentials (cookies), JSON body stringify & error handling.
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const defaultHeaders = {};
  if (!isFormData) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  // Get token from localStorage if cookie is not supported
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Automatically JSON stringify body if passed as object (except FormData)
  let body = options.body;
  if (body && typeof body === "object" && !isFormData) {
    body = JSON.stringify(body);
  }

  const config = {
    ...options,
    body,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include", // Send/Receive HTTP-only cookies
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (!options.silent) {
      console.warn(`API Notice (${endpoint}):`, error.message);
    }
    throw error;
  }
}
