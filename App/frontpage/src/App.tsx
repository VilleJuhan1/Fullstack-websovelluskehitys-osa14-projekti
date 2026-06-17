import React from 'react';
import robotImg from './assets/sandbox.png';
import BottomBar from './components/BottomBar';
import ServicesBar from './components/ServicesBar';

const App: React.FC = () => {
  return (
    <div className="landing-container">
      <ServicesBar />
      <main className="hero-section">
        <div className="hero-text">
          <h1 className="text-gradient">Hiekkalaatikko</h1>
        </div>

        <div className="robot-wrapper">
          <div className="sandbox">
            <img src={robotImg} className="robot-img" alt="Digging Robot" />
          </div>
        </div>

        <div className="about-text">
          <p>
            Welcome to my cloud sandbox showcase!</p> Feel free to browse the links at side or visit the project repository at{' '}
          <a href="https://github.com/VilleJuhan1/Fullstack-websovelluskehitys-osa14-projekti" target="_blank" rel="noopener noreferrer" className="inline-link">
            Github
          </a>.
        </div>
      </main>

      <BottomBar />
    </div>
  );
};

export default App;
