import React, { useState } from 'react';

interface QRPreviewProps {
  qrURL: string;
  label: string;
  onDownload: () => void;
  onCopy?: () => void;
}

const QRPreview: React.FC<QRPreviewProps> = ({ qrURL, label, onDownload, onCopy }) => {
  const [imgError, setImgError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  if (!qrURL) return null;
  return (
    <div className="qr-output">
      <div className="qr-container">
        {!imgError ? (
          <img
            key={reloadKey}
            src={qrURL}
            alt="Generated QR"
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={{ color: '#b71c1c', background: '#ffebee', border: '1px solid #b71c1c', borderRadius: 8, padding: '1rem', margin: '0.5rem 0' }}>
            <p>Failed to load QR image.</p>
            <button onClick={() => { setImgError(false); setReloadKey(k => k + 1); }} style={{ marginTop: 8 }}>Retry</button>
          </div>
        )}
      </div>
      <p className="qr-label">QR for: {label}</p>
      <div className="qr-actions">
        <button onClick={onDownload} className="download-btn" disabled={imgError}>
          Download PNG
        </button>
        {onCopy && (
          <button onClick={onCopy} className="download-btn" style={{ marginLeft: 12 }} disabled={imgError}>
            Copy
          </button>
        )}
      </div>
    </div>
  );
};

export default QRPreview; 