import React, { useState, useEffect, useCallback } from "react";
import { COLORS } from "../constants/theme";
import {
  getToken,
  login as apiLogin,
  logout as apiLogout,
  fetchRows,
  createRow,
  updateRow,
  deleteRow,
  downloadTable,
} from "../api/dbAdminApi";

// ── Table configuration (mirrors backend TABLE_CONFIG) ─────────────────────────
const TABLE_CONFIGS = {
  cabinets: {
    label: "Cabinets",
    pk: "id",
    searchField: "cabinet_code",
    searchLabel: "Cabinet Code",
    columns: [
      { key: "cabinet_code", label: "Cabinet Code", required: true },
      { key: "description", label: "Description", required: true },
      { key: "bom_line_1", label: "BOM 1" },
      { key: "bom_line_2", label: "BOM 2" },
      { key: "bom_line_3", label: "BOM 3" },
      { key: "bom_line_4", label: "BOM 4" },
      { key: "bom_line_5", label: "BOM 5" },
      { key: "bom_line_6", label: "BOM 6" },
    ],
  },
  colorcode: {
    label: "Color Code",
    pk: "id",
    searchField: "colour_name",
    searchLabel: "Colour Name",
    columns: [
      { key: "colour_name", label: "Colour Name" },
      { key: "colour_code", label: "Colour Code" },
    ],
  },
  code_raw: {
    label: "Code Raw",
    pk: "infurnia_code",
    searchField: "infurnia_code",
    searchLabel: "Infurnia Code",
    columns: [
      { key: "infurnia_code", label: "Infurnia Code" },
      { key: "odoo_code", label: "Odoo Code" },
    ],
  },
};

const PAGE_SIZE = 25;

// ── Shared styles (kept consistent with the rest of the app) ───────────────────
const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: `1.5px solid ${COLORS.lightTaupe}`,
  fontSize: 14,
  fontFamily: "Nunito Sans, sans-serif",
  outline: "none",
  boxSizing: "border-box",
};

const btnBase = {
  fontFamily: "Montserrat, sans-serif",
  fontSize: 13,
  fontWeight: 700,
  borderRadius: 30,
  border: "none",
  cursor: "pointer",
  padding: "9px 20px",
  transition: "opacity 0.15s ease",
};

const primaryBtn = {
  ...btnBase,
  background: `linear-gradient(90deg, ${COLORS.darkBrown} 0%, ${COLORS.medBrown} 100%)`,
  color: "white",
};

const secondaryBtn = {
  ...btnBase,
  background: COLORS.lightTaupe,
  color: COLORS.darkBrown,
};

const dangerBtn = {
  ...btnBase,
  background: "#b3413a",
  color: "white",
  padding: "6px 14px",
  fontSize: 12,
};

const ghostBtn = {
  ...btnBase,
  background: "transparent",
  color: COLORS.darkBrown,
  border: `1.5px solid ${COLORS.lightTaupe}`,
  padding: "6px 14px",
  fontSize: 12,
};

// ── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiLogin(username, password);
      onSuccess();
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${COLORS.cream} 0%, ${COLORS.blush} 50%, ${COLORS.lightTaupe} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "Nunito Sans, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 380,
          background: "rgba(255, 251, 248, 0.95)",
          backdropFilter: "blur(20px)",
          border: `1.5px solid ${COLORS.lightTaupe}`,
          borderRadius: 20,
          padding: "40px 36px",
          boxShadow: "0 8px 32px rgba(58,26,26,0.12)",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: COLORS.darkBrown }}>
            Database Manager
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: COLORS.deepTaupe }}>
            Sign in to continue
          </p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.darkBrown, display: "block", marginBottom: 6 }}>
            Username
          </label>
          <input
            style={inputStyle}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.darkBrown, display: "block", marginBottom: 6 }}>
            Password
          </label>
          <input
            type="password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <p style={{ color: "#b3413a", fontSize: 13, marginBottom: 16 }}>{error}</p>
        )}

        <button type="submit" disabled={loading} style={{ ...primaryBtn, width: "100%", padding: "12px 20px", fontSize: 14 }}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

