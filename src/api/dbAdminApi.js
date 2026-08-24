// src/api/dbAdminApi.js
//
// Thin fetch wrapper for the Database Manager UI.
// The backend origin comes from ./config (VITE_API_URL).

import { API_BASE } from "./config";

const TOKEN_KEY = "modula_admin_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function authedFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) {
    clearToken();
    const err = new Error("Session expired. Please log in again.");
    err.isAuthError = true;
    throw err;
  }

  if (!res.ok) {
    let detail = "Request failed";
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }

  return res;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export async function login(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    let detail = "Invalid username or password";
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }

  const data = await res.json();
  setToken(data.access_token);
  return data;
}

export function logout() {
  clearToken();
}

// ── Table CRUD ─────────────────────────────────────────────────────────────────
//
// Small in-memory cache for list/search results. Switching tabs back and
// forth, or re-opening the same search, is extremely common in this UI and
// doesn't need to hit the DB again every time — so we keep the last result
// per (table, q, page) for CACHE_TTL_MS and serve repeats from memory.
// Any write (create/update/delete) invalidates the cache for that table so
// stale data is never shown after an edit.

const CACHE_TTL_MS = 30_000; // 30s — long enough to absorb rapid tab-switching
const _cache = new Map(); // key: "table|q|page|pageSize" → { data, expiresAt }

function _cacheKey(table, q, page, pageSize) {
  return `${table}|${q}|${page}|${pageSize}`;
}

function _invalidateTable(table) {
  for (const key of _cache.keys()) {
    if (key.startsWith(`${table}|`)) _cache.delete(key);
  }
}

export async function fetchRows(table, { q = "", page = 1, pageSize = 25, force = false } = {}) {
  const key = _cacheKey(table, q, page, pageSize);
  const cached = _cache.get(key);
  if (!force && cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const params = new URLSearchParams({ page, page_size: pageSize });
  if (q) params.set("q", q);
  const res = await authedFetch(`/db/${table}?${params.toString()}`, { method: "GET" });
  const data = await res.json();

  _cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  return data;
}

export async function createRow(table, payload) {
  const res = await authedFetch(`/db/${table}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  _invalidateTable(table);
  return data;
}

export async function updateRow(table, pkValue, payload) {
  const res = await authedFetch(`/db/${table}/${encodeURIComponent(pkValue)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  _invalidateTable(table);
  return data;
}

export async function deleteRow(table, pkValue) {
  const res = await authedFetch(`/db/${table}/${encodeURIComponent(pkValue)}`, {
    method: "DELETE",
  });
  const data = await res.json();
  _invalidateTable(table);
  return data;
}

export async function downloadTable(table) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/db/${table}/download`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Download failed");

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${table}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}