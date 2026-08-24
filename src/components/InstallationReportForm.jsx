import React, { useState } from "react";
import { Camera, Plus, Trash2, X } from "lucide-react";

import PageLayout from "@/components/PageLayout";
import Dropzone from "@/components/ui/dropzone";
import Section from "@/components/ui/Section";
import SubmitButton from "@/components/ui/SubmitButton";
import TextField from "@/components/ui/TextField";
import TextareaField from "@/components/ui/TextareaField";
import { apiUrl } from "@/api/config";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { downloadFile } from "@/utils/downloadFile";
import { cn } from "@/lib/utils";

// ─── Small shared pieces ──────────────────────────────────────────────────────

/** Column caption above the compact inputs inside a repeating row. */
const ColumnLabel = ({ className, ...props }) => (
  <span
    className={cn(
      "block text-xs font-semibold tracking-[0.4px] text-brand-muted uppercase",
      className
    )}
    {...props}
  />
);

/** The tighter input variant used inside repeating rows. */
const CompactInput = ({ className, ...props }) => (
  <Input className={cn("rounded-md px-2.75 py-2 text-sm", className)} {...props} />
);

function AddRowButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 flex w-full cursor-pointer items-center gap-2 rounded-lg border-[1.5px] border-dashed border-border px-4 py-2.25 font-display text-sm font-semibold text-brand-med transition-colors outline-none hover:border-brand-med hover:bg-brand-med/5 focus-visible:ring-[3px] focus-visible:ring-ring/40"
    >
      <Plus className="size-4" strokeWidth={2.5} />
      {label}
    </button>
  );
}

// ─── Dynamic row (Completed Work / Upcoming Work) ─────────────────────────────

