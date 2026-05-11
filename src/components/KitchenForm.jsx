// import React, { useState } from "react";
// import PageLayout   from "./PageLayout";
// import Section      from "./ui/Section";
// import TextField    from "./ui/TextField";
// import SelectField  from "./ui/SelectField";
// import ImageUpload  from "./ui/ImageUpload";
// import { downloadFile } from "../utils/downloadFile";
// import { COLORS, PRIMARY_BTN_STYLE } from "../constants/theme";
// import { CITIES } from "../constants/cities";
// import data from "./Data";

// // ─── ContactPanel ────────────────────────────────────────────────
// // Renders the name-select + phone + email block for one person role.
// function ContactPanel({ role, nameValue, phoneValue, emailValue, phoneName, emailName, onSelect, onChange }) {
//   const label = role === 'relation' ? 'Relations Associate' : 'Designated Designer';
//   const emailPlaceholder = role === 'relation' ? 'name@modula.in' : 'designer@modula.in';

//   return (
//     <div>
//       <p style={{
//         margin: '0 0 12px', fontWeight: 700,
//         color: COLORS.deepTaupe, fontSize: 13,
//         textTransform: 'uppercase', letterSpacing: '0.5px',
//       }}>
//         {label}
//       </p>

//       {/* Name dropdown — auto-fills phone & email */}
//       <SelectField
//         label="Name"
//         name={`${role}Name`}
//         value={nameValue}
//         onChange={(_, val) => onSelect(role, val)}
//         placeholder="-- Select Name --"
//         options={data.map(p => ({ value: p.name, label: p.name }))}
//       />

//       <TextField label="Phone" name={phoneName} value={phoneValue} onChange={onChange} placeholder="+91 98765 43210" />
//       <TextField label="Email" name={emailName} value={emailValue} onChange={onChange} placeholder={emailPlaceholder} />
//     </div>
//   );
// }

// // ─── SubmitButton ────────────────────────────────────────────────
// function SubmitButton({ loading, onClick }) {
//   const SpinnerIcon = () => (
//     <svg className="spinner" style={{ height: 24, width: 24 }} fill="none" viewBox="0 0 24 24">
//       <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//       <path style={{ opacity: 0.75 }} fill="currentColor"
//         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//     </svg>
//   );

//   const DownloadIcon = () => (
//     <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
//         d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//     </svg>
//   );

//   return (
//     <button
//       onClick={onClick}
//       disabled={loading}
//       className={loading ? 'upload-shimmer' : ''}
//       style={PRIMARY_BTN_STYLE(loading)}
//       onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(58,26,26,0.4)'; e.currentTarget.style.transform = 'scale(1.02)'; } }}
//       onMouseLeave={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(58,26,26,0.3)';  e.currentTarget.style.transform = 'scale(1)'; } }}
//       onMouseDown={e  => { if (!loading) e.currentTarget.style.transform = 'scale(0.98)'; }}
//       onMouseUp={e    => { if (!loading) e.currentTarget.style.transform = 'scale(1.02)'; }}
//     >
//       <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
//         {loading ? <><SpinnerIcon /> Generating PDF… (5–10 seconds)</> : <><DownloadIcon /> Generate PDF</>}
//       </span>
//     </button>
//   );
// }

// // ─── ErrorBanner ─────────────────────────────────────────────────
// function ErrorBanner({ message }) {
//   if (!message) return null;
//   return (
//     <div className="error-shake" style={{
//       marginBottom: 24, padding: 20, borderRadius: 12,
//       background: COLORS.blush, border: `2px solid ${COLORS.warmTaupe}`,
//     }}>
//       <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
//         <svg style={{ width: 24, height: 24, color: '#dc2626', flexShrink: 0, marginTop: 2 }}
//           fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
//             d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//         <p style={{ color: '#991b1b', fontWeight: 500, margin: 0 }}>{message}</p>
//       </div>
//     </div>
//   );
// }

// // ─── KitchenPDFForm ───────────────────────────────────────────────
// const INITIAL_FIELDS = {
//   title: '',
//   customerName: '',
//   city: '',
//   layoutImage: [null, null],
//   renderImage0: null,
//   renderImage1: null,
//   renderImage2: null,
//   renderImage3: null,
//   relationName: '',
//   relationPhone: '',
//   relationEmail: '',
//   designerName: '',
//   designerPhone: '',
//   designerEmail: '',
// };

// export default function KitchenPDFForm() {
//   const [fields,  setFields]  = useState(INITIAL_FIELDS);
//   const [loading, setLoading] = useState(false);
//   const [error,   setError]   = useState('');

//   // Generic field setter
//   const set = (name, value) => setFields(prev => ({ ...prev, [name]: value }));

//   // Auto-fill phone + email when a contact is selected from the dropdown
//   const handleContactSelect = (role, selectedName) => {
//     const person = data.find(p => p.name === selectedName);
//     const prefix = role === 'relation' ? 'relation' : 'designer';
//     setFields(prev => ({
//       ...prev,
//       [`${prefix}Name`]:  selectedName,
//       [`${prefix}Phone`]: person?.phone_name ?? '',
//       [`${prefix}Email`]: person?.email_id   ?? '',
//     }));
//   };

//   const handleGenerate = async () => {
//     if (!fields.customerName.trim()) {
//       setError('Customer name is required.');
//       return;
//     }
//     setError('');
//     setLoading(true);

