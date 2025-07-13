import { useEffect, useState } from 'react';
import './App.css';
import Squares from '../Component/Squares';
import '../Component/Squares.css';
import Dock from '../Component/Dock';
import '../Component/Dock.css';
import TextPressure from '../Component/TextPressure';

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
        {/* ...QR Tools Hub UI... */}
      </div>
      <Dock theme={theme} onToggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
