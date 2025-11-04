import { useState } from 'react';
import './DarkLightSwitch.css';

interface DarkLightSwitchProps {
  initialTheme?: 'dark' | 'light';
  onThemeChange?: (theme: 'dark' | 'light') => void;
}

const DarkLightSwitch = ({ 
  initialTheme = 'dark', 
  onThemeChange 
}: DarkLightSwitchProps) => {
  const [isDark, setIsDark] = useState(initialTheme === 'dark');

  const handleToggle = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
    
  };

  return (
    <div className="theme-switch-container">
      <button 
        className={`theme-switch ${isDark ? 'dark' : 'light'}`}
        onClick={handleToggle}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      >
        {/* Background track */}
        <div className="switch-track">
          {/* Icons on the track */}
          <div className="track-icon sun-icon">
            <img src="/icons/sun.png" alt="Light mode" />
          </div>
          <div className="track-icon moon-icon">
            <img src="/icons/moon.png" alt="Dark mode" />
          </div>
        </div>
        
        {/* Moving circle/toggle */}
        <div className="switch-toggle">
          <div className="toggle-icon">
            {isDark ? (
              <img src="/icons/moon.png" alt="Dark mode" />
            ) : (
              <img src="/icons/sun.png" alt="Light mode" />
            )}
          </div>
        </div>
      </button>
    </div>
  );
};

export default DarkLightSwitch;