// ── Edit modal ───────────────────────────────────────────────────────────────
function EditModal({ table, config, row, onClose, onSaved }) {
  const isNew = row === null;
  const [values, setValues] = useState(() => {
    const initial = {};
    config.columns.forEach((c) => (initial[c.key] = row ? row[c.key] ?? "" : ""));
    if (isNew && config.pk !== "id") initial[config.pk] = "";
    return initial;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (key, val) => {
    setValues((v) => ({ ...v, [key]: val }));
    if (fieldErrors[key]) setFieldErrors((f) => ({ ...f, [key]: undefined }));
  };

  const validate = () => {
    const errors = {};
    config.columns.forEach((c) => {
      if (c.required && !String(values[c.key] ?? "").trim()) {
        errors[c.key] = `${c.label} is required`;
      }
    });
    if (isNew && config.pk !== "id" && !String(values[config.pk] ?? "").trim()) {
      errors[config.pk] = `${config.pk} is required`;
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    setError("");
    if (!validate()) return;

    setSaving(true);
    try {
      if (isNew) {
        await createRow(table, values);
      } else {
        await updateRow(table, row[config.pk], values);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(58,26,26,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFBF8",
          borderRadius: 20,
          padding: 32,
          width: "100%",
          maxWidth: 480,
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 16px 48px rgba(58,26,26,0.25)",
        }}
      >
        <h3 style={{ margin: "0 0 20px", color: COLORS.darkBrown, fontFamily: "Montserrat, sans-serif" }}>
          {isNew ? `Add new ${config.label} record` : `Edit ${config.label} record`}
        </h3>

        {isNew && config.pk !== "id" && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.darkBrown, display: "block", marginBottom: 6 }}>
              {config.pk} (primary key) <span style={{ color: "#b3413a" }}>*</span>
            </label>
            <input
              style={{
                ...inputStyle,
                ...(fieldErrors[config.pk] ? { borderColor: "#b3413a" } : {}),
              }}
              value={values[config.pk]}
              onChange={(e) => handleChange(config.pk, e.target.value)}
            />
            {fieldErrors[config.pk] && (
              <p style={{ color: "#b3413a", fontSize: 12, margin: "4px 0 0" }}>{fieldErrors[config.pk]}</p>
            )}
          </div>
        )}

        {config.columns
          .filter((c) => isNew || c.key !== config.pk) // pk not editable once created
          .map((c) => (
            <div key={c.key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.darkBrown, display: "block", marginBottom: 6 }}>
                {c.label} {c.required && <span style={{ color: "#b3413a" }}>*</span>}
              </label>
              <input
                style={{
                  ...inputStyle,
                  ...(fieldErrors[c.key] ? { borderColor: "#b3413a" } : {}),
                }}
                value={values[c.key] ?? ""}
                onChange={(e) => handleChange(c.key, e.target.value)}
                disabled={!isNew && c.key === config.pk}
              />
              {fieldErrors[c.key] && (
                <p style={{ color: "#b3413a", fontSize: 12, margin: "4px 0 0" }}>{fieldErrors[c.key]}</p>
              )}
            </div>
          ))}

        {error && <p style={{ color: "#b3413a", fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button style={secondaryBtn} onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button style={primaryBtn} onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Confirm delete modal ─────────────────────────────────────────────────────
function ConfirmDeleteModal({ label, onCancel, onConfirm, deleting }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(58,26,26,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFBF8",
          borderRadius: 16,
          padding: 28,
          width: "100%",
          maxWidth: 360,
          boxShadow: "0 16px 48px rgba(58,26,26,0.25)",
        }}
      >
        <p style={{ margin: "0 0 20px", color: COLORS.darkBrown, fontSize: 15 }}>
          Delete record <strong>{label}</strong>? This cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button style={secondaryBtn} onClick={onCancel} disabled={deleting}>
            Cancel
          </button>
          <button style={{ ...dangerBtn, padding: "9px 20px", fontSize: 13 }} onClick={onConfirm} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Table view ───────────────────────────────────────────────────────────────
function TableView({ table }) {
  const config = TABLE_CONFIGS[table];

  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingRow, setEditingRow] = useState(undefined); // undefined = closed, null = new, object = edit
  const [deletingRow, setDeletingRow] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(
    async (searchValue = q, pageValue = page) => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchRows(table, { q: searchValue, page: pageValue, pageSize: PAGE_SIZE });
        setRows(data.rows);
        setTotal(data.total);
      } catch (err) {
        setError(err.message || "Failed to load records");
      } finally {
        setLoading(false);
      }
    },
    [table, q, page]
  );

  useEffect(() => {
    setQ("");
    setPage(1);
    load("", 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load(q, 1);
  };

  const handleClearSearch = () => {
    setQ("");
    setPage(1);
    load("", 1);
  };

  const goToPage = (p) => {
    setPage(p);
    load(q, p);
  };

  const handleDeleteConfirmed = async () => {
    setDeleting(true);
    try {
      await deleteRow(table, deletingRow[config.pk]);
      setDeletingRow(null);
      load(q, page);
    } catch (err) {
      setError(err.message || "Delete failed");
      setDeletingRow(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadTable(table);
    } catch (err) {
      setError(err.message || "Download failed");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      {/* ── Toolbar ────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 18 }}
      >
        <input
          style={{ ...inputStyle, maxWidth: 280 }}
          placeholder={`Search by ${config.searchLabel}…`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit" style={secondaryBtn}>Search</button>
        {q && (
          <button type="button" style={ghostBtn} onClick={handleClearSearch}>
            Clear
          </button>
        )}

        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <button type="button" style={secondaryBtn} onClick={handleDownload}>
            Download table (.xlsx)
          </button>
          <button type="button" style={primaryBtn} onClick={() => setEditingRow(null)}>
            + Add record
          </button>
        </div>
      </form>

      {error && <p style={{ color: "#b3413a", fontSize: 13, marginBottom: 12 }}>{error}</p>}

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div style={{ overflowX: "auto", borderRadius: 14, border: `1.5px solid ${COLORS.lightTaupe}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "Nunito Sans, sans-serif" }}>
          <thead>
            <tr style={{ background: COLORS.lightTaupe }}>
              {config.columns.map((c) => (
                <th key={c.key} style={{ textAlign: "left", padding: "10px 14px", color: COLORS.darkBrown, fontWeight: 700 }}>
                  {c.label}
                </th>
              ))}
              <th style={{ padding: "10px 14px" }} />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={config.columns.length + 1} style={{ padding: 20, textAlign: "center", color: COLORS.deepTaupe }}>
                  Loading…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={config.columns.length + 1} style={{ padding: 20, textAlign: "center", color: COLORS.deepTaupe }}>
                  No records found.
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((row) => (
                <tr key={row[config.pk]} style={{ borderTop: `1px solid ${COLORS.lightTaupe}` }}>
                  {config.columns.map((c) => (
                    <td key={c.key} style={{ padding: "10px 14px", color: COLORS.darkBrown }}>
                      {row[c.key] ?? ""}
                    </td>
                  ))}
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    <button style={{ ...ghostBtn, marginRight: 8 }} onClick={() => setEditingRow(row)}>
                      Edit
                    </button>
                    <button style={dangerBtn} onClick={() => setDeletingRow(row)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
        <span style={{ fontSize: 13, color: COLORS.deepTaupe }}>
          {total} record{total === 1 ? "" : "s"} — page {page} of {totalPages}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={ghostBtn} disabled={page <= 1} onClick={() => goToPage(page - 1)}>
            Previous
          </button>
          <button style={ghostBtn} disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
            Next
          </button>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      {editingRow !== undefined && (
        <EditModal
          table={table}
          config={config}
          row={editingRow}
          onClose={() => setEditingRow(undefined)}
          onSaved={() => load(q, page)}
        />
      )}
      {deletingRow && (
        <ConfirmDeleteModal
          label={deletingRow[config.pk]}
          deleting={deleting}
          onCancel={() => setDeletingRow(null)}
          onConfirm={handleDeleteConfirmed}
        />
      )}
    </div>
  );
}

// ── Top-level page ───────────────────────────────────────────────────────────
export default function DatabaseManager() {
  const [authed, setAuthed] = useState(() => Boolean(getToken()));
  const [activeTable, setActiveTable] = useState("cabinets");

  if (!authed) {
    return <LoginScreen onSuccess={() => setAuthed(true)} />;
  }

  const handleLogout = () => {
    apiLogout();
    setAuthed(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${COLORS.cream} 0%, ${COLORS.blush} 50%, ${COLORS.lightTaupe} 100%)`,
        paddingTop: 96,
        paddingBottom: 48,
        fontFamily: "Montserrat, Nunito Sans, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: COLORS.darkBrown, margin: 0 }}>
            Database Manager
          </h1>
          <button style={secondaryBtn} onClick={handleLogout}>
            Log out
          </button>
        </div>

        {/* ── Table tabs ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {Object.entries(TABLE_CONFIGS).map(([key, cfg]) => {
            const isActive = activeTable === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTable(key)}
                style={{
                  ...btnBase,
                  padding: "9px 22px",
                  background: isActive
                    ? `linear-gradient(90deg, ${COLORS.darkBrown} 0%, ${COLORS.medBrown} 100%)`
                    : "#706362",
                  color: "white",
                }}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>

        <div
          style={{
            background: "rgba(255, 251, 248, 0.9)",
            backdropFilter: "blur(20px)",
            border: `1.5px solid ${COLORS.lightTaupe}`,
            borderRadius: 20,
            padding: 28,
            boxShadow: "0 4px 24px rgba(58,26,26,0.08)",
          }}
        >
          <TableView table={activeTable} />
        </div>
      </div>
    </div>
  );
}