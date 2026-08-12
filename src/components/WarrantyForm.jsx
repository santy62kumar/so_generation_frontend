import React, { useState } from "react";
import PageLayout  from "./PageLayout";
import Section     from "./ui/Section";
import TextField   from "./ui/TextField";
import { downloadFile } from "../utils/downloadFile";
import { COLORS, PRIMARY_BTN_STYLE } from "../constants/theme";
import { design_data, sales_data } from "./Data";

// ─── Icons ───────────────────────────────────────────────────────────────────

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

// ─── SubmitButton ─────────────────────────────────────────────────────────────

function SubmitButton({ loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={loading ? "upload-shimmer" : ""}
      style={PRIMARY_BTN_STYLE(loading)}
      onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = "0 25px 50px -12px rgba(58,26,26,0.4)"; e.currentTarget.style.transform = "scale(1.02)"; } }}
      onMouseLeave={e => { if (!loading) { e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(58,26,26,0.3)";  e.currentTarget.style.transform = "scale(1)"; } }}
      onMouseDown={e   => { if (!loading) e.currentTarget.style.transform = "scale(0.98)"; }}
      onMouseUp={e     => { if (!loading) e.currentTarget.style.transform = "scale(1.02)"; }}
    >
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
        {loading
          ? <><SpinnerIcon /> Generating Warranty Card…</>
          : <><DownloadIcon /> Generate Warranty Card</>}
      </span>
    </button>
  );
}

// ─── ErrorBanner ──────────────────────────────────────────────────────────────

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

// ─── SuccessBanner ────────────────────────────────────────────────────────────

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
        Warranty card generated and downloaded successfully!
      </p>
    </div>
  );
}

// ─── InfoNote ─────────────────────────────────────────────────────────────────

function InfoNote({ children }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "12px 16px", borderRadius: 10,
      background: "rgba(212,169,106,0.12)",
      border: "1px solid rgba(212,169,106,0.35)",
      marginBottom: 20,
    }}>
      <svg style={{ width: 18, height: 18, color: COLORS.warmTaupe, flexShrink: 0, marginTop: 1 }}
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p style={{ margin: 0, fontSize: 13, color: COLORS.deepTaupe, lineHeight: 1.6 }}>
        {children}
      </p>
    </div>
  );
}

// ─── Field definitions ────────────────────────────────────────────────────────
// half: true  → render two fields side-by-side (paired with the next half field)
// half: false → full-width row

const FIELDS = [
  // Row 1: Customer Name | Contact Number
  { key: "customerName",  label: "Customer Name *",  placeholder: "e.g. John Doe",                        required: true,  half: true  },
  { key: "contactNumber", label: "Contact Number *", placeholder: "e.g. 06205281574",                      required: true,  half: true  },
  // Row 2: Order ID | Handover Date
  { key: "orderId",       label: "Order ID *",        placeholder: "e.g. 78945",                            required: true,  half: true  },
  { key: "handoverDate",  label: "Handover Date",     placeholder: "e.g. 24/06/2025",                       required: false, half: true  },
  // Row 3: Address (full width)
  { key: "address",       label: "Address",           placeholder: "e.g. A/1 House Near Kalanagar Flyover", required: false, half: false },
  // Row 4: Pin Code | Issued By
  { key: "pinCode",       label: "Pin Code",          placeholder: "e.g. 400051",                           required: false, half: true  },
  { key: "issuedBy",      label: "Issued By",         placeholder: "e.g. Praveen Raj Singh",                required: false, half: true  },
];

const INITIAL_FIELDS = Object.fromEntries(FIELDS.map(f => [f.key, ""]));

// ─── WarrantyForm ─────────────────────────────────────────────────────────────

export default function WarrantyForm() {
  const [fields,  setFields]  = useState(INITIAL_FIELDS);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const set = (name, value) => setFields(prev => ({ ...prev, [name]: value }));

  const handleGenerate = async () => {
    const missing = FIELDS
      .filter(f => f.required && !fields[f.key].trim())
      .map(f => f.label.replace(" *", ""));

    if (missing.length) {
      setError(`Please fill in: ${missing.join(", ")}.`);
      return;
    }

    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const fd = new FormData();
      FIELDS.forEach(f => fd.append(f.key, fields[f.key]));

      const res = await fetch(`${import.meta.env.VITE_API_URL}/generate-warranty`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error(await res.text());

      const blobUrl = URL.createObjectURL(await res.blob());
      const safeName = fields.customerName.replace(/\s+/g, "_");
      downloadFile(blobUrl, `Modula_Warranty_${safeName}.pdf`);
      URL.revokeObjectURL(blobUrl);
      setSuccess(true);

    } catch (e) {
      setError(`Generation failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Lay out fields: full-width or paired halves
  const renderFields = () => {
    const rows = [];
    let i = 0;
    while (i < FIELDS.length) {
      const f = FIELDS[i];
      if (!f.half) {
        rows.push(
          <TextField key={f.key} label={f.label} name={f.key}
            value={fields[f.key]} onChange={set} placeholder={f.placeholder} />
        );
        i++;
      } else {
        const next = FIELDS[i + 1]?.half ? FIELDS[i + 1] : null;
        rows.push(
          <div key={f.key} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <TextField label={f.label} name={f.key}
              value={fields[f.key]} onChange={set} placeholder={f.placeholder} />
            {next
              ? <TextField label={next.label} name={next.key}
                  value={fields[next.key]} onChange={set} placeholder={next.placeholder} />
              : <div />}
          </div>
        );
        i += next ? 2 : 1;
      }
    }
    return rows;
  };

  return (
    <PageLayout>
      <div style={{ padding: 40 }}>

        {/* ── Customer Details ───────────────────────────────────────── */}
        <Section title="Customer Details">
          {/* <InfoNote>
            All details are printed on the warranty card exactly as entered.
            Use the same spelling as the sales order.
          </InfoNote> */}
          {renderFields()}
        </Section>

        {/* ── Live Preview ───────────────────────────────────────────── */}
        

        <ErrorBanner message={error} />
        <SuccessBanner show={success} />
        <SubmitButton loading={loading} onClick={handleGenerate} />

      </div>
    </PageLayout>
  );
}