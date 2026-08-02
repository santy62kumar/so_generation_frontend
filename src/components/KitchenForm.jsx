import React, { useState } from "react";
import PageLayout   from "./PageLayout";
import Section      from "./ui/Section";
import TextField    from "./ui/TextField";
import SelectField  from "./ui/SelectField";
import ImageUpload  from "./ui/ImageUpload";
import ColorSwatchSelect from "./ui/ColorSwatchSelect";
import ImageCropPanel from "./ImageCropPanel";
import { downloadFile } from "../utils/downloadFile";
import { COLORS, PRIMARY_BTN_STYLE } from "../constants/theme";
import { CITIES } from "../constants/cities";
import { KITCHEN_FINISH_FIELDS } from "../constants/kitchenFinishColors";
import data from "./Data";

// Place the two background assets you sent (6.jpg / 7.jpg) here, or update
// these two import paths to wherever they actually live in the project.
// They must be the SAME files pdfgenerator.py reads from /assets, so the
// preview matches the real PDF pixel-for-pixel.
import layoutSlideBg from "../assets/slide-backgrounds/6.jpg";
import renderSlideBg from "../assets/slide-backgrounds/7.jpg";

// Kitchen Finish background varies by how many colors are selected (2-8) —
// one purpose-designed artwork per swatch count, same naming convention as
// pdfgenerator.py's assets/Finishes_image_<n>.jpg. Keyed by count so the
// crop preview always shows the artwork that will actually be used.
import finishSlideBg2 from "../assets/slide-backgrounds/Finishes_image_2.jpg";
import finishSlideBg3 from "../assets/slide-backgrounds/Finishes_image_3.jpg";
import finishSlideBg4 from "../assets/slide-backgrounds/Finishes_image_4.jpg";
import finishSlideBg5 from "../assets/slide-backgrounds/Finishes_image_5.jpg";
import finishSlideBg6 from "../assets/slide-backgrounds/Finishes_image_6.jpg";
import finishSlideBg7 from "../assets/slide-backgrounds/Finishes_image_7.jpg";
import finishSlideBg8 from "../assets/slide-backgrounds/Finishes_image_8.jpg";

const FINISH_SLIDE_BG_BY_COUNT = {
  2: finishSlideBg2, 3: finishSlideBg3, 4: finishSlideBg4, 5: finishSlideBg5,
  6: finishSlideBg6, 7: finishSlideBg7, 8: finishSlideBg8,
};

// ─── Crop slot geometry ────────────────────────────────────────────
// Mirrors pdfgenerator.py exactly (SLIDE_W=1456, SLIDE_H=816):
//  - render slot:            top:125 left:55  w:1130 h:635
//  - layout slot (1 image):  grid_top:125 grid_left:50 w:1130 h:640
//  - layout slot (2 images): each half, split at grid_left + grid_w/2
//  - kitchen finish ref-photo slot: same box for every swatch-count
//    variant (only the swatch row below it changes) — mirrors
//    pdfgenerator.py's REF_IMG_BOX
const RENDER_SLOT = { x: 55, y: 125, w: 1130, h: 635 };
const LAYOUT_SLOT_SINGLE = { x: 50, y: 125, w: 1130, h: 640 };
const LAYOUT_SLOT_HALVES = [
  { x: 50,  y: 125, w: 565, h: 640 },
  { x: 615, y: 125, w: 565, h: 640 },
];
const KITCHEN_FINISH_SLOT = { x: 299, y: 97, w: 854, h: 421 };
const MIN_FINISH_COLORS = 2;
const MAX_FINISH_COLORS = 8;

function layoutSlotFor(index, layoutCount) {
  return layoutCount === 1 ? LAYOUT_SLOT_SINGLE : LAYOUT_SLOT_HALVES[index];
}

// ─── RadioCard ─────────────────────────────────────────────────────
// Simple selectable card styled to match the rest of the form, used for
// the "1 image or 2 images" layout-plan choice.
function RadioCard({ label, checked, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 16px', borderRadius: 10,
        border: `2px solid ${checked ? COLORS.warmTaupe : COLORS.lightTaupe}`,
        background: checked ? 'rgba(175,124,113,0.08)' : '#fff',
        cursor: 'pointer', textAlign: 'left',
      }}
    >
      <span style={{
        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${checked ? COLORS.warmTaupe : COLORS.lightTaupe}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {checked && <span style={{ width: 9, height: 9, borderRadius: '50%', background: COLORS.warmTaupe }} />}
      </span>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.deepTaupe }}>{label}</span>
    </button>
  );
}

