import React from 'react';
import { motion, AnimatePresence, AnimationGeneratorType } from 'framer-motion';
import type { QRHistoryItem } from './QRHistory';
import './QRHistoryPanel.css';

interface QRHistoryPanelProps {
  open: boolean;
  onClose: () => void;
  history: QRHistoryItem[];
  onClearHistory: () => void;
  onLoadFromHistory: (item: QRHistoryItem) => void;
  dockHistoryBtnRect?: DOMRect | null;
}

const genieVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 100 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as AnimationGeneratorType, stiffness: 320, damping: 28 } },
  exit: { opacity: 0, scale: 0.7, y: 100, transition: { duration: 0.22 } },
};

const QRHistoryPanel: React.FC<QRHistoryPanelProps> = ({ open, onClose, history, onClearHistory, onLoadFromHistory, dockHistoryBtnRect }) => {
  // Calculate modal position and transformOrigin
  let modalStyle: React.CSSProperties = {};
  let initialObj: any = undefined, animateObj: any = undefined, exitObj: any = undefined;
  if (dockHistoryBtnRect) {
    const left = dockHistoryBtnRect.left + dockHistoryBtnRect.width / 2;
    const bottom = window.innerHeight - dockHistoryBtnRect.top;
    modalStyle = {
      position: 'fixed',
      left: left,
      bottom: bottom + dockHistoryBtnRect.height + 12,
      transform: 'translate(-50%, 0)',
      zIndex: 2002,
    };
    initialObj = { opacity: 0, scale: 0.7, y: 60 };
    animateObj = { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as AnimationGeneratorType, stiffness: 320, damping: 28 } };
    exitObj = { opacity: 0, scale: 0.7, y: 60, transition: { duration: 0.22 } };
  }
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="qr-history-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />
          <motion.div
            className="qr-history-modal"
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            style={modalStyle}
            {...(dockHistoryBtnRect
              ? { initial: initialObj, animate: animateObj, exit: exitObj, variants: undefined }
              : { initial: 'hidden', animate: 'visible', exit: 'exit', variants: genieVariants }
            )}
          >
            <div className="qr-history-modal-header">
              <h2>QR History</h2>
              <button className="qr-history-modal-close" onClick={onClose} aria-label="Close History">×</button>
            </div>
            <div className="qr-history-modal-actions">
              {history.length > 0 && (
                <button className="clear-history-btn" onClick={onClearHistory}>Clear History</button>
              )}
            </div>
            <div className="qr-history-modal-list">
              {history.length === 0 ? (
                <p className="qr-history-modal-empty">No history yet.</p>
              ) : (
                history.map(item => (
                  <div key={item.id} className="qr-history-modal-item" onClick={() => onLoadFromHistory(item)} tabIndex={0} role="button">
                    <img src={item.qrDataUrl} alt="QR" className="qr-history-modal-qr" />
                    <div className="qr-history-modal-details">
                      <span className="qr-history-modal-type">{item.type.toUpperCase()}</span>
                      <span className="qr-history-modal-content">{item.content}</span>
                      <span className="qr-history-modal-time">{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QRHistoryPanel; 