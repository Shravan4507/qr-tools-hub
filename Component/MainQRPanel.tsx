import { useState } from 'react';
import QRCode from 'qrcode.react';
import './MainQRPanel.css';

export default function MainQRPanel() {
  const [input, setInput] = useState('');
  const [generated, setGenerated] = useState('');

  const handleGenerate = () => {
    if (input.trim() === '') return;
    setGenerated(input.trim());
  };

  return (
    <div className="main-panel">
      <h1 className="main-title">Welcome to QR Tools Hub</h1>
      <p className="main-subtitle">Your one-stop hub for smart QR code utilities.</p>

      <div className="form-container">
        <input
          type="text"
          placeholder="Enter text, link, UPI ID etc..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="qr-input"
        />
        <button onClick={handleGenerate} className="generate-btn">Generate QR</button>
      </div>

      {generated && (
        <div className="qr-output">
          {/* @ts-ignore */}
          <QRCode value={generated} size={200} />
          <p className="qr-label">QR for: {generated}</p>
        </div>
      )}
    </div>
  );
} 