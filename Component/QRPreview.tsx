import React from 'react';

interface QRPreviewProps {
  qrURL: string;
  label: string;
  onDownload: () => void;
}

const QRPreview: React.FC<QRPreviewProps> = ({ qrURL, label, onDownload }) => {
  if (!qrURL) return null;
  return (
    <div className="qr-output">
      <div className="qr-container">
        <img src={qrURL} alt="Generated QR" />
      </div>
      <p className="qr-label">QR for: {label}</p>
      <div className="qr-actions">
        <button onClick={onDownload} className="download-btn">
          Download PNG
        </button>
      </div>
    </div>
  );
};

export default QRPreview; 