import React, { useState, useRef } from "react";
import PageLayout from "./PageLayout";
import Section from "./ui/Section";
import TextField from "./ui/TextField";
import { downloadFile } from "../utils/downloadFile";
import { COLORS, PRIMARY_BTN_STYLE } from "../constants/theme";

// ─── Icons ────────────────────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg style={{ height: 24, width: 24, animation: "spin 1s linear infinite" }}
      fill="none" viewBox="0 0 24 24">
      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4" />
      <path style={{ opacity: 0.75 }} fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962
           7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5
           4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0
           0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07
           7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function SubmitButton({ loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={loading ? "upload-shimmer" : ""}
      style={PRIMARY_BTN_STYLE(loading)}
      onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = "0 25px 50px -12px rgba(58,26,26,0.4)"; e.currentTarget.style.transform = "scale(1.02)"; } }}
      onMouseLeave={e => { if (!loading) { e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(58,26,26,0.3)"; e.currentTarget.style.transform = "scale(1)"; } }}
      onMouseDown={e => { if (!loading) e.currentTarget.style.transform = "scale(0.98)"; }}
      onMouseUp={e => { if (!loading) e.currentTarget.style.transform = "scale(1.02)"; }}
    >
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
        {loading
          ? <><SpinnerIcon /> Generating Installation Report…</>
          : <><DownloadIcon /> Generate Installation Report</>}
      </span>
    </button>
  );
}

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="error-shake" style={{
      marginBottom: 24, padding: 20, borderRadius: 12,
      background: COLORS.blush, border: `2px solid ${COLORS.warmTaupe}`,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <svg style={{ width: 24, height: 24, color: "#dc2626", flexShrink: 0, marginTop: 2 }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p style={{ color: "#991b1b", fontWeight: 500, margin: 0 }}>{message}</p>
      </div>
    </div>
  );
}

function SuccessBanner({ show }) {
  if (!show) return null;
  return (
    <div style={{
      marginBottom: 24, padding: 20, borderRadius: 12,
      background: "#f0fdf4", border: "2px solid #86efac",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <svg style={{ width: 24, height: 24, color: "#16a34a", flexShrink: 0 }}
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p style={{ color: "#15803d", fontWeight: 500, margin: 0 }}>
        Installation report generated and downloaded successfully!
      </p>
    </div>
  );
}

// ─── Add-row button ───────────────────────────────────────────────────────────

function AddRowButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "none",
        border: `1.5px dashed ${COLORS.lightTaupe}`,
        borderRadius: 10,
        padding: "9px 16px",
        cursor: "pointer",
        color: COLORS.medBrown,
        fontFamily: "Montserrat, sans-serif",
        fontSize: 13, fontWeight: 600,
        transition: "all 0.2s ease",
        width: "100%",
        marginTop: 8,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = COLORS.medBrown;
        e.currentTarget.style.background = `rgba(107,75,65,0.05)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = COLORS.lightTaupe;
        e.currentTarget.style.background = "none";
      }}
    >
      <PlusIcon /> {label}
    </button>
  );
}

// ─── Dynamic row (Completed Work / Upcoming Work) ─────────────────────────────

function DynamicRow({ row, index, onChange, onRemove, columns }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: columns.map(c => c.flex || "1fr").join(" "),
      gap: 10,
      alignItems: "start",
      marginBottom: 10,
      background: "rgba(215,197,170,0.08)",
      border: `1px solid ${COLORS.lightTaupe}`,
      borderRadius: 10,
      padding: "12px 14px",
      position: "relative",
    }}>
      {columns.map(col => (
        <div key={col.key}>
          <label style={{
            display: "block", marginBottom: 5,
            fontSize: 11, fontWeight: 600,
            color: COLORS.mutedBrown, letterSpacing: "0.4px",
            textTransform: "uppercase",
          }}>
            {col.label}
          </label>
          <input
            type="text"
            value={row[col.key] || ""}
            placeholder={col.placeholder || ""}
            onChange={e => onChange(index, col.key, e.target.value)}
            style={{
              width: "100%", padding: "8px 11px",
              border: `1.5px solid ${COLORS.lightTaupe}`,
              borderRadius: 8, fontSize: 13,
              fontFamily: "Montserrat, sans-serif",
              color: COLORS.darkBrown,
              background: "rgba(255,251,248,0.9)",
              outline: "none", boxSizing: "border-box",
              transition: "border-color 0.2s ease",
            }}
            onFocus={e => (e.target.style.borderColor = COLORS.medBrown)}
            onBlur={e => (e.target.style.borderColor = COLORS.lightTaupe)}
          />
        </div>
      ))}

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        title="Remove row"
        style={{
          position: "absolute", top: 10, right: 10,
          background: "none", border: "none",
          cursor: "pointer", color: COLORS.mutedBrown,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 4, borderRadius: 6,
          transition: "color 0.2s ease, background 0.2s ease",
        }}
        onMouseEnter={e => { e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.background = "#fee2e2"; }}
        onMouseLeave={e => { e.currentTarget.style.color = COLORS.mutedBrown; e.currentTarget.style.background = "none"; }}
      >
        <TrashIcon />
      </button>
    </div>
  );
}

// ─── Photo Upload Zone ────────────────────────────────────────────────────────

function PhotoUploadZone({ photos, onAdd, onRemove }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (imageFiles.length) onAdd(imageFiles);
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        style={{
          border: `2px dashed ${isDragging ? COLORS.medBrown : COLORS.lightTaupe}`,
          borderRadius: 14,
          padding: "28px 24px",
          cursor: "pointer",
          background: isDragging ? "rgba(107,75,65,0.06)" : "rgba(215,197,170,0.08)",
          textAlign: "center",
          transition: "all 0.25s ease",
          marginBottom: 16,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = COLORS.medBrown;
          e.currentTarget.style.background = "rgba(107,75,65,0.05)";
        }}
        onMouseLeave={e => {
          if (!isDragging) {
            e.currentTarget.style.borderColor = COLORS.lightTaupe;
            e.currentTarget.style.background = "rgba(215,197,170,0.08)";
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={e => handleFiles(e.target.files)}
        />

        <div style={{
          width: 56, height: 56, borderRadius: 14, margin: "0 auto 12px",
          background: `linear-gradient(135deg, ${COLORS.lightTaupe} 0%, ${COLORS.blush} 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: COLORS.medBrown,
        }}>
          <CameraIcon />
        </div>

        <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: COLORS.deepTaupe }}>
          Drop photos here or click to browse
        </p>
        <p style={{ margin: 0, fontSize: 12, color: COLORS.mutedBrown }}>
          PNG, JPG, WEBP — unlimited photos, one per page in the report
        </p>
      </div>

      {/* Photo grid previews */}
      {photos.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: 10,
        }}>
          {photos.map((photo, i) => (
            <div key={i} style={{ position: "relative", borderRadius: 10, overflow: "hidden" }}>
              <img
                src={photo.preview}
                alt={photo.file.name}
                style={{
                  width: "100%", height: 90,
                  objectFit: "cover",
                  display: "block",
                  border: `1px solid ${COLORS.lightTaupe}`,
                  borderRadius: 10,
                }}
              />
              {/* Photo number badge */}
              <div style={{
                position: "absolute", top: 5, left: 5,
                background: "rgba(58,26,26,0.75)",
                color: "#fff", fontSize: 10, fontWeight: 700,
                padding: "2px 7px", borderRadius: 20,
              }}>
                {i + 1}
              </div>
              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemove(i)}
                style={{
                  position: "absolute", top: 5, right: 5,
                  background: "rgba(220,38,38,0.85)",
                  border: "none", borderRadius: "50%",
                  width: 22, height: 22, cursor: "pointer",
                  color: "#fff", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  padding: 0,
                }}
              >
                <CloseIcon />
              </button>
              {/* Filename tooltip */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
                padding: "14px 6px 5px",
                fontSize: 9, color: "#fff",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {photo.file.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <p style={{ margin: "10px 0 0", fontSize: 12, color: COLORS.mutedBrown }}>
          {photos.length} photo{photos.length !== 1 ? "s" : ""} selected
          {" — "}each appears on its own page in the PDF
        </p>
      )}
    </div>
  );
}

