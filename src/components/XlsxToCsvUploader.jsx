import React, { useState } from 'react';
import PageLayout from './PageLayout';
import { downloadFile } from '../utils/downloadFile';
import { COLORS, PRIMARY_BTN_STYLE } from '../constants/theme';

// ─── XLSXConverter ───────────────────────────────────────────────
export default function XLSXConverter() {
  const [file,        setFile]        = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error,       setError]       = useState('');
  const [isDragging,  setIsDragging]  = useState(false);
  const [outputFiles, setOutputFiles] = useState([]);

  // ── File selection ────────────────────────────────────────────
  const acceptFile = (f) => {
    if (f && f.name.endsWith('.xlsx')) {
      setFile(f);
      setError('');
    } else {
      setError('Please upload a valid .xlsx file');
    }
  };

  const handleFileChange = (e) => acceptFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    acceptFile(e.dataTransfer.files[0]);
  };

  // ── Upload & process ──────────────────────────────────────────
  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/process-xlsx`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(await response.text() || 'File processing failed');

      const blob    = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      setOutputFiles([{
        name:      'processed_output.xlsx',
        url:       blobUrl,
        size:      (blob.size / 1024).toFixed(2),
        timestamp: new Date(),
      }]);

    } catch (err) {
      console.error('Upload Error:', err);
      setError('File processing failed. Please verify the sheet format and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <PageLayout title="SO Generator" maxWidth={672}>

      {/* ── Upload area ────────────────────────────────────── */}
      <div style={{ padding: '40px 40px 0' }}>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('xlsx-input').click()}
          style={{
            border: `2px dashed ${isDragging ? COLORS.medBrown : file ? COLORS.warmTaupe : COLORS.lightTaupe}`,
            borderRadius: 16,
            padding: '40px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: 24,
            transition: 'all 0.3s ease',
            background: isDragging ? 'rgba(107,75,65,0.05)' : 'rgba(215,197,170,0.1)',
          }}
        >
          <input
            id="xlsx-input"
            type="file"
            accept=".xlsx"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <svg style={{ width: 48, height: 48, color: COLORS.warmTaupe, margin: '0 auto 16px' }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>

          {file ? (
            <p style={{ margin: 0, fontWeight: 600, color: COLORS.darkBrown }}>{file.name}</p>
          ) : (
            <>
              <p style={{ margin: '0 0 4px', fontWeight: 600, color: COLORS.deepTaupe }}>
                Drop your XLSX file here, or click to browse
              </p>
              <p style={{ margin: 0, fontSize: 13, color: COLORS.mutedBrown }}>.xlsx files only</p>
            </>
          )}
        </div>

        {/* Process button */}
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={isUploading ? 'upload-shimmer' : ''}
          style={PRIMARY_BTN_STYLE(!file || isUploading)}
          onMouseEnter={e => { if (file && !isUploading) { e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(58,26,26,0.4)'; e.currentTarget.style.transform = 'scale(1.02)'; } }}
          onMouseLeave={e => { if (file && !isUploading) { e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(58,26,26,0.3)';  e.currentTarget.style.transform = 'scale(1)'; } }}
          onMouseDown={e  => { if (file && !isUploading) e.currentTarget.style.transform = 'scale(0.98)'; }}
          onMouseUp={e    => { if (file && !isUploading) e.currentTarget.style.transform = 'scale(1.02)'; }}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            {isUploading ? (
              <>
                <svg className="spinner" style={{ height: 24, width: 24 }} fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path style={{ opacity: 0.75 }} fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing your file…
              </>
            ) : (
              <>
                <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Convert &amp; Download
              </>
            )}
          </span>
        </button>

        {/* Error */}
        {error && (
          <div className="error-shake" style={{
            marginTop: 24, padding: 20, borderRadius: 12,
            background: COLORS.blush, border: `2px solid ${COLORS.warmTaupe}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <svg style={{ width: 24, height: 24, color: '#dc2626', flexShrink: 0, marginTop: 2 }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p style={{ color: '#991b1b', fontWeight: 500, margin: 0 }}>{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Output / info panel ─────────────────────────────── */}
      <div style={{ padding: '24px 40px 40px' }}>
        <div style={{
          background: `linear-gradient(90deg, ${COLORS.blush} 0%, ${COLORS.lightTaupe} 100%)`,
          borderRadius: 16, padding: 24, border: `1px solid ${COLORS.warmTaupe}`,
        }}>
          {outputFiles.length > 0 ? (
            // Generated file list
            <div className="slide-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <svg style={{ width: 20, height: 20, color: COLORS.darkBrown, flexShrink: 0 }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p style={{ fontWeight: 600, margin: 0, color: COLORS.darkBrown }}>
                  Generated Files ({outputFiles.length})
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {outputFiles.map((f, i) => (
                  <div key={i} style={{
                    background: 'white', borderRadius: 10, padding: '14px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    border: `1px solid rgba(107,75,65,0.2)`, transition: 'all 0.2s ease',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(107,75,65,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)';   e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                        background: `linear-gradient(135deg, ${COLORS.darkBrown} 0%, ${COLORS.deepTaupe} 100%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg style={{ width: 18, height: 18, color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 600, color: COLORS.medBrown, fontSize: 14,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {f.name}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: COLORS.medBrown }}>{f.size} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadFile(f.url, f.name)}
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.darkBrown} 0%, ${COLORS.deepTaupe} 100%)`,
                        border: 'none', borderRadius: 8, padding: '8px 16px',
                        color: 'white', fontWeight: 600, fontSize: 13,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                        transition: 'all 0.2s ease', flexShrink: 0,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(58,26,26,0.35)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Empty state / requirements
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <svg style={{ width: 20, height: 20, color: COLORS.darkBrown, flexShrink: 0, marginTop: 2 }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div style={{ fontSize: 14, color: COLORS.deepTaupe, lineHeight: '1.6' }}>
                <p style={{ fontWeight: 600, margin: '0 0 8px' }}>File Requirements</p>
                <p style={{ margin: 0 }}>Upload in XLSX format</p>
              </div>
            </div>
          )}
        </div>
      </div>

    </PageLayout>
  );
}