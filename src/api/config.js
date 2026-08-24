// Single source of truth for the backend origin.
//
// Four call sites used to interpolate import.meta.env.VITE_API_URL directly, so
// with no .env present they POSTed to "undefined/generate-pdf" and got a 404
// from the Vite dev server. Import API_BASE instead of reading the env var.

const RAW = import.meta.env.VITE_API_URL ?? "";

// Trailing slash would produce "//generate-pdf".
export const API_BASE = RAW.trim().replace(/\/+$/, "") || "http://localhost:8000";

export const apiUrl = (path) => `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
