import './ProjectDetails.css';
import { useLanguage } from '../contexts/LanguageContext';

interface Technology {
  name: string;
}

interface ProjectDetailsProps {
  id?: string; // Optional id for section
  projectKey: 'project1' | 'project2' | 'project3'; // Key to identify which project translations to use
  image: string;
  imageAlt: string;
  technologies: Technology[];
  demoLink?: string; // Optional demo link
  sourceLink?: string; // Optional source code link
  reversed?: boolean; // Optional prop to reverse layout (image on right)
}

const ProjectDetails = ({ 
  id = "portfolio", 
  projectKey,
  image, 
  imageAlt, 
  technologies, 
  demoLink, 
  sourceLink,
  reversed = false 
}: ProjectDetailsProps) => {
  const { t } = useLanguage();
  
  const title = t(`projects.${projectKey}.title`);
  const description = t(`projects.${projectKey}.description`);
  const liveDemoText = t('projects.buttons.liveDemo');
  const sourceCodeText = t('projects.buttons.sourceCode');
  
  const handleDemoClick = () => {
    if (demoLink) {
      window.open(demoLink, '_blank');
    }
  };

  const handleSourceClick = () => {
    if (sourceLink) {
      window.open(sourceLink, '_blank');
    }
  };

  return (
    <section className="project-section" id={id}>
      <div className={`project-container ${reversed ? 'reversed' : ''}`}>
        {/* Project Details */}
        <div className="project-details">
          {/* Project Name */}
          <div className="project-name">
            <h2 className="project-title">{title}</h2>
          </div>
          
          {/* Project Description */}
          <div className="project-description">
            <p className="description-text">{description}</p>
          </div>
          
          {/* Technology Stack */}
          <div className="tech-stack">
            {technologies.map((tech, index) => (
              <div key={index} className="tech-item">
                <span className="tech-name">{tech.name}</span>
              </div>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="project-buttons">
            {demoLink && (
              <button className="demo-button" onClick={handleDemoClick}>
                {liveDemoText}
              </button>
            )}
            {sourceLink && (
              <button className="source-button" onClick={handleSourceClick}>
                {sourceCodeText}
              </button>
            )}
          </div>
        </div>
        
        {/* Project Image (gif) */}
        
        <div className="project-image">
          <img src={image} alt={imageAlt} className="project-img"/>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetails;
