import React from 'react';
import robotImg from './assets/sandbox.png';
import BottomBar from './components/BottomBar';

const App: React.FC = () => {
  return (
    <div className="landing-container">
      <main className="hero-section">
        <div className="robot-wrapper">
          <div className="sandbox">
            <img src={robotImg} className="robot-img" alt="Digging Robot" />
          </div>
        </div>

        <div className="hero-text">
          <h1 className="text-gradient">Under Construction</h1>
          <p>
            Welcome to my cloud sandbox landing page! While you're here, please
            check out this{' '}
            <a
              href="https://quizgame.hiekkalaatikko.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-link"
            >
              quiz-game!
            </a>
          </p>
        </div>
      </main>

      <BottomBar />
    </div>
  );
};

export default App;
