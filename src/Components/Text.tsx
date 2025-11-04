import './Text.css';
import { useLanguage } from '../contexts/LanguageContext';

interface TextItem {
  title: string;
  subtitle?: string;
  period: string;
}

interface TextProps {
  section: 'experience' | 'education';
}

const Text = ({ section }: TextProps) => {
  const { t } = useLanguage();
  
  const sectionTitle = t(`${section}.title`);
  const items: TextItem[] = t(`${section}.items`) || [];

  return (
    <section id={section} className="text-section">
      <div className="text-container">
        <h2 className="section-title">
          {sectionTitle}
          <div className="title-underline"></div>
        </h2>
        
        <div className="text-items">
          {items.map((item, index) => (
            <div key={index} className="text-item">
              <div className="item-content">
                <div className="item-left">
                  <h3 className="item-title">{item.title}</h3>
                  {item.subtitle && (
                    <p className="item-subtitle">{item.subtitle}</p>
                  )}
                </div>
                <div className="item-right">
                  <span className="item-period">{item.period}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Text;
