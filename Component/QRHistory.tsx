import React from 'react';

import type { QRType } from './MainQRPanel';

export interface QRHistoryItem {
  id: string;
  type: QRType;
  content: string;
  timestamp: number;
  qrDataUrl: string;
}

interface QRHistoryProps {
  history: QRHistoryItem[];
  showHistory: boolean;
  onToggleHistory: () => void;
  onClearHistory: () => void;
  onLoadFromHistory: (item: QRHistoryItem) => void;
}

const QRHistory: React.FC<QRHistoryProps> = ({
  history,
  showHistory,
  onToggleHistory,
  onClearHistory,
  onLoadFromHistory,
}) => (
  <div className="history-section">
    <div className="history-header">
      <button onClick={onToggleHistory} className="history-toggle">
        {showHistory ? 'Hide' : 'Show'} History ({history.length})
      </button>
      {history.length > 0 && (
        <button onClick={onClearHistory} className="clear-history-btn">
          Clear History
        </button>
      )}
    </div>
    {showHistory && history.length > 0 && (
      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-item" onClick={() => onLoadFromHistory(item)}>
            <img src={item.qrDataUrl} alt="QR" className="history-qr" />
            <div className="history-details">
              <span className="history-type">{item.type.toUpperCase()}</span>
              <span className="history-content">{item.content}</span>
              <span className="history-time">{new Date(item.timestamp).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default QRHistory; 