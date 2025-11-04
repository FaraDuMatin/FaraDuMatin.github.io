import './Navbar.css';
// import DarkLightSwitch from './DarkLightSwitch';
import LanguageSwitch from './LanguageSwitch';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo/Brand area - left side */}
        <div className="navbar-brand">
          {/* Logo will go here if needed */}
        </div>
        
        {/* Right side - Theme switch and social icons */}
        <div className="navbar-right">
          
          
          {/* Social media icons */}
          <div className="navbar-social">
            <a 
              href="https://linkedin.com/in/your-profile" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              <img src="/icons/LinkedIn_24.svg" alt="LinkedIn" className="social-icon" />
            </a>
            
            <a 
              href="mailto:your.email@gmail.com" 
              className="social-link"
            >
              <img src="/icons/Gmail_24.svg" alt="Gmail" className="social-icon" />
            </a>
            
            <a 
              href="https://github.com/your-username" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              <img src="/icons/mark-github-24.svg" alt="GitHub" className="social-icon" />
            </a>
          </div>
          {/* Theme Switch. Not now I did not choose wich color I will use for light theme */}
          {/* <DarkLightSwitch /> */}
          <LanguageSwitch />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
