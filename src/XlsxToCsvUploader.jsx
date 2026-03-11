import { useState } from 'react';
import AuthHeader from './AuthHeader';


export default function XLSXConverter() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [outputFiles, setOutputFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.xlsx')) {
      setFile(droppedFile);
      setError("");
    } else {
      setError("Please upload a valid .xlsx file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };


  const handleUpload = async () => {
  if (!file) return;

  setIsUploading(true);

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/process-xlsx`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "File processing failed");
    }

    const blob = await response.blob();

    // Create blob URL
    const blobUrl = window.URL.createObjectURL(blob);

    const generatedFiles = [
      {
        name: "processed_output.xlsx",
        url: blobUrl,
        size: (blob.size / 1024).toFixed(2), // KB
        timestamp: new Date(),
      },
    ];

    setOutputFiles(generatedFiles);

  } catch (error) {
    console.error("Upload Error:", error);
    alert("File processing failed. Please verify the sheet format and try again.");
  } finally {
    setIsUploading(false);
  }
};


  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Nunito+Sans:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Montserrat', Nunito Sans;
        }
        
        .title {
          font-family: 'Montserrat', Nunito Sans;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .floating {
          animation: float 3s ease-in-out infinite;
        }
        
        .upload-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.3) 0%,
            rgba(255,255,255,0.8) 50%,
            rgba(255,255,255,0.3) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        .error-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        .slide-in {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>

   {/* keep all the features in tacked only change the color beause we are allowed to use this color pallets 
this is the list of color you use: #3A1A1A, # 6B4B41, # 9B7C73, #4F372F, #6B4B41, # AF7C71, #D7C5AA, # F1E6DD, #FFFBF8. Give me the updated code  */}
<div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFFBF8 0%, #F1E6DD 50%, #D7C5AA 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px'
      }}>
      
        <div style={{ width: '100%', maxWidth: '672px' }}>
        {/* <AuthHeader style={{ textAlign: 'center', marginBottom: '48px' }}/> */}
          {/* Header with decorative elements */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}>
              <AuthHeader />
            </div>
            <h1 className="title" style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#3A1A1A',
                marginBottom: '12px',
                letterSpacing: '-0.5px'
              }}>
                Modula SO Generator
              </h1>
          </div>

          {/* Main Card */}
          <div style={{
            background: 'rgba(255, 251, 248, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(58,26,26,0.25)',
            border: '1px solid #D7C5AA',
            overflow: 'hidden',
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                rgba(255,255,255,0.03),
                rgba(255,255,255,0.03) 1px,
                transparent 1px,
                transparent 2px
              ),
              repeating-linear-gradient(
                90deg,
                rgba(255,255,255,0.03),
                rgba(255,255,255,0.03) 1px,
                transparent 1px,
                transparent 2px
              )
            `
          }}>
            {/* Upload Area */}
            <div style={{ padding: '40px' }}>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => document.getElementById('fileInput').click()}
                style={{
                  border: isDragging
                    ? '3px dashed #6B4B41'
                    : file
                      ? '3px dashed #AF7C71'
                      : '3px dashed #D7C5AA',
                  borderRadius: '16px',
                  padding: '48px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  background: isDragging 
                    ? 'rgba(107,75,65,0.05)' 
                    : file 
                      ? 'rgba(175,124,113,0.05)' 
                      : 'transparent',
                  transform: isDragging ? 'scale(1.02)' : 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  if (!isDragging && !file) {
                    e.currentTarget.style.borderColor = '#3A1A1A';
                    e.currentTarget.style.background = 'rgba(58,26,26,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDragging && !file) {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <input
                  id="fileInput"
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                
                {!file ? (
                  <div>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      margin: '0 auto 16px',
                      background: 'linear-gradient(135deg, #D7C5AA 0%, #F1E6DD 100%)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                       <svg style={{ width: '40px', height: '40px', color: '#6B4B41' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                    </div>
                    <div>
                      <p style={{
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#4F372F',
                        marginBottom: '8px'
                      }}>
                        Drop your Excel file here
                      </p>
                      <p style={{
                        fontSize: '14px',
                        color: '#9B7C73'
                      }}>
                        or click to browse • .xlsx files only
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      margin: '0 auto 16px',
                      background: 'linear-gradient(135deg, #AF7C71 0%, #9B7C73 100%)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg style={{ width: '40px', height: '40px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#9B7C73',
                        marginBottom: '4px'
                      }}>
                        Selected file
                      </p>
                      <p style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#3A1A1A',
                        wordBreak: 'break-all',
                        padding: '0 16px'
                      }}>
                        {file.name}
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: '#6B4B41',
                        marginTop: '8px'
                      }}>
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className={isUploading ? 'upload-shimmer' : ''}
                style={{
                  width: '100%',
                  marginTop: '32px',
                  padding: '20px 32px',
                  borderRadius: '16px',
                  fontWeight: 600,
                  fontSize: '18px',
                  border: 'none',
                  cursor: !file || isUploading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  background: !file || isUploading
                    ? '#D7C5AA'
                    : 'linear-gradient(90deg, #3A1A1A 0%, #6B4B41 100%)',
                  color: !file || isUploading ? '#9B7C73' : 'white',
                  boxShadow: !file || isUploading
                    ? 'none'
                    : '0 20px 25px -5px rgba(58,26,26,0.3)'
                }}
                onMouseEnter={(e) => {
                  if (file && !isUploading) {
                    e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(58,26,26,0.4)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (file && !isUploading) {
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(58,26,26,0.3)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
                onMouseDown={(e) => {
                  if (file && !isUploading) {
                    e.currentTarget.style.transform = 'scale(0.98)';
                  }
                }}
                onMouseUp={(e) => {
                  if (file && !isUploading) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }
                }}
              >
                {isUploading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <svg className="spinner" style={{ height: '24px', width: '24px' }} fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing your file...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Convert & Download CSV
                  </span>
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div className="error-shake" style={{
                  marginTop: '24px',
                  padding: '20px',
                  borderRadius: '12px',
                  background: '#F1E6DD',
                  border: '2px solid #AF7C71',
                  color: '#3A1A1A'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <svg style={{ width: '24px', height: '24px', color: '#dc2626', flexShrink: 0, marginTop: '2px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p style={{ color: '#991b1b', fontWeight: 500, margin: 0 }}>{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Output Files Section */}
            <div style={{ padding: '0 40px 40px' }}>
              {outputFiles.length > 0 ? (
                <div className="slide-in" style={{
                  background: 'linear-gradient(90deg, #F1E6DD 0%, #D7C5AA 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #AF7C71'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                    <svg style={{ width: '20px', height: '20px', color: '#3A1A1A', flexShrink: 0, marginTop: '2px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div style={{ fontSize: '14px', color: '#4F372F', lineHeight: '1.6', flex: 1 }}>
                      <p style={{ fontWeight: 600, marginBottom: '12px', margin: 0, color: '#3A1A1A' }}>
                        Generated Files ({outputFiles.length})
                      </p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {outputFiles.map((outputFile, index) => (
                          <div 
                            key={index}
                            style={{
                              background: 'white',
                              borderRadius: '10px',
                              padding: '14px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              border: '1px solid rgba(107, 75, 65, 0.20)',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateX(4px)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(107, 75, 65, 0.20)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateX(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                              <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #3A1A1A 0%, #4F372F 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <svg style={{ width: '18px', height: '18px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ 
                                  margin: 0, 
                                  fontWeight: 600, 
                                  color: '#6B4B41',
                                  fontSize: '14px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {outputFile.name}
                                </p>
                                <p style={{ 
                                  margin: '2px 0 0', 
                                  fontSize: '12px', 
                                  color: '#6B4B41' 
                                }}>
                                  {outputFile.size} KB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDownload(outputFile.url, outputFile.name)}
                              style={{
                                background: 'linear-gradient(135deg, #3A1A1A 0%, #4F372F 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '13px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s ease',
                                flexShrink: 0
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(58, 26, 26, 0.35)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'linear-gradient(90deg, #F1E6DD 0%, #D7C5AA 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #AF7C71'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <svg style={{ width: '20px', height: '20px', color: '#3A1A1A', flexShrink: 0, marginTop: '2px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div style={{ fontSize: '14px', color: '#4F372F', lineHeight: '1.6' }}>
                      <p style={{ fontWeight: 600, marginBottom: '8px', margin: 0 }}>File Requirements</p>
                      <p style={{ color: '#4F372F', margin: '8px 0 0' }}>
                        Upload in XLSX format
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

        

    </>
  );
}