//     try {
//       const fd = new FormData();
//       const textFields = [
//         'title', 'customerName', 'city',
//         'relationName', 'relationPhone', 'relationEmail',
//         'designerName', 'designerPhone', 'designerEmail',
//       ];
//       textFields.forEach(k => fd.append(k, fields[k]));

//       fields.layoutImage.forEach(img => { if (img) fd.append('layoutImage', img); });
//       ['renderImage0', 'renderImage1', 'renderImage2', 'renderImage3']
//         .forEach(k => { if (fields[k]) fd.append(k, fields[k]); });

//       const res = await fetch('http://localhost:3001/api/generate-pdf', { method: 'POST', body: fd });
//       if (!res.ok) throw new Error(await res.text());

//       const blobUrl = URL.createObjectURL(await res.blob());
//       downloadFile(blobUrl, `Modula_design_draft_${fields.customerName.replace(/\s+/g, '_')}.pdf`);
//       URL.revokeObjectURL(blobUrl);

//     } catch (e) {
//       setError(`Generation failed: ${e.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <PageLayout title="Modula Design Draft Generator">
//       <div style={{ padding: 40 }}>

//         {/* Client Details */}
//         <Section title="Client Details">
//           <div style={{ display: 'flex', gap: 16 }}>
//             <div style={{ flex: 1 }}>
//               <SelectField label="Title *" name="title" value={fields.title} onChange={set}
//                 placeholder="Title" options={[{ value: 'MR.', label: 'MR.' }, { value: 'MRS.', label: 'MRS.' }]} />
//             </div>
//             <div style={{ flex: 2 }}>
//               <TextField label="Customer Name *" name="customerName" value={fields.customerName}
//                 onChange={set} placeholder="JOHN DOE" />
//             </div>
//             <div style={{ flex: 1.5 }}>
//               <SelectField label="City *" name="city" value={fields.city} onChange={set}
//                 placeholder="Select City" options={CITIES} />
//             </div>
//           </div>
//         </Section>

//         {/* Layout Plan */}
//         <Section title="Layout Plan">
//           <p style={{ color: COLORS.mutedBrown, fontSize: 13, margin: '0 0 16px' }}>
//             Upload the floor plan / site measurement image.
//           </p>
//           {[0, 1].map(i => (
//             <ImageUpload
//               key={i}
//               label={`Layout Plan Image ${i + 1} (PNG/JPG)`}
//               name={`layoutImage_${i}`}
//               onChange={(_, file) =>
//                 setFields(prev => {
//                   const updated = [...prev.layoutImage];
//                   updated[i] = file;
//                   return { ...prev, layoutImage: updated };
//                 })
//               }
//             />
//           ))}
//         </Section>

//         {/* Renders */}
//         <Section title="Renders (up to 4 images)">
//           {[0, 1, 2, 3].map(i => (
//             <ImageUpload key={i} label={`Render Image ${i + 1}`} name={`renderImage${i}`} onChange={set} />
//           ))}
//         </Section>

//         {/* Contact Details */}
//         <Section title="Contact Details">
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
//             <ContactPanel
//               role="relation"
//               nameValue={fields.relationName}
//               phoneValue={fields.relationPhone}
//               emailValue={fields.relationEmail}
//               phoneName="relationPhone"
//               emailName="relationEmail"
//               onSelect={handleContactSelect}
//               onChange={set}
//             />
//             <ContactPanel
//               role="designer"
//               nameValue={fields.designerName}
//               phoneValue={fields.designerPhone}
//               emailValue={fields.designerEmail}
//               phoneName="designerPhone"
//               emailName="designerEmail"
//               onSelect={handleContactSelect}
//               onChange={set}
//             />
//           </div>
//         </Section>

//         <ErrorBanner message={error} />
//         <SubmitButton loading={loading} onClick={handleGenerate} />

//       </div>
//     </PageLayout>
//   );
// }


import React, { useState } from "react";
import PageLayout   from "./PageLayout";
import Section      from "./ui/Section";
import TextField    from "./ui/TextField";
import SelectField  from "./ui/SelectField";
import ImageUpload  from "./ui/ImageUpload";
import { downloadFile } from "../utils/downloadFile";
import { COLORS, PRIMARY_BTN_STYLE } from "../constants/theme";
import { CITIES } from "../constants/cities";
import data from "./Data";

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

  // Generic field setter
  const set = (name, value) => setFields(prev => ({ ...prev, [name]: value }));

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

  const handleGenerate = async () => {
    if (!fields.customerName.trim()) {
      setError('Customer name is required.');
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

  return (
    <PageLayout>
      <div style={{ padding: 40 }}>

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
          <p style={{ color: COLORS.mutedBrown, fontSize: 13, margin: '0 0 16px' }}>
            Upload the floor plan / site measurement image.
          </p>
          {[0, 1].map(i => (
            <ImageUpload
              key={i}
              label={`Layout Plan Image ${i + 1} (PNG/JPG)`}
              name={`layoutImage_${i}`}
              onChange={(_, file) =>
                setFields(prev => {
                  const updated = [...prev.layoutImage];
                  updated[i] = file;
                  return { ...prev, layoutImage: updated };
                })
              }
            />
          ))}
        </Section>

        {/* Renders */}
        <Section title="Renders (up to 4 images)">
          {[0, 1, 2, 3].map(i => (
            <ImageUpload key={i} label={`Render Image ${i + 1}`} name={`renderImage${i}`} onChange={set} />
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

      </div>
    </PageLayout>
  );
}