// ─── Manpower row ─────────────────────────────────────────────────────────────

function ManpowerRow({ label, countKey, inKey, outKey, values, onChange }) {
  const inputStyle = {
    width: "100%", padding: "8px 11px",
    border: `1.5px solid ${COLORS.lightTaupe}`,
    borderRadius: 8, fontSize: 13,
    fontFamily: "Montserrat, sans-serif",
    color: COLORS.darkBrown,
    background: "rgba(255,251,248,0.9)",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  };
  const colLabel = (text) => (
    <label style={{
      display: "block", marginBottom: 5, fontSize: 11, fontWeight: 600,
      color: COLORS.mutedBrown, letterSpacing: "0.4px", textTransform: "uppercase",
    }}>{text}</label>
  );

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1.6fr 0.8fr 1.2fr 1.2fr",
      gap: 10,
      alignItems: "end",
      marginBottom: 10,
      background: "rgba(215,197,170,0.08)",
      border: `1px solid ${COLORS.lightTaupe}`,
      borderRadius: 10, padding: "12px 14px",
    }}>
      <div>
        {colLabel("Role")}
        <div style={{
          ...inputStyle, background: "rgba(215,197,170,0.18)",
          color: COLORS.deepTaupe, fontWeight: 600, cursor: "default",
          display: "flex", alignItems: "center",
        }}>
          {label}
        </div>
      </div>
      <div>
        {colLabel("Count")}
        <input
          type="number" min="0"
          value={values[countKey] || ""}
          placeholder="0"
          onChange={e => onChange(countKey, e.target.value)}
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = COLORS.medBrown)}
          onBlur={e => (e.target.style.borderColor = COLORS.lightTaupe)}
        />
      </div>
      <div>
        {colLabel("In Time")}
        <input
          type="text"
          value={values[inKey] || ""}
          placeholder="e.g. 10:30 AM"
          onChange={e => onChange(inKey, e.target.value)}
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = COLORS.medBrown)}
          onBlur={e => (e.target.style.borderColor = COLORS.lightTaupe)}
        />
      </div>
      <div>
        {colLabel("Out Time")}
        <input
          type="text"
          value={values[outKey] || ""}
          placeholder="e.g. 6:00 PM"
          onChange={e => onChange(outKey, e.target.value)}
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = COLORS.medBrown)}
          onBlur={e => (e.target.style.borderColor = COLORS.lightTaupe)}
        />
      </div>
    </div>
  );
}

