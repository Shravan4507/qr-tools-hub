import { useEffect, useState } from 'react';
import './App.css';
import Squares from '../Component/Squares';
import '../Component/Squares.css';
import Dock from '../Component/Dock';
import '../Component/Dock.css';

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
      <Squares
        speed={0.5}
        squareSize={40}
        direction="diagonal"
        borderColor="#271E37"
        hoverFillColor="#222222"
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* ...QR Tools Hub UI... */}
      </div>
      <Dock theme={theme} onToggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
