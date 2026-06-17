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

        <div className="hero-text about-text">
          <p>
            Welcome to my cloud showcase! This sandbox environment is a dedicated space where I experiment with cloud-native technologies, automated deployments, and full-stack development.
          </p>
        </div>
      </main>

      <BottomBar />
    </div>
  );
};

export default App;
