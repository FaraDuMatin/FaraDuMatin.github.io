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
      <ProjectDetails
        id="project1"
        projectKey="project1"
        image="/images/Project1.png"
        imageAlt="Project Image"
        technologies={[{ name: "Next.js" }, {name: "Real Time"}, { name: "Authentication"}]}
        demoLink="https://colla-board-fwhs.vercel.app/"
        sourceLink="https://github.com/FaraDuMatin/CollaBoard"
      />
      {/* <ProjectDetails
        id="project2"
        reversed={true}
        projectKey="project2"
        image="/images/image 10.png"
        imageAlt="Project Image 2"
        technologies={[{ name: "JavaScript" }, { name: "CSS" }]}
        demoLink="https://example.com/demo2"
        sourceLink="https://github.com/example/repo2"
      /> */}
      {/* <ProjectDetails
        id="project3"
        projectKey="project3"
        image="/images/image 10.png"
        imageAlt="Project Image 3"
        technologies={[{ name: "Node.js" }, { name: "Express" }]}
        demoLink="https://example.com/demo3"
        sourceLink="https://github.com/example/repo3"
      /> */}
      {/* Other components will go here */}
      <Text section="experience" />
      <Text section="education" />
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;
