import { useEffect, useState } from 'react';
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

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
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
        <AnimatedMainPanel 
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          particleCount={8}
          glowColor="132, 0, 255"
        />
        
        {/* Features Section */}
        <div style={{ 
          marginTop: '4rem', 
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
      </div>
      <Dock theme={theme} onToggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