// ─── ContactPanel ────────────────────────────────────────────────
// Renders the name-select + phone + email block for one person role.
function ContactPanel({ role, nameValue, phoneValue, emailValue, phoneName, emailName, onSelect, onChange }) {
  const label = role === 'relation' ? 'Relations Associate' : 'Designated Designer';
  const emailPlaceholder = role === 'relation' ? 'name@modula.in' : 'designer@modula.in';

  return (
    <div>
      <p style={{
        margin: '0 0 12px', fontWeight: 700,
        color: COLORS.deepTaupe, fontSize: 13,
        textTransform: 'uppercase', letterSpacing: '0.5px',
      }}>
        {label}
      </p>

      {/* Name dropdown — auto-fills phone & email */}
      <SelectField
        label="Name"
        name={`${role}Name`}
        value={nameValue}
        onChange={(_, val) => onSelect(role, val)}
        placeholder="-- Select Name --"
        options={data.map(p => ({ value: p.name, label: p.name }))}
      />

      <TextField label="Phone" name={phoneName} value={phoneValue} onChange={onChange} placeholder="+91 98765 43210" />
      <TextField label="Email" name={emailName} value={emailValue} onChange={onChange} placeholder={emailPlaceholder} />
    </div>
  );
}

// ─── SubmitButton ────────────────────────────────────────────────
function SubmitButton({ loading, onClick }) {
  const SpinnerIcon = () => (
    <svg className="spinner" style={{ height: 24, width: 24 }} fill="none" viewBox="0 0 24 24">
      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path style={{ opacity: 0.75 }} fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  const DownloadIcon = () => (
    <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={loading ? 'upload-shimmer' : ''}
      style={PRIMARY_BTN_STYLE(loading)}
      onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(58,26,26,0.4)'; e.currentTarget.style.transform = 'scale(1.02)'; } }}
      onMouseLeave={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(58,26,26,0.3)';  e.currentTarget.style.transform = 'scale(1)'; } }}
      onMouseDown={e  => { if (!loading) e.currentTarget.style.transform = 'scale(0.98)'; }}
      onMouseUp={e    => { if (!loading) e.currentTarget.style.transform = 'scale(1.02)'; }}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        {loading ? <><SpinnerIcon /> Generating PDF… (5–10 seconds)</> : <><DownloadIcon /> Generate PDF</>}
      </span>
    </button>
  );
}

// ─── ErrorBanner ─────────────────────────────────────────────────
function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="error-shake" style={{
      marginBottom: 24, padding: 20, borderRadius: 12,
      background: COLORS.blush, border: `2px solid ${COLORS.warmTaupe}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <svg style={{ width: 24, height: 24, color: '#dc2626', flexShrink: 0, marginTop: 2 }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p style={{ color: '#991b1b', fontWeight: 500, margin: 0 }}>{message}</p>
      </div>
    </div>
  );
}

// ─── KitchenPDFForm ───────────────────────────────────────────────
const INITIAL_FIELDS = {
  title: '',
  customerName: '',
  city: '',
  layoutImage: [null, null],
  renderImage0: null,
  renderImage1: null,
  renderImage2: null,
  renderImage3: null,
  // 5th field in the render section — optional reference photo the color
  // finishes are called out from, plus up to 8 optional finish selections
  // (2-8 required only if the reference image is uploaded).
  kitchenFinishImage: null,
  kitchenFinishColors: {
    lowerCabinet: '',
    upperCabinet: '',
    loftUnit: '',
    glassColor: '',
    golaColor: '',
    skirtingColor: '',
    openShelf: '',
    tallTower: '',
  },
  relationName: '',
  relationPhone: '',
  relationEmail: '',
  designerName: '',
  designerPhone: '',
  designerEmail: '',
};

export default function KitchenPDFForm() {
  const [fields,  setFields]  = useState(INITIAL_FIELDS);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  // Holds the raw file + target geometry while the user is cropping.
  // Shape: { fieldKey, label, backgroundSrc, slot, apply(file), previousDisplay }
  const [cropSession, setCropSession] = useState(null);

  // Controlled thumbnail state for each ImageUpload instance, keyed by the
  // `name` prop passed to that ImageUpload (e.g. "renderImage0",
  // "layoutImage_0"). Lets us show the *cropped* result instead of the raw
  // dropped file, and revert cleanly if the user cancels a crop.
  const [imageDisplay, setImageDisplay] = useState({});

  // How many layout-plan images the user has committed to (1 = full-width
  // slot, 2 = the slot split in half). Chosen up front via RadioCard so the
  // crop target is known before the first upload, instead of guessing from
  // whether the other slot happens to be filled.
  const [layoutCount, setLayoutCount] = useState(1);

  const setDisplay = (fieldKey, url, name) => {
    setImageDisplay(prev => ({
      ...prev,
      [fieldKey]: { url, name, rev: (prev[fieldKey]?.rev ?? 0) + 1 },
    }));
  };

  const handleLayoutCountChange = count => {
    setLayoutCount(count);
    // Switching back to 1 retires the second slot — clear its data and
    // thumbnail so a stale image isn't silently submitted.
    if (count === 1 && fields.layoutImage[1]) {
      setFields(prev => ({ ...prev, layoutImage: [prev.layoutImage[0], null] }));
      if (imageDisplay['layoutImage_1']?.url) URL.revokeObjectURL(imageDisplay['layoutImage_1'].url);
      setDisplay('layoutImage_1', null, null);
    }
  };

  // Generic field setter
  const set = (name, value) => setFields(prev => ({ ...prev, [name]: value }));

  // Setter for the nested kitchenFinishColors sub-object
  const setFinishColor = (key, value) =>
    setFields(prev => ({ ...prev, kitchenFinishColors: { ...prev.kitchenFinishColors, [key]: value } }));

  // How many of the 8 finish categories currently have a color picked.
  // Drives: which Finishes_image_<n>.jpg artwork is shown/used, and the
  // min-2/max-8 validation on submit.
  const selectedFinishCount = KITCHEN_FINISH_FIELDS.filter(f => fields.kitchenFinishColors[f.key]).length;

  // Auto-fill phone + email when a contact is selected from the dropdown
  const handleContactSelect = (role, selectedName) => {
    const person = data.find(p => p.name === selectedName);
    const prefix = role === 'relation' ? 'relation' : 'designer';
    setFields(prev => ({
      ...prev,
      [`${prefix}Name`]:  selectedName,
      [`${prefix}Phone`]: person?.phone_name ?? '',
      [`${prefix}Email`]: person?.email_id   ?? '',
    }));
  };

  // Opens the crop panel for a raw file instead of storing it directly.
  // `applyFn` is called with the final cropped File once the user confirms.
  // `fieldKey` must match the `name` prop of the ImageUpload instance so
  // we can drive its thumbnail via the controlled `display` prop.
  const startCrop = ({ fieldKey, file, label, backgroundSrc, slot, applyFn }) => {
    if (!file) return;
    setCropSession({
      fieldKey,
      file,
      label,
      backgroundSrc,
      slot,
      apply: applyFn,
      // Snapshot whatever was committed before, so Cancel can restore it
      // instead of leaving the raw (uncropped) drop-preview showing.
      previousDisplay: imageDisplay[fieldKey] ?? null,
    });
  };

  const handleRenderImageSelect = (name, file) => {
    startCrop({
      fieldKey: name,
      file,
      label: `Render Image ${Number(name.slice(-1)) + 1}`,
      backgroundSrc: renderSlideBg,
      slot: RENDER_SLOT,
      applyFn: croppedFile => set(name, croppedFile),
    });
  };

  const handleLayoutImageSelect = (index, file) => {
    startCrop({
      fieldKey: `layoutImage_${index}`,
      file,
      label: layoutCount === 1 ? 'Layout Plan Image' : `Layout Plan Image ${index + 1}`,
      backgroundSrc: layoutSlideBg,
      slot: layoutSlotFor(index, layoutCount),
      applyFn: croppedFile =>
        setFields(prev => {
          const updated = [...prev.layoutImage];
          updated[index] = croppedFile;
          return { ...prev, layoutImage: updated };
        }),
    });
  };

  // Kitchen Finish reference image — now uses the same crop-panel flow as
  // the render images. The preview background is whichever
  // Finishes_image_<n>.jpg artwork matches the CURRENT number of selected
  // colors (defaulting to the 2-swatch variant before any colors are
  // picked yet, since the photo frame is assumed identical across every
  // count variant — see KITCHEN_FINISH_SLOT).
  const handleKitchenFinishImageSelect = (name, file) => {
    startCrop({
      fieldKey: 'kitchenFinishImage',
      file,
      // label: 'Kitchen Finish Reference Image',
      backgroundSrc: FINISH_SLIDE_BG_BY_COUNT[selectedFinishCount] || finishSlideBg2,
      slot: KITCHEN_FINISH_SLOT,
      applyFn: croppedFile => set('kitchenFinishImage', croppedFile),
    });
  };

  const handleCropApply = croppedFile => {
    if (!cropSession) return;
    const { fieldKey, apply, previousDisplay } = cropSession;
    const url = URL.createObjectURL(croppedFile);
    apply(croppedFile);
    setDisplay(fieldKey, url, croppedFile.name);
    if (previousDisplay?.url) URL.revokeObjectURL(previousDisplay.url);
    setCropSession(null);
  };

  const handleCropCancel = () => {
    if (!cropSession) return;
    const { fieldKey, previousDisplay } = cropSession;
    setDisplay(fieldKey, previousDisplay?.url ?? null, previousDisplay?.name ?? null);
    setCropSession(null);
  };

  const handleGenerate = async () => {
    if (!fields.customerName.trim()) {
      setError('Customer name is required.');
      return;
    }

    // ── Kitchen Finish is entirely optional. But if a reference image WAS
    // uploaded, between 2 and 8 of the 8 color categories must be picked
    // (any subset — none are individually required). ──
    if (fields.kitchenFinishImage) {
      if (selectedFinishCount < MIN_FINISH_COLORS) {
        setError(`Select at least ${MIN_FINISH_COLORS} kitchen finish colors, or remove the reference image.`);
        return;
      }
      if (selectedFinishCount > MAX_FINISH_COLORS) {
        setError(`You can select at most ${MAX_FINISH_COLORS} kitchen finish colors.`);
        return;
      }
    }

    setError('');
    setLoading(true);

    try {
      const fd = new FormData();
      const textFields = [
        'title', 'customerName', 'city',
        'relationName', 'relationPhone', 'relationEmail',
        'designerName', 'designerPhone', 'designerEmail',
      ];
      textFields.forEach(k => fd.append(k, fields[k]));

      fields.layoutImage.forEach(img => { if (img) fd.append('layoutImage', img); });
      ['renderImage0', 'renderImage1', 'renderImage2', 'renderImage3']
        .forEach(k => { if (fields[k]) fd.append(k, fields[k]); });

      // Kitchen Finish — entirely optional. Only sent when a reference
      // image was uploaded; only the categories the user actually picked
      // a color for are included (2-8 of the 8 possible keys), alongside
      // their display names so the PDF can print "<Category>" / "<Finish
      // name>" under each swatch without a backend catalog lookup.
      if (fields.kitchenFinishImage) {
        const selectedColors = {};
        const selectedNames = {};
        KITCHEN_FINISH_FIELDS.forEach(f => {
          const value = fields.kitchenFinishColors[f.key];
          if (!value) return;
          selectedColors[f.key] = value;
          const opt = f.groups.flatMap(g => g.options).find(o => o.value === value);
          selectedNames[f.key] = opt?.name || '';
        });
        fd.append('kitchenFinishImage', fields.kitchenFinishImage);
        fd.append('kitchenFinishColors', JSON.stringify(selectedColors));
        fd.append('kitchenFinishColorNames', JSON.stringify(selectedNames));
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/generate-pdf`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());

      const blobUrl = URL.createObjectURL(await res.blob());
      downloadFile(blobUrl, `Modula_design_draft_${fields.customerName.replace(/\s+/g, '_')}.pdf`);
      URL.revokeObjectURL(blobUrl);

    } catch (e) {
      setError(`Generation failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Shared form content — rendered either inside the normal PageLayout
  // (default) or inside the full-screen split editor (while cropping).
  const formBody = (
    <>
      {/* Client Details */}
      <Section title="Client Details">
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <SelectField label="Title *" name="title" value={fields.title} onChange={set}
              placeholder="Title" options={[{ value: 'MR.', label: 'MR.' }, { value: 'MRS.', label: 'MRS.' }]} />
          </div>
          <div style={{ flex: 2 }}>
            <TextField label="Customer Name *" name="customerName" value={fields.customerName}
              onChange={set} placeholder="JOHN DOE" />
          </div>
          <div style={{ flex: 1.5 }}>
            <SelectField label="City *" name="city" value={fields.city} onChange={set}
              placeholder="Select City" options={CITIES} />
          </div>
        </div>
      </Section>

      {/* Layout Plan */}
      <Section title="Layout Plan">
        <p style={{
          margin: '0 0 10px', fontWeight: 700, color: COLORS.deepTaupe,
          fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '0.4px',
        }}>
          layout images Count?
        </p>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <RadioCard
            label="1 Image (Full Width)"
            checked={layoutCount === 1}
            onClick={() => handleLayoutCountChange(1)}
          />
          <RadioCard
            label="2 Images (Side by Side)"
            checked={layoutCount === 2}
            onClick={() => handleLayoutCountChange(2)}
          />
        </div>

        {layoutCount === 1 ? (
          <ImageUpload
            label="Layout Plan Image (PNG/JPG)"
            name="layoutImage_0"
            onChange={(_, file) => handleLayoutImageSelect(0, file)}
            display={imageDisplay['layoutImage_0']}
          />
        ) : (
          [0, 1].map(i => (
            <ImageUpload
              key={i}
              label={`Layout Plan Image ${i + 1} (PNG/JPG)`}
              name={`layoutImage_${i}`}
              onChange={(_, file) => handleLayoutImageSelect(i, file)}
              display={imageDisplay[`layoutImage_${i}`]}
            />
          ))
        )}
      </Section>

      {/* Renders — Kitchen Finish first, followed by 4 render uploads */}
      <Section title="Renders">
        {/* ── Kitchen Finish — entirely optional. Uploading the reference
            image unlocks color selection (2-8 of the 8 categories,
            any subset). This block is intentionally shown before renders. ── */}
        <div style={{
          marginBottom: 24, paddingBottom: 20,
          borderBottom: `1px dashed ${COLORS.lightTaupe}`,
        }}>
          <p style={{
            margin: '0 0 4px', fontWeight: 700, color: COLORS.deepTaupe,
            fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.4px',
          }}>
            Kitchen Finish
          </p>
          {/* <p style={{ margin: '0 0 14px', fontSize: 12.5, color: COLORS.mutedBrown }}>
            Upload a reference image to add a "Kitchen Color Finishes Used" slide.
            Once uploaded, pick between {MIN_FINISH_COLORS} and {MAX_FINISH_COLORS} finish colors —
            you don't need to fill in every category.
          </p> */}

          <ImageUpload
            // label="Kitchen Finish Reference Image"
            name="kitchenFinishImage"
            onChange={handleKitchenFinishImageSelect}
            display={imageDisplay['kitchenFinishImage']}
          />

          {fields.kitchenFinishImage && (
            <>
              <p style={{
                margin: '4px 0 14px', fontSize: 12.5, fontWeight: 600,
                color: selectedFinishCount < MIN_FINISH_COLORS ? '#b45309' : COLORS.mutedBrown,
              }}>
                {selectedFinishCount} of {MAX_FINISH_COLORS} colors selected
                {selectedFinishCount < MIN_FINISH_COLORS ? ` — pick at least ${MIN_FINISH_COLORS}` : ''}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {KITCHEN_FINISH_FIELDS.map(f => (
                  <ColorSwatchSelect
                    key={f.key}
                    label={f.label}
                    name={f.key}
                    value={fields.kitchenFinishColors[f.key]}
                    onChange={(_, val) => setFinishColor(f.key, val)}
                    groups={f.groups}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <p style={{
          margin: '0 0 14px', fontWeight: 700, color: COLORS.deepTaupe,
          fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.4px',
        }}>
          Upload Renders
        </p>

        {[0, 1, 2, 3].map(i => (
          <ImageUpload
            key={i}
            label={`Render Image ${i + 1}`}
            name={`renderImage${i}`}
            onChange={handleRenderImageSelect}
            display={imageDisplay[`renderImage${i}`]}
          />
        ))}
      </Section>

      {/* Contact Details */}
      <Section title="Contact Details">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <ContactPanel
            role="relation"
            nameValue={fields.relationName}
            phoneValue={fields.relationPhone}
            emailValue={fields.relationEmail}
            phoneName="relationPhone"
            emailName="relationEmail"
            onSelect={handleContactSelect}
            onChange={set}
          />
          <ContactPanel
            role="designer"
            nameValue={fields.designerName}
            phoneValue={fields.designerPhone}
            emailValue={fields.designerEmail}
            phoneName="designerPhone"
            emailName="designerEmail"
            onSelect={handleContactSelect}
            onChange={set}
          />
        </div>
      </Section>

      <ErrorBanner message={error} />
      <SubmitButton loading={loading} onClick={handleGenerate} />
    </>
  );

  // ── Full-screen split editor while a crop is in progress ──────────
  // Deliberately escapes PageLayout's centered column so both halves
  // genuinely fill the viewport instead of being squeezed into it.
  if (cropSession) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        display: 'flex', background: '#fff',
      }}>
        <div style={{
          flex: 1, minWidth: 0, overflowY: 'auto',
          padding: 40, borderRight: `1px solid ${COLORS.lightTaupe}`,
        }}>
          {formBody}
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <ImageCropPanel
            file={cropSession.file}
            label={cropSession.label}
            backgroundSrc={cropSession.backgroundSrc}
            slot={cropSession.slot}
            onApply={handleCropApply}
            onCancel={handleCropCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      <div style={{ padding: 40 }}>
        {formBody}
      </div>
    </PageLayout>
  );
}