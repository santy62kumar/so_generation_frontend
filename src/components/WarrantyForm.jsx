import React, { useState } from "react";
import { Loader2, Search } from "lucide-react";

import PageLayout from "@/components/PageLayout";
import Section from "@/components/ui/Section";
import TextField from "@/components/ui/TextField";
import SubmitButton from "@/components/ui/SubmitButton";
import { Button } from "@/components/ui/button";
import { apiUrl } from "@/api/config";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { downloadFile } from "@/utils/downloadFile";

// ─── Field definitions ────────────────────────────────────────────────────────
// half: true  → render two fields side-by-side (paired with the next half field)
// half: false → full-width row

const FIELDS = [
  { key: "customerName",  label: "Customer Name *",  placeholder: "e.g. John Doe",                         required: true,  half: true  },
  { key: "contactNumber", label: "Contact Number *", placeholder: "e.g. 06205281574",                      required: true,  half: true  },
  { key: "invoiceNumber", label: "Invoice Number *", placeholder: "e.g. INV-78945",                        required: true,  half: true  },
  { key: "distributorName", label: "Distributor Name", placeholder: "e.g. Modula Mumbai",                  required: false, half: true  },
  { key: "address",       label: "Address",          placeholder: "e.g. A/1 House Near Kalanagar Flyover", required: false, half: false },
  { key: "pinCode",       label: "Pin Code",         placeholder: "e.g. 400051",                           required: false, half: true  },
  { key: "handoverDate",  label: "Handover Date",    placeholder: "e.g. 24/06/2026",                       required: false, half: true  },
];

const INITIAL_FIELDS = Object.fromEntries(FIELDS.map(f => [f.key, ""]));

// Group the flat field list into rows of one full-width field or two halves.
const ROWS = FIELDS.reduce((rows, field) => {
  const last = rows[rows.length - 1];
  if (field.half && last?.length === 1 && last[0].half) last.push(field);
  else rows.push([field]);
  return rows;
}, []);

// ─── WarrantyForm ─────────────────────────────────────────────────────────────

export default function WarrantyForm() {
  const [fields,  setFields]  = useState(INITIAL_FIELDS);
  const [soNumber, setSoNumber] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupSuccess, setLookupSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const set = (name, value) => setFields(prev => ({ ...prev, [name]: value }));

  const handleLookup = async () => {
    const value = soNumber.trim();
    if (!value) {
      setError("Enter an SO number to search.");
      return;
    }

    setError("");
    setLookupSuccess("");
    setLookupLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/warranty/so?soNumber=${encodeURIComponent(value)}`));
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "SO lookup failed.");

      setFields(prev => ({
        ...prev,
        ...Object.fromEntries(
          FIELDS
            .filter(field => field.key !== "handoverDate")
            .map(field => [field.key, data[field.key] || ""]),
        ),
      }));
      setSoNumber(data.soNumber || value);
      setLookupSuccess(`Details loaded for ${data.soNumber || value}.`);
    } catch (e) {
      setError(e.message);
    } finally {
      setLookupLoading(false);
    }
  };

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

      const res = await fetch(apiUrl('/generate-warranty'), {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error(await res.text());

      const blobUrl = URL.createObjectURL(await res.blob());
      const safeName = fields.customerName.replace(/\s+/g, "_");
      downloadFile(blobUrl, `Modula_Warranty_Handbook_${safeName}.pdf`);
      URL.revokeObjectURL(blobUrl);
      setSuccess(true);

    } catch (e) {
      setError(`Generation failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="p-10">
        <Section title="Find Sales Order">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <TextField
              className="mb-0"
              label="SO Number"
              name="soNumber"
              value={soNumber}
              onChange={(_, value) => setSoNumber(value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleLookup();
                }
              }}
              placeholder="e.g. S01234"
            />
            <Button
              type="button"
              variant="secondary"
              disabled={lookupLoading}
              onClick={handleLookup}
            >
              {lookupLoading ? <Loader2 className="animate-spin" /> : <Search />}
              {lookupLoading ? "Searching…" : "Search SO"}
            </Button>
          </div>
          {lookupSuccess && (
            <Alert variant="success" className="mt-4">
              <AlertDescription>{lookupSuccess}</AlertDescription>
            </Alert>
          )}
        </Section>

        {error && (
          <Alert variant="destructive" className="mb-6 animate-shake">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Section title="Customer Details">
          {ROWS.map(row => (
            <div
              key={row[0].key}
              className={row.length === 2 ? "grid grid-cols-1 gap-4 sm:grid-cols-2" : undefined}
            >
              {row.map(f => (
                <TextField
                  key={f.key}
                  label={f.label}
                  name={f.key}
                  value={fields[f.key]}
                  onChange={set}
                  placeholder={f.placeholder}
                />
              ))}
            </div>
          ))}
        </Section>

        {success && (
          <Alert variant="success" className="mb-6">
            <AlertDescription>
              Warranty handbook generated and downloaded successfully!
            </AlertDescription>
          </Alert>
        )}

        <SubmitButton
          loading={loading}
          onClick={handleGenerate}
          idleLabel="Generate Warranty Handbook"
          loadingLabel="Generating Warranty Handbook…"
        />
      </div>
    </PageLayout>
  );
}