// ─── Textarea field ───────────────────────────────────────────────────────────

function TextareaField({ label, name, value, onChange, placeholder, rows = 3 }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{
        display: "block", marginBottom: 8, fontWeight: 600,
        color: COLORS.deepTaupe, fontSize: 13, letterSpacing: "0.3px",
      }}>
        {label}
      </label>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={e => onChange(name, e.target.value)}
        style={{
          width: "100%", padding: "10px 14px",
          border: `1.5px solid ${COLORS.lightTaupe}`,
          borderRadius: 10, fontSize: 14,
          fontFamily: "Montserrat, sans-serif",
          color: COLORS.darkBrown,
          background: "rgba(255,251,248,0.8)",
          outline: "none", boxSizing: "border-box",
          resize: "vertical", lineHeight: 1.6,
          transition: "border-color 0.2s ease",
        }}
        onFocus={e => (e.target.style.borderColor = COLORS.medBrown)}
        onBlur={e => (e.target.style.borderColor = COLORS.lightTaupe)}
      />
    </div>
  );
}

// ─── Section label badge ──────────────────────────────────────────────────────

function StepBadge({ number }) {
  return (
    <div style={{
      width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
      background: `linear-gradient(135deg, ${COLORS.darkBrown} 0%, ${COLORS.medBrown} 100%)`,
      color: "#fff", fontSize: 12, fontWeight: 700,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {number}
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

const EMPTY_CW_ROW = () => ({ actionItem: "", date: "", challengesFaced: "" });
const EMPTY_UW_ROW = () => ({ actionItem: "", date: "", potentialIssues: "" });

export default function InstallationReportForm() {
  // Project info
  const [project, setProject] = useState({
    projectName: "",
    reportDate: "",
    projectSupervisor: "",
    projectManager: "",
    projectDesigner: "",
  });

  // Accomplishments (plain text, multiline)
  const [accomplishments, setAccomplishments] = useState("");

  // Completed work rows
  const [completedWork, setCompletedWork] = useState([EMPTY_CW_ROW()]);

  // Manpower
  const [manpower, setManpower] = useState({
    numIPs: "", ipInTime: "", ipOutTime: "",
    numHelpers: "", helperInTime: "", helperOutTime: "",
    numLabour: "", labourInTime: "", labourOutTime: "",
    mandays: "",
  });

  // Upcoming work rows
  const [upcomingWork, setUpcomingWork] = useState([EMPTY_UW_ROW()]);

  // Photos
  const [photos, setPhotos] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const setProj = (name, value) => setProject(p => ({ ...p, [name]: value }));
  const setMp   = (name, value) => setManpower(m => ({ ...m, [name]: value }));

  const updateCW = (i, key, val) =>
    setCompletedWork(rows => rows.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  const addCW    = () => setCompletedWork(r => [...r, EMPTY_CW_ROW()]);
  const removeCW = (i) => setCompletedWork(r => r.filter((_, idx) => idx !== i));

  const updateUW = (i, key, val) =>
    setUpcomingWork(rows => rows.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  const addUW    = () => setUpcomingWork(r => [...r, EMPTY_UW_ROW()]);
  const removeUW = (i) => setUpcomingWork(r => r.filter((_, idx) => idx !== i));

  const addPhotos = (files) => {
    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
  };
  const removePhoto = (i) => {
    setPhotos(prev => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  // ── Submit ───────────────────────────────────────────────────────────────────

  const handleGenerate = async () => {
    if (!project.projectName.trim()) {
      setError("Project Name is required.");
      return;
    }
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const fd = new FormData();

      // Project info
      Object.entries(project).forEach(([k, v]) => fd.append(k, v));

      // Accomplishments — plain string
      fd.append("accomplishments", accomplishments);

      // Completed work — JSON array (filter empty rows)
      const cwFiltered = completedWork.filter(r => r.actionItem.trim());
      fd.append("completedWork", JSON.stringify(cwFiltered));

      // Manpower fields
      Object.entries(manpower).forEach(([k, v]) => fd.append(k, v));

      // Upcoming work — JSON array (filter empty rows)
      const uwFiltered = upcomingWork.filter(r => r.actionItem.trim());
      fd.append("upcomingWork", JSON.stringify(uwFiltered));

      // Photos
      photos.forEach(p => fd.append("photos", p.file, p.file.name));

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/generate-installation-report`,
        { method: "POST", body: fd }
      );

      if (!res.ok) throw new Error(await res.text());

      const blobUrl = URL.createObjectURL(await res.blob());
      const safeName = project.projectName.replace(/\s+/g, "_");
      downloadFile(blobUrl, `Installation_Report_${safeName}.pdf`);
      URL.revokeObjectURL(blobUrl);
      setSuccess(true);
    } catch (e) {
      setError(`Generation failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ── CW / UW column definitions ───────────────────────────────────────────────

  const CW_COLS = [
    { key: "actionItem",     label: "Action / Work Done",  placeholder: "e.g. Installed base cabinets", flex: "2fr" },
    { key: "date",           label: "Date",                placeholder: "e.g. 25/05/2026",              flex: "1fr" },
    { key: "challengesFaced",label: "Challenges Faced",    placeholder: "e.g. No issues",               flex: "1.5fr" },
  ];

  const UW_COLS = [
    { key: "actionItem",    label: "Upcoming Task",         placeholder: "e.g. Fix countertop",   flex: "2fr" },
    { key: "date",          label: "Target Date",           placeholder: "e.g. 26/05/2026",       flex: "1fr" },
    { key: "potentialIssues",label: "Potential Issues",     placeholder: "e.g. Material pending", flex: "1.5fr" },
  ];

  // ── Render ───────────────────────────────────────────────────────────────────

  const sectionHeader = (number, title) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, marginBottom: 18,
      paddingBottom: 12,
      borderBottom: `1px solid ${COLORS.lightTaupe}`,
    }}>
      <StepBadge number={number} />
      <h3 style={{
        margin: 0, color: COLORS.darkBrown,
        fontSize: 15, fontWeight: 700,
        letterSpacing: "-0.2px",
        fontFamily: "Montserrat, Nunito Sans, sans-serif",
      }}>
        {title}
      </h3>
    </div>
  );

  return (
    <PageLayout maxWidth={820}>
      <div style={{ padding: 40 }}>

        {/* ── 1. Project Information ──────────────────────────────────── */}
        <div style={{
          background: "rgba(255,251,248,0.7)", border: `1px solid ${COLORS.lightTaupe}`,
          borderRadius: 16, padding: 24, marginBottom: 24,
        }}>
          {sectionHeader(1, "Project Information")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 4 }}>
            <TextField label="Project Name *" name="projectName"
              value={project.projectName} onChange={setProj}
              placeholder="e.g. Shweta ji" />
            <TextField label="Report Date" name="reportDate"
              value={project.reportDate} onChange={setProj}
              placeholder="e.g. 25/05/2026" />
            <TextField label="Project Supervisor" name="projectSupervisor"
              value={project.projectSupervisor} onChange={setProj}
              placeholder="e.g. Amar Chand Maurya" />
            <TextField label="Project Manager" name="projectManager"
              value={project.projectManager} onChange={setProj}
              placeholder="e.g. Praveen Raj Singh" />
          </div>
          <TextField label="Project Designer" name="projectDesigner"
            value={project.projectDesigner} onChange={setProj}
            placeholder="e.g. Varsha" />
        </div>

        {/* ── 2. Key Accomplishments ──────────────────────────────────── */}
        <div style={{
          background: "rgba(255,251,248,0.7)", border: `1px solid ${COLORS.lightTaupe}`,
          borderRadius: 16, padding: 24, marginBottom: 24,
        }}>
          {sectionHeader(2, "Project Status — Key Accomplishments")}
          <TextareaField
            label="Summary of today's accomplishments"
            name="accomplishments"
            value={accomplishments}
            onChange={(_, v) => setAccomplishments(v)}
            placeholder="e.g. All base cabinet installation complete. Countertop fitted and sealed. Electrical points verified."
            rows={3}
          />
        </div>

        {/* ── 3. Completed Work ───────────────────────────────────────── */}
        <div style={{
          background: "rgba(255,251,248,0.7)", border: `1px solid ${COLORS.lightTaupe}`,
          borderRadius: 16, padding: 24, marginBottom: 24,
        }}>
          {sectionHeader(3, "Progress Report — Completed Work")}

          {/* Column headers */}
          {completedWork.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: CW_COLS.map(c => c.flex).join(" "),
              gap: 10, marginBottom: 6, paddingRight: 32,
            }}>
              {CW_COLS.map(c => (
                <span key={c.key} style={{
                  fontSize: 11, fontWeight: 600, color: COLORS.mutedBrown,
                  letterSpacing: "0.4px", textTransform: "uppercase",
                }}>
                  {c.label}
                </span>
              ))}
            </div>
          )}

          {completedWork.map((row, i) => (
            <DynamicRow key={i} row={row} index={i}
              onChange={updateCW} onRemove={removeCW}
              columns={CW_COLS} />
          ))}
          <AddRowButton onClick={addCW} label="Add completed work item" />
        </div>

        {/* ── 4. Man Power ────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(255,251,248,0.7)", border: `1px solid ${COLORS.lightTaupe}`,
          borderRadius: 16, padding: 24, marginBottom: 24,
        }}>
          {sectionHeader(4, "Man Power Available for the Day")}

          <ManpowerRow label="Installation Professionals (IPs)"
            countKey="numIPs" inKey="ipInTime" outKey="ipOutTime"
            values={manpower} onChange={setMp} />
          <ManpowerRow label="Helpers"
            countKey="numHelpers" inKey="helperInTime" outKey="helperOutTime"
            values={manpower} onChange={setMp} />
          <ManpowerRow label="Labour"
            countKey="numLabour" inKey="labourInTime" outKey="labourOutTime"
            values={manpower} onChange={setMp} />

          {/* Mandays */}
          <div style={{
            marginTop: 14, display: "flex", alignItems: "center", gap: 14,
            background: "rgba(215,197,170,0.15)",
            border: `1px solid ${COLORS.lightTaupe}`,
            borderRadius: 10, padding: "12px 16px",
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.deepTaupe, flex: 1 }}>
              Total Mandays
            </span>
            <input
              type="number" min="0" step="0.5"
              value={manpower.mandays}
              placeholder="e.g. 4"
              onChange={e => setMp("mandays", e.target.value)}
              style={{
                width: 100, padding: "8px 12px",
                border: `1.5px solid ${COLORS.lightTaupe}`,
                borderRadius: 8, fontSize: 15, fontWeight: 700,
                fontFamily: "Montserrat, sans-serif",
                color: COLORS.darkBrown,
                background: "rgba(255,251,248,0.9)",
                outline: "none", textAlign: "center",
                transition: "border-color 0.2s ease",
              }}
              onFocus={e => (e.target.style.borderColor = COLORS.medBrown)}
              onBlur={e => (e.target.style.borderColor = COLORS.lightTaupe)}
            />
          </div>
        </div>

        {/* ── 5. Upcoming Work ────────────────────────────────────────── */}
        <div style={{
          background: "rgba(255,251,248,0.7)", border: `1px solid ${COLORS.lightTaupe}`,
          borderRadius: 16, padding: 24, marginBottom: 24,
        }}>
          {sectionHeader(5, "Upcoming Work for Next Day")}

          {upcomingWork.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: UW_COLS.map(c => c.flex).join(" "),
              gap: 10, marginBottom: 6, paddingRight: 32,
            }}>
              {UW_COLS.map(c => (
                <span key={c.key} style={{
                  fontSize: 11, fontWeight: 600, color: COLORS.mutedBrown,
                  letterSpacing: "0.4px", textTransform: "uppercase",
                }}>
                  {c.label}
                </span>
              ))}
            </div>
          )}

          {upcomingWork.map((row, i) => (
            <DynamicRow key={i} row={row} index={i}
              onChange={updateUW} onRemove={removeUW}
              columns={UW_COLS} />
          ))}
          <AddRowButton onClick={addUW} label="Add upcoming task" />
        </div>

        {/* ── 6. Pictorial Attachments ─────────────────────────────────── */}
        <div style={{
          background: "rgba(255,251,248,0.7)", border: `1px solid ${COLORS.lightTaupe}`,
          borderRadius: 16, padding: 24, marginBottom: 32,
        }}>
          {sectionHeader(6, "Pictorial Attachments")}
          <PhotoUploadZone
            photos={photos}
            onAdd={addPhotos}
            onRemove={removePhoto}
          />
        </div>

        {/* ── Feedback banners + submit ─────────────────────────────────── */}
        <ErrorBanner message={error} />
        <SuccessBanner show={success} />
        <SubmitButton loading={loading} onClick={handleGenerate} />

      </div>
    </PageLayout>
  );
}