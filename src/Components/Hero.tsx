import { useLanguage } from '../contexts/LanguageContext';
import './Hero.css';

const Hero = () => {
  const { t } = useLanguage();
  return (
    <section id="home" className="hero-section">
      <div className="hero-name">
        <h1 className="name-text">{t('hero.title')}</h1>
      </div>
      
      <div className="hero-subtitle">
        <p className="subtitle-text">
          {t('hero.subtitle')}
        </p>
      </div>
      
      <div className="hero-cta">
        <button className="cta-button" onClick={() => {
          const portfolioSection = document.getElementById('portfolio');
          portfolioSection?.scrollIntoView({ behavior: 'smooth' });
        }}>
         {t('hero.cta')}
          <img src="/icons/Arrow.svg" alt="arrow down" className="arrow-icon" />
        </button>
      </div>
    </section>
  );
};

export default Hero;