function DynamicRow({ row, index, onChange, onRemove, columns, gridClass }) {
  return (
    <div
      className={cn(
        "relative mb-2.5 grid items-start gap-2.5 rounded-lg border border-border bg-brand-light/8 px-3.5 py-3",
        gridClass
      )}
    >
      {columns.map((col) => (
        <div key={col.key} className="space-y-1.25">
          <ColumnLabel>{col.label}</ColumnLabel>
          <CompactInput
            value={row[col.key] || ""}
            placeholder={col.placeholder || ""}
            aria-label={col.label}
            onChange={(e) => onChange(index, col.key, e.target.value)}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => onRemove(index)}
        aria-label={`Remove row ${index + 1}`}
        title="Remove row"
        className="absolute top-2.5 right-2.5 cursor-pointer rounded-sm p-1 text-brand-muted transition-colors outline-none hover:bg-danger-surface hover:text-danger-accent focus-visible:ring-[3px] focus-visible:ring-ring/40"
      >
        <Trash2 className="size-3.75" />
      </button>
    </div>
  );
}

// ─── Photo upload zone ────────────────────────────────────────────────────────

function PhotoUploadZone({ photos, onAdd, onRemove }) {
  const handleFiles = (files) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length) onAdd(imageFiles);
  };

  return (
    <div>
      <Dropzone
        accept="image/*"
        multiple
        onFiles={handleFiles}
        aria-label="Add site photos"
        className="mb-4 px-6 py-7"
      >
        <span className="mx-auto mb-3 flex size-14 items-center justify-center rounded-xl bg-linear-135 from-brand-light to-brand-blush text-brand-med">
          <Camera aria-hidden="true" className="size-7" strokeWidth={1.6} />
        </span>
        <p className="mb-1 text-base font-semibold text-brand-deep">
          Drop photos here or click to browse
        </p>
        <p className="text-sm text-brand-muted">
          PNG, JPG, WEBP — unlimited photos, one per page in the report
        </p>
      </Dropzone>

      {photos.length > 0 && (
        <>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2.5">
            {photos.map((photo, i) => (
              <li key={photo.preview} className="relative overflow-hidden rounded-lg">
                <img
                  src={photo.preview}
                  alt={photo.file.name}
                  className="block h-22.5 w-full rounded-lg border border-border object-cover"
                />
                <span className="absolute top-1.25 left-1.25 rounded-full bg-brand-dark/75 px-1.75 py-0.5 text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  aria-label={`Remove photo ${i + 1}`}
                  className="absolute top-1.25 right-1.25 flex size-5.5 cursor-pointer items-center justify-center rounded-full bg-danger-accent/85 text-white outline-none hover:bg-danger-accent focus-visible:ring-[3px] focus-visible:ring-ring/40"
                >
                  <X className="size-3.5" strokeWidth={2.5} />
                </button>
                <span className="absolute inset-x-0 bottom-0 truncate bg-linear-0 from-black/60 to-transparent px-1.5 pt-3.5 pb-1.25 text-[9px] text-white">
                  {photo.file.name}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-2.5 text-sm text-brand-muted">
            {photos.length} photo{photos.length !== 1 ? "s" : ""} selected — each appears
            on its own page in the PDF
          </p>
        </>
      )}
    </div>
  );
}

// ─── Manpower row ─────────────────────────────────────────────────────────────

function ManpowerRow({ label, countKey, inKey, outKey, values, onChange }) {
  return (
    <div className="mb-2.5 grid grid-cols-[1.6fr_0.8fr_1.2fr_1.2fr] items-end gap-2.5 rounded-lg border border-border bg-brand-light/8 px-3.5 py-3">
      <div className="space-y-1.25">
        <ColumnLabel>Role</ColumnLabel>
        <p className="flex items-center rounded-md border-[1.5px] border-input bg-brand-light/18 px-2.75 py-2 text-sm font-semibold text-brand-deep">
          {label}
        </p>
      </div>
      <div className="space-y-1.25">
        <ColumnLabel>Count</ColumnLabel>
        <CompactInput
          type="number"
          min="0"
          value={values[countKey] || ""}
          placeholder="0"
          aria-label={`${label} — count`}
          onChange={(e) => onChange(countKey, e.target.value)}
        />
      </div>
      <div className="space-y-1.25">
        <ColumnLabel>In Time</ColumnLabel>
        <CompactInput
          value={values[inKey] || ""}
          placeholder="e.g. 10:30 AM"
          aria-label={`${label} — in time`}
          onChange={(e) => onChange(inKey, e.target.value)}
        />
      </div>
      <div className="space-y-1.25">
        <ColumnLabel>Out Time</ColumnLabel>
        <CompactInput
          value={values[outKey] || ""}
          placeholder="e.g. 6:00 PM"
          aria-label={`${label} — out time`}
          onChange={(e) => onChange(outKey, e.target.value)}
        />
      </div>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

const EMPTY_CW_ROW = () => ({ actionItem: "", date: "", challengesFaced: "" });
const EMPTY_UW_ROW = () => ({ actionItem: "", date: "", potentialIssues: "" });

const CW_COLS = [
  { key: "actionItem",      label: "Action / Work Done", placeholder: "e.g. Installed base cabinets" },
  { key: "date",            label: "Date",               placeholder: "e.g. 25/05/2026" },
  { key: "challengesFaced", label: "Challenges Faced",   placeholder: "e.g. No issues" },
];

const UW_COLS = [
  { key: "actionItem",      label: "Upcoming Task",   placeholder: "e.g. Fix countertop" },
  { key: "date",            label: "Target Date",     placeholder: "e.g. 26/05/2026" },
  { key: "potentialIssues", label: "Potential Issues", placeholder: "e.g. Material pending" },
];

// Both repeating tables share one 2 / 1 / 1.5 column ratio.
const ROW_GRID = "grid-cols-[2fr_1fr_1.5fr]";

/** Column captions rendered once above a repeating table. */
const RowHeader = ({ columns }) => (
  <div className={cn("mb-1.5 grid gap-2.5 pr-8", ROW_GRID)}>
    {columns.map((c) => (
      <ColumnLabel key={c.key}>{c.label}</ColumnLabel>
    ))}
  </div>
);

export default function InstallationReportForm() {
  const [project, setProject] = useState({
    projectName: "",
    reportDate: "",
    projectSupervisor: "",
    projectManager: "",
    projectDesigner: "",
  });
  const [accomplishments, setAccomplishments] = useState("");
  const [completedWork, setCompletedWork] = useState([EMPTY_CW_ROW()]);
  const [manpower, setManpower] = useState({
    numIPs: "", ipInTime: "", ipOutTime: "",
    numHelpers: "", helperInTime: "", helperOutTime: "",
    numLabour: "", labourInTime: "", labourOutTime: "",
    mandays: "",
  });
  const [upcomingWork, setUpcomingWork] = useState([EMPTY_UW_ROW()]);
  const [photos, setPhotos] = useState([]);

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
    const newPhotos = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setPhotos(prev => [...prev, ...newPhotos]);
  };
  const removePhoto = (i) => {
    setPhotos(prev => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

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
      fd.append("completedWork", JSON.stringify(completedWork.filter(r => r.actionItem.trim())));

      // Manpower fields
      Object.entries(manpower).forEach(([k, v]) => fd.append(k, v));

      // Upcoming work — JSON array (filter empty rows)
      fd.append("upcomingWork", JSON.stringify(upcomingWork.filter(r => r.actionItem.trim())));

      // Photos
      photos.forEach(p => fd.append("photos", p.file, p.file.name));

      const res = await fetch(
        apiUrl('/generate-installation-report'),
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

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <PageLayout maxWidth="max-w-4xl">
      <div className="p-10">
        <Section step={1} title="Project Information">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        </Section>

        <Section step={2} title="Project Status — Key Accomplishments">
          <TextareaField
            label="Summary of today's accomplishments"
            name="accomplishments"
            value={accomplishments}
            onChange={(_, v) => setAccomplishments(v)}
            placeholder="e.g. All base cabinet installation complete. Countertop fitted and sealed. Electrical points verified."
          />
        </Section>

        <Section step={3} title="Progress Report — Completed Work">
          {completedWork.length > 0 && <RowHeader columns={CW_COLS} />}
          {completedWork.map((row, i) => (
            <DynamicRow key={i} row={row} index={i} gridClass={ROW_GRID}
              onChange={updateCW} onRemove={removeCW} columns={CW_COLS} />
          ))}
          <AddRowButton onClick={addCW} label="Add completed work item" />
        </Section>

        <Section step={4} title="Man Power Available for the Day">
          <ManpowerRow label="Installation Professionals (IPs)"
            countKey="numIPs" inKey="ipInTime" outKey="ipOutTime"
            values={manpower} onChange={setMp} />
          <ManpowerRow label="Helpers"
            countKey="numHelpers" inKey="helperInTime" outKey="helperOutTime"
            values={manpower} onChange={setMp} />
          <ManpowerRow label="Labour"
            countKey="numLabour" inKey="labourInTime" outKey="labourOutTime"
            values={manpower} onChange={setMp} />

          <div className="mt-3.5 flex items-center gap-3.5 rounded-lg border border-border bg-brand-light/15 px-4 py-3">
            <label htmlFor="mandays" className="flex-1 text-sm font-semibold text-brand-deep">
              Total Mandays
            </label>
            <Input
              id="mandays"
              type="number"
              min="0"
              step="0.5"
              value={manpower.mandays}
              placeholder="e.g. 4"
              onChange={(e) => setMp("mandays", e.target.value)}
              className="w-25 rounded-md px-3 py-2 text-center text-lg font-bold"
            />
          </div>
        </Section>

        <Section step={5} title="Upcoming Work for Next Day">
          {upcomingWork.length > 0 && <RowHeader columns={UW_COLS} />}
          {upcomingWork.map((row, i) => (
            <DynamicRow key={i} row={row} index={i} gridClass={ROW_GRID}
              onChange={updateUW} onRemove={removeUW} columns={UW_COLS} />
          ))}
          <AddRowButton onClick={addUW} label="Add upcoming task" />
        </Section>

        <Section step={6} title="Pictorial Attachments" className="mb-8">
          <PhotoUploadZone photos={photos} onAdd={addPhotos} onRemove={removePhoto} />
        </Section>

        {error && (
          <Alert variant="destructive" className="mb-6 animate-shake">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-6">
            <AlertDescription>
              Installation report generated and downloaded successfully!
            </AlertDescription>
          </Alert>
        )}

        <SubmitButton
          loading={loading}
          onClick={handleGenerate}
          idleLabel="Generate Installation Report"
          loadingLabel="Generating Installation Report…"
        />
      </div>
    </PageLayout>
  );
}
