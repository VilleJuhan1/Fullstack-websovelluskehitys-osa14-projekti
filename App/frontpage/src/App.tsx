import React from 'react';
import robotImg from './assets/sandbox.png';
import BottomBar from './components/BottomBar';

const App: React.FC = () => {
  return (
    <div className="landing-container">
      {/* Main Content */}
      <main className="hero-section">
        <div className="robot-wrapper">
          <div className="sandbox">
            <img src={robotImg} className="robot-img" alt="Digging Robot" />
          </div>
        </div>

        <div className="hero-text">
          <h1 className="text-gradient">Under Construction</h1>
          <p>The Antigravity team is currently digging in the sandbox to build something amazing.</p>
        </div>
      </main>

      <BottomBar />
    </div>
  );
};

export default App;
