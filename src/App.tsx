import "./App.css";
import Navbar from "./Components/Navbar.tsx";
import Hero from "./Components/Hero.tsx";
import Sidebar from "./Components/Sidebar";
import ProjectDetails from "./Components/ProjectDetails.tsx";
import Text from "./Components/Text.tsx";
import GoBackUp from "./Components/GoBackUp.tsx";

import { LanguageProvider } from "./contexts/LanguageContext.tsx";

function App() {
  return (
    <LanguageProvider>
      <div className="portfolio-container">
        <Sidebar />
        <GoBackUp />
        <div className="main-content">
          <Navbar />
          <Hero />
          <div
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-easing="ease-in-out"
          >
            <ProjectDetails
              id="project1"
              projectKey="project1"
              image="/images/collaboardGif.gif"
              imageAlt="Project Image"
              technologies={[
                { name: "Next.js" },
                { name: "Real Time" },
                { name: "Authentication" },
              ]}
              demoLink="https://colla-board-fwhs.vercel.app/"
              sourceLink="https://github.com/FaraDuMatin/CollaBoard"
            />
          </div>
          <div
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-easing="ease-in-out"
          >
            <ProjectDetails
              id="project2"
              reversed={true}
              projectKey="project2"
              image="/images/armadillo.gif"
              imageAlt="Project Image 2"
              technologies={[
                { name: "JavaScript" },
                { name: "WebGL" },
                { name: "Three.js" },
              ]}
              demoLink="https://faradumatin.github.io/DancingArmadillo/"
              sourceLink="https://github.com/FaraDuMatin/DancingArmadillo"
            />
          </div>
          <div
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-easing="ease-in-out"
          >
            <ProjectDetails
              id="project3"
              projectKey="project3"
              image="/images/animation.gif"
              imageAlt="Project Image 3"
              technologies={[{ name: "Three.js" }, { name: "WebGL" }]}
              demoLink="https://faradumatin.github.io/CharacterAnimation/"
              sourceLink="https://github.com/FaraDuMatin/CharacterAnimation"
            />
          </div>
          {/* Other components will go here */}
          <div
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-easing="ease-in-out"
          >
            <Text section="experience" />
          </div>
          <div
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-easing="ease-in-out"
          >
            <Text section="education" />
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;
