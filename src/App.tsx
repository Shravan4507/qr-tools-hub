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

  return (
    <ErrorBoundary>
      <div>
        {/* Top Heading Section */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1001,
          display: 'flex',
          justifyContent: 'center',
          background: 'transparent',
          pointerEvents: 'none',
        }}>
          <div style={{
            width: '100%',
            maxWidth: 500,
            maxHeight: 500,
            minWidth: 0,
            margin: '1.2rem auto 0',
            pointerEvents: 'auto',
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
        </div>
        <Squares
          speed={0.2}
          squareSize={40}
          direction="diagonal"
          borderColor="#271E37"
          hoverFillColor="#222222"
        />
        <div style={{ position: 'relative', zIndex: 1, paddingTop: '6.5rem' }}>
          {/* Features Section */}
          <div style={{ 
            marginTop: '5rem', 
            paddingBottom: '8rem',
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
                QR Tools Features
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: '#ccc',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                Explore our comprehensive suite of QR code generation tools designed for every use case
              </p>
              <button
                onClick={handleTryNowClick}
                style={{
                  marginTop: '2.5rem',
                  padding: '0.9rem 2.2rem',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  background: 'linear-gradient(90deg, #5227ff 0%, #8b5cf6 100%)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(82, 39, 255, 0.15)',
                  transition: 'background 0.3s',
                }}
                aria-label="Scroll to QR Generator"
              >
                Try Now
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
            />
          </div>

          <div ref={mainQRPanelRef}>
            <MainQRPanel />
            <QRHistoryPanel
              open={showHistoryPanel}
              onClose={() => setShowHistoryPanel(false)}
              history={history}
              onClearHistory={handleClearHistory}
              onLoadFromHistory={handleLoadFromHistory}
              dockHistoryBtnRect={historyBtnRect}
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
