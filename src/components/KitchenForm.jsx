import React, { useState } from "react";

import PageLayout from "@/components/PageLayout";
import ImageCropPanel from "@/components/ImageCropPanel";
import Section from "@/components/ui/Section";
import TextField from "@/components/ui/TextField";
import SelectField from "@/components/ui/SelectField";
import ImageUpload from "@/components/ui/ImageUpload";
import ColorSwatchSelect from "@/components/ui/ColorSwatchSelect";
import FieldGroupLabel from "@/components/ui/FieldGroupLabel";
import SubmitButton from "@/components/ui/SubmitButton";
import { apiUrl } from "@/api/config";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { downloadFile } from "@/utils/downloadFile";
import { CITIES } from "@/constants/cities";
import { KITCHEN_FINISH_FIELDS } from "@/constants/kitchenFinishColors";

// Place the two background assets you sent (6.jpg / 7.jpg) here, or update
// these two import paths to wherever they actually live in the project.
// They must be the SAME files pdfgenerator.py reads from /assets, so the
// preview matches the real PDF pixel-for-pixel.
import layoutSlideBg from "@/assets/slide-backgrounds/6.jpg";
import renderSlideBg from "@/assets/slide-backgrounds/7.jpg";

// Kitchen Finish background varies by how many colors are selected (2-8) —
// one purpose-designed artwork per swatch count, same naming convention as
// pdfgenerator.py's assets/Finishes_image_<n>.jpg. Keyed by count so the
// crop preview always shows the artwork that will actually be used.
import finishSlideBg2 from "@/assets/slide-backgrounds/Finishes_image_2.jpg";
import finishSlideBg3 from "@/assets/slide-backgrounds/Finishes_image_3.jpg";
import finishSlideBg4 from "@/assets/slide-backgrounds/Finishes_image_4.jpg";
import finishSlideBg5 from "@/assets/slide-backgrounds/Finishes_image_5.jpg";
import finishSlideBg6 from "@/assets/slide-backgrounds/Finishes_image_6.jpg";
import finishSlideBg7 from "@/assets/slide-backgrounds/Finishes_image_7.jpg";
import finishSlideBg8 from "@/assets/slide-backgrounds/Finishes_image_8.jpg";
import { design_data, sales_data } from "@/components/Data";

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
      role="radio"
      aria-checked={checked}
      onClick={onClick}
      className={cn(
        "flex flex-1 cursor-pointer items-center gap-2.5 rounded-lg border-2 px-4 py-3 text-left transition-colors outline-none",
        "focus-visible:ring-[3px] focus-visible:ring-ring/40",
        checked ? "border-brand-warm bg-brand-warm/8" : "border-border bg-white hover:border-brand-warm"
      )}
    >
      <span
        className={cn(
          "flex size-4.5 shrink-0 items-center justify-center rounded-full border-2",
          checked ? "border-brand-warm" : "border-border"
        )}
      >
        {checked && <span className="size-2.25 rounded-full bg-brand-warm" />}
      </span>
      <span className="text-sm font-semibold text-brand-deep">{label}</span>
    </button>
  );
}

// ─── ContactPanel ────────────────────────────────────────────────
// Renders the name-select + phone + email block for one person role.

