import { useLanguage } from '../contexts/LanguageContext';
import './LanguageSwitch.css';

const LanguageSwitch = () => {
  const { language, setLanguage } = useLanguage();

  const handleToggle = () => {
    const newLanguage = language === 'en' ? 'fr' : 'en';
    setLanguage(newLanguage);
  };

  return (
    <div className="language-switch-container">
      <button 
        className={`language-switch ${language}`}
        onClick={handleToggle}
        aria-label={`Switch to ${language === 'en' ? 'French' : 'English'}`}
      >
        {/* Background track */}
        <div className="language-track">
          <span className="language-label left">EN</span>
          <span className="language-label right">FR</span>
        </div>
        
        {/* Moving toggle */}
        <div className="language-toggle">
          <span className="toggle-text">
            {language.toUpperCase()}
          </span>
        </div>
      </button>
    </div>
  );
};

export default LanguageSwitch;