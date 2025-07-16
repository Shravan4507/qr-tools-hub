import { useEffect, useState, useRef, useCallback } from 'react';
import './App.css';
import Squares from '../Component/Squares';
import '../Component/Squares.css';
import Dock from '../Component/Dock';
import '../Component/Dock.css';
import TextPressure from '../Component/TextPressure';
import AnimatedMainPanel from '../Component/AnimatedMainPanel';
import '../Component/AnimatedMainPanel.css';
import MagicBento from '../Component/MagicBento';
import '../Component/MagicBento.css';
import MainQRPanel from '../Component/MainQRPanel';
import QRHistoryPanel from '../Component/QRHistoryPanel';
import type { QRHistoryItem } from '../Component/QRHistory';
import ErrorBoundary from '../Component/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const mainQRPanelRef = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState<QRHistoryItem[]>([]);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [pendingHistoryItem, setPendingHistoryItem] = useState<QRHistoryItem | null>(null);
  const [historyBtnRect, setHistoryBtnRect] = useState<DOMRect | null>(null);
  const handleHistoryBtnRect = useCallback((rect: DOMRect | null) => {
    setHistoryBtnRect(rect);
  }, []);

  // Add state to control MainQRPanel QR type
  const [forceQrType, setForceQrType] = useState<string | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    if (!historyLoaded) {
      const savedHistory = localStorage.getItem('qr-history');
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory));
        } catch (error) {
          console.error('Failed to load QR history:', error);
        }
      }
      setHistoryLoaded(true);
    }
  }, [historyLoaded]);
  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (historyLoaded) {
      localStorage.setItem('qr-history', JSON.stringify(history));
    }
  }, [history, historyLoaded]);

  const handleTryNowClick = () => {
    mainQRPanelRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Dock handlers
  const handleHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleHistory = () => {
    mainQRPanelRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowHistoryPanel(true);
  };
  const handleSettings = () => {
    alert('Settings coming soon!');
  };
  const handleAbout = () => {
    alert('QR Tools Hub\nA modern QR code utility suite.');
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('qr-history');
  };

  const handleLoadFromHistory = (item: QRHistoryItem) => {
    setPendingHistoryItem(item);
    setShowHistoryPanel(false);
  };

  // Handler for UPI QR click in MagicBento
  const handleUpiQRClick = () => {
    mainQRPanelRef.current?.scrollIntoView({ behavior: 'smooth' });
    setForceQrType('upi');
  };

  // Handlers for each QR click in MagicBento
  const handleTextQRClick = () => {
    mainQRPanelRef.current?.scrollIntoView({ behavior: 'smooth' });
    setForceQrType('text');
  };
  const handleWifiQRClick = () => {
    mainQRPanelRef.current?.scrollIntoView({ behavior: 'smooth' });
    setForceQrType('wifi');
  };
  const handleVcardQRClick = () => {
    mainQRPanelRef.current?.scrollIntoView({ behavior: 'smooth' });
    setForceQrType('vcard');
  };
  const handleUrlQRClick = () => {
    mainQRPanelRef.current?.scrollIntoView({ behavior: 'smooth' });
    setForceQrType('url');
  };

  // Handler for QR Code card image click (reload page)
  const handleQrCodeImgClick = () => {
    window.location.reload();
  };

  // Export history as JSON
  const handleExportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qr-history.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import history from JSON
  const handleImportHistory = (imported: QRHistoryItem[]) => {
    if (Array.isArray(imported)) {
      setHistory(imported);
      localStorage.setItem('qr-history', JSON.stringify(imported));
    }
  };

  return (
    <ErrorBoundary>
      <div>
        <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        {/* Top Heading Section */}
        <div style={{
          width: '100%',
          maxWidth: 550,
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <TextPressure
            text="QR TOOLS HUB"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#ffffff"
            strokeColor="#ff0000"
            minFontSize={28}
          />
        </div>
        <Squares
          speed={0.2}
          squareSize={40}
          direction="diagonal"
          borderColor="#271E37"
          hoverFillColor="#222222"
        />
        <div style={{ position: 'relative', zIndex: 1, paddingTop: '0' }}>
          {/* Features Section */}
          <div style={{ 
            marginTop: '0', 
            paddingBottom: '0',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '3rem',
              color: '#fff',
              padding: '0 1rem'
            }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #5227ff, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Seamless QR Creations
              </h2>
              <p style={{
                fontSize: '1.6rem',
                color: '#ccc',
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: '1.5'
              }}>
                Beyond the Barcode. Simplify, connect, and thrive with our advanced QR code solutions, engineered to transform your every interaction.
              </p>
              <button
                onClick={handleTryNowClick}
                style={{
                  marginTop: '2.5rem',
                  padding: '0.9rem 2.2rem',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  background: 'linear-gradient(90deg, #5227ff 0%,rgba(138, 92, 246, 0.03) 100%)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(82, 39, 255, 0.15)',
                  transition: 'background 0.3s',
                }}
                aria-label="Scroll to QR Generator"
              >
                Generate QR
              </button>
              <button
                onClick={() => alert('Read QR feature coming soon!')}
                style={{
                  marginTop: '2.5rem',
                  marginLeft: '1rem',
                  padding: '0.9rem 2.2rem',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  background: 'linear-gradient(90deg,rgba(138, 92, 246, 0.03) 0%,rgb(82, 39, 255) 100%)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(82, 39, 255, 0.15)',
                  transition: 'background 0.3s',
                }}
                aria-label="Read QR Code"
              >
                Read QR
              </button>
            </div>
            
            <MagicBento 
              textAutoHide={true}
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              enableMagnetism={true}
              clickEffect={true}
              spotlightRadius={400}
              particleCount={12}
              glowColor="132, 0, 255"
              onUpiQRClick={handleUpiQRClick}
              onTextQRClick={handleTextQRClick}
              onWifiQRClick={handleWifiQRClick}
              onVcardQRClick={handleVcardQRClick}
              onUrlQRClick={handleUrlQRClick}
              onQrCodeImgClick={handleQrCodeImgClick}
            />
          </div>

          <div ref={mainQRPanelRef}>
            <MainQRPanel forceQrType={forceQrType} setForceQrType={setForceQrType} />
            <QRHistoryPanel
              open={showHistoryPanel}
              onClose={() => setShowHistoryPanel(false)}
              history={history}
              onClearHistory={handleClearHistory}
              onLoadFromHistory={handleLoadFromHistory}
              dockHistoryBtnRect={historyBtnRect}
              onExportHistory={handleExportHistory}
              onImportHistory={handleImportHistory}
            />
          </div>
        </div>
        <Dock 
          onHome={handleHome}
          onSettings={handleSettings}
          onAbout={handleAbout}
          getHistoryButtonRect={handleHistoryBtnRect}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