// ─── ContactPanel ────────────────────────────────────────────────
// Renders the name-select + phone + email block for one person role.
// `people` is the list this role draws from: sales_data for the Relations
// Associate, design_data for the Designated Designer.
function ContactPanel({ role, people, nameValue, phoneValue, emailValue, phoneName, emailName, onSelect, onChange }) {
  const label = role === 'relation' ? 'Relations Associate' : 'Designated Designer';
  const emailPlaceholder = role === 'relation' ? 'sales@modula.in' : 'designer@modula.in';

  return (
    <div>
      <FieldGroupLabel>{label}</FieldGroupLabel>

      {/* Name dropdown — auto-fills phone & email */}
      <SelectField
        label="Name"
        name={`${role}Name`}
        value={nameValue}
        onChange={(_, val) => onSelect(role, val)}
        placeholder="-- Select Name --"
        options={people.map(p => ({ value: p.name, label: p.name }))}
      />

      <TextField label="Phone" name={phoneName} value={phoneValue} onChange={onChange} placeholder="+91 98765 43210" />
      <TextField label="Email" name={emailName} value={emailValue} onChange={onChange} placeholder={emailPlaceholder} />
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
  // Mandatory Kitchen Finish reference image, plus 2-8 finish selections.
  // At least one of the four render images is also mandatory.
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
    handleProfile: '',
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

  // Auto-fill phone + email when a contact is selected from the dropdown.
  // Relations Associate comes from sales_data, Designer from design_data,
  // so a name that exists in both lists still resolves to the right row.
  const handleContactSelect = (role, selectedName) => {
    const source = role === 'relation' ? sales_data : design_data;
    const person = source.find(p => p.name === selectedName);
    const prefix = role === 'relation' ? 'relation' : 'designer';
    setFields(prev => ({
      ...prev,
      [`${prefix}Name`]:  selectedName,
      [`${prefix}Phone`]: (person?.phone_name ?? '').trim(),
      [`${prefix}Email`]: (person?.email_id   ?? '').trim(),
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

    // Kitchen Finish image is mandatory.
    if (!fields.kitchenFinishImage) {
      setError('Kitchen Finish image is required.');
      return;
    }

    // At least 2 finish colours must be selected for the mandatory finish page.
    if (selectedFinishCount < MIN_FINISH_COLORS) {
      setError(`Select at least ${MIN_FINISH_COLORS} kitchen finish colors.`);
      return;
    }

    if (selectedFinishCount > MAX_FINISH_COLORS) {
      setError(`You can select at most ${MAX_FINISH_COLORS} kitchen finish colors.`);
      return;
    }

    // At least one out of the four render uploads is mandatory.
    const hasAtLeastOneRender = [
      fields.renderImage0,
      fields.renderImage1,
      fields.renderImage2,
      fields.renderImage3,
    ].some(Boolean);

    if (!hasAtLeastOneRender) {
      setError('Upload at least 1 render image.');
      return;
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

      // Kitchen Finish is mandatory. Only the categories the user picked
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

      const res = await fetch(apiUrl('/generate-pdf'), { method: 'POST', body: fd });
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_2fr_1.5fr]">
          <SelectField label="Title *" name="title" value={fields.title} onChange={set}
            placeholder="Title" options={[{ value: 'MR.', label: 'MR.' }, { value: 'MRS.', label: 'MRS.' }]} />
          <TextField label="Customer Name *" name="customerName" value={fields.customerName}
            onChange={set} placeholder="JOHN DOE" />
          <SelectField label="City *" name="city" value={fields.city} onChange={set}
            placeholder="Select City" options={CITIES} />
        </div>
      </Section>

      {/* Layout Plan */}
      <Section title="Layout Plan">
        
        <div role="radiogroup" aria-label="Number of layout plan images" className="mb-5 flex gap-3">
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
        {/* Kitchen Finish is mandatory and shown before render uploads. */}
        <div className="mb-6 border-b border-dashed border-border pb-5">
          <FieldGroupLabel className="mb-1">Kitchen Finish *</FieldGroupLabel>

          <ImageUpload
            name="kitchenFinishImage"
            onChange={handleKitchenFinishImageSelect}
            display={imageDisplay['kitchenFinishImage']}
          />

          {fields.kitchenFinishImage && (
            <>
              <p className={cn(
                "mt-1 mb-3.5 text-sm font-semibold",
                selectedFinishCount < MIN_FINISH_COLORS ? "text-warning" : "text-brand-muted"
              )}>
                {selectedFinishCount} of {MAX_FINISH_COLORS} colors selected
                {selectedFinishCount < MIN_FINISH_COLORS ? ` — pick at least ${MIN_FINISH_COLORS}` : ''}
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        <FieldGroupLabel className="mb-3.5">Upload Renders * (at least 1, up to 4)</FieldGroupLabel>

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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

          <ContactPanel
            role="relation"
            people={sales_data}
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
            people={design_data}
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

      {error && (
        <Alert variant="destructive" className="mb-6 animate-shake">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <SubmitButton
        loading={loading}
        onClick={handleGenerate}
        idleLabel="Generate PDF"
        loadingLabel="Generating PDF… (5–10 seconds)"
      />
    </>
  );

  // ── Full-screen split editor while a crop is in progress ──────────
  // Deliberately escapes PageLayout's centered column so both halves
  // genuinely fill the viewport instead of being squeezed into it.
  if (cropSession) {
    return (
      <div className="fixed inset-0 z-[2000] flex bg-white">
        <div className="min-w-0 flex-1 overflow-y-auto border-r border-border p-10">
          {formBody}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
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
      <div className="p-10">{formBody}</div>
    </PageLayout>
  );
}