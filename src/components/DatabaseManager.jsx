import React, { useCallback, useEffect, useState } from "react";
import { Download, Plus } from "lucide-react";

import AuthHeader from "@/components/AuthHeader";
import TextField from "@/components/ui/TextField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getToken,
  login as apiLogin,
  logout as apiLogout,
  fetchRows,
  createRow,
  updateRow,
  deleteRow,
  downloadTable,
} from "@/api/dbAdminApi";

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
    <div className="app-surface flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="app-glass w-full max-w-sm rounded-[20px] border-[1.5px] border-border px-9 py-10 shadow-[0_8px_32px_rgba(58,26,26,0.12)]"
      >
        <AuthHeader subtitle="Sign in to continue" />

        <h2 className="mb-6 text-center font-display text-2xl font-bold text-brand-dark">
          Database Manager
        </h2>

        <div className="mb-4 space-y-1.5">
          <Label htmlFor="db-username">Username</Label>
          <Input
            id="db-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="mb-5 space-y-1.5">
          <Label htmlFor="db-password">Password</Label>
          <Input
            id="db-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}

// ── Edit / create dialog ─────────────────────────────────────────────────────
function EditDialog({ table, config, row, open, onClose, onSaved }) {
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
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-bold text-brand-dark">
            {isNew ? `Add new ${config.label} record` : `Edit ${config.label} record`}
          </DialogTitle>
          <DialogDescription className="text-brand-muted">
            Fields marked with an asterisk are required.
          </DialogDescription>
        </DialogHeader>

        {isNew && config.pk !== "id" && (
          <TextField
            label={
              <>
                {config.pk} (primary key) <span className="text-destructive">*</span>
              </>
            }
            name={config.pk}
            value={values[config.pk]}
            onChange={handleChange}
            error={fieldErrors[config.pk]}
          />
        )}

        {config.columns
          .filter((c) => isNew || c.key !== config.pk) // pk not editable once created
          .map((c) => (
            <TextField
              key={c.key}
              label={
                <>
                  {c.label} {c.required && <span className="text-destructive">*</span>}
                </>
              }
              name={c.key}
              value={values[c.key] ?? ""}
              onChange={handleChange}
              error={fieldErrors[c.key]}
              disabled={!isNew && c.key === config.pk}
            />
          ))}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Confirm delete dialog ────────────────────────────────────────────────────
function ConfirmDeleteDialog({ label, open, onCancel, onConfirm, deleting }) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold text-brand-dark">
            Delete record {label}?
          </DialogTitle>
          <DialogDescription className="text-brand-deep">
            This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="secondary" onClick={onCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
      <form onSubmit={handleSearch} className="mb-4.5 flex flex-wrap items-center gap-2.5">
        <Input
          className="max-w-70"
          placeholder={`Search by ${config.searchLabel}…`}
          aria-label={`Search by ${config.searchLabel}`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button type="submit" variant="secondary">Search</Button>
        {q && (
          <Button type="button" variant="outline" onClick={handleClearSearch}>
            Clear
          </Button>
        )}

        <div className="ml-auto flex gap-2.5">
          <Button type="button" variant="secondary" onClick={handleDownload}>
            <Download />
            Download table (.xlsx)
          </Button>
          <Button type="button" onClick={() => setEditingRow(null)}>
            <Plus />
            Add record
          </Button>
        </div>
      </form>

      {error && (
        <Alert variant="destructive" className="mb-3">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-xl border-[1.5px] border-border">
        <Table>
          <TableHeader>
            <TableRow>
              {config.columns.map((c) => (
                <TableHead key={c.key}>{c.label}</TableHead>
              ))}
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={config.columns.length + 1} className="p-5 text-center text-brand-deep">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={config.columns.length + 1} className="p-5 text-center text-brand-deep">
                  No records found.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              rows.map((row) => (
                <TableRow key={row[config.pk]}>
                  {config.columns.map((c) => (
                    <TableCell key={c.key}>{row[c.key] ?? ""}</TableCell>
                  ))}
                  <TableCell className="whitespace-nowrap">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => setEditingRow(row)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeletingRow(row)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ─────────────────────────────────────────────────── */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <span className="text-sm text-brand-deep">
          {total} record{total === 1 ? "" : "s"} — page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
            Next
          </Button>
        </div>
      </div>

      {/* ── Dialogs ────────────────────────────────────────────────────── */}
      {editingRow !== undefined && (
        <EditDialog
          open
          table={table}
          config={config}
          row={editingRow}
          onClose={() => setEditingRow(undefined)}
          onSaved={() => load(q, page)}
        />
      )}

      <ConfirmDeleteDialog
        open={Boolean(deletingRow)}
        label={deletingRow?.[config.pk]}
        deleting={deleting}
        onCancel={() => setDeletingRow(null)}
        onConfirm={handleDeleteConfirmed}
      />
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
    <div className="app-surface min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-bold text-brand-dark">
            Database Manager
          </h1>
          <Button variant="secondary" onClick={handleLogout}>
            Log out
          </Button>
        </div>

        {/* ── Table tabs ─────────────────────────────────────────────── */}
        <div role="tablist" aria-label="Database tables" className="mb-6 flex flex-wrap gap-2.5">
          {Object.entries(TABLE_CONFIGS).map(([key, cfg]) => (
            <Button
              key={key}
              role="tab"
              aria-selected={activeTable === key}
              variant={activeTable === key ? "default" : "slate"}
              size="sm"
              onClick={() => setActiveTable(key)}
            >
              {cfg.label}
            </Button>
          ))}
        </div>

        <div className="app-glass rounded-[20px] border-[1.5px] border-border p-7 shadow-[0_4px_24px_rgba(58,26,26,0.08)]">
          <TableView table={activeTable} />
        </div>
      </div>
    </div>
  );
}
