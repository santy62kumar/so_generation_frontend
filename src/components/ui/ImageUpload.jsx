import React, { useState } from "react";
import { COLORS } from "../../constants/theme";

/**
 * Drag-and-drop image upload field with preview.
 *
 * Props:
 *  - label    {string}
 *  - name     {string}   unique field key (used as input id)
 *  - onChange (name, file | File[]) => void
 *  - multiple {boolean}  allow multi-file (default false)
 *  - preview  {boolean}  show thumbnail previews (default true)
 */
const ImageUpload = ({ label, name, onChange, multiple = false, preview = true }) => {
  const [previews,   setPreviews]   = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [hasFile,    setHasFile]    = useState(false);
  const [fileNames,  setFileNames]  = useState([]);

  const applyFiles = (files) => {
    onChange(name, multiple ? files : files[0]);
    setHasFile(files.length > 0);
    setFileNames(files.map(f => f.name));
    if (preview) setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const borderColor = isDragging
    ? COLORS.medBrown
    : hasFile
    ? COLORS.warmTaupe
    : COLORS.lightTaupe;

  const bgColor = isDragging
    ? 'rgba(107,75,65,0.05)'
    : hasFile
    ? 'rgba(175,124,113,0.05)'
    : 'rgba(215,197,170,0.1)';

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', marginBottom: 8,
        fontWeight: 600, color: COLORS.deepTaupe,
        fontSize: 13, letterSpacing: '0.3px',
      }}>
        {label}
      </label>

      {/* Drop zone */}
      <div
        onClick={() => document.getElementById(`input-${name}`).click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          applyFiles(Array.from(e.dataTransfer.files));
        }}
        onMouseEnter={(e) => {
          if (!isDragging && !hasFile) {
            e.currentTarget.style.borderColor = COLORS.darkBrown;
            e.currentTarget.style.background   = 'rgba(58,26,26,0.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging && !hasFile) {
            e.currentTarget.style.borderColor = COLORS.lightTaupe;
            e.currentTarget.style.background   = 'rgba(215,197,170,0.1)';
          }
        }}
        style={{
          border: `2px dashed ${borderColor}`,
          borderRadius: 12,
          padding: '16px 20px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: bgColor,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <input
          id={`input-${name}`}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          multiple={multiple}
          onChange={e => applyFiles(Array.from(e.target.files))}
          style={{ display: 'none' }}
        />

        {/* Icon */}
        <div style={{
          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
          background: hasFile
            ? `linear-gradient(135deg, ${COLORS.warmTaupe} 0%, ${COLORS.mutedBrown} 100%)`
            : `linear-gradient(135deg, ${COLORS.lightTaupe} 0%, ${COLORS.blush} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {hasFile ? (
            <svg style={{ width: 18, height: 18, color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg style={{ width: 18, height: 18, color: COLORS.medBrown }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        {/* Label text */}
        <div>
          {hasFile ? (
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: COLORS.darkBrown }}>
              {fileNames.join(', ')}
            </p>
          ) : (
            <>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: COLORS.deepTaupe }}>
                Drop image or click to browse
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: COLORS.mutedBrown }}>PNG, JPG, SVG</p>
            </>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {previews.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {previews.map((url, i) => (
            <img key={i} src={url} alt=""
              style={{ width: 80, height: 50, objectFit: 'cover',
                       border: `1px solid ${COLORS.lightTaupe}`, borderRadius: 6 }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;