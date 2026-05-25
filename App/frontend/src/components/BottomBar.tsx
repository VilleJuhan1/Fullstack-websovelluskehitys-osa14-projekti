import React from 'react';
import './BottomBar.css';

const LINKEDIN_URL =
  import.meta.env.VITE_LINKEDIN_URL || 'https://linkedin.com';
const GITHUB_URL = import.meta.env.VITE_GITHUB_URL || 'https://github.com';

// Social media links that are rendered in the bottom right corner as a floating bar
const BottomBar: React.FC = () => {
  return (
    <footer className="bottom-bar glass-panel">
      <a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="social-link"
      >
        <img
          src="/linkedin-big-logo.svg"
          alt="LinkedIn"
          className="social-icon"
        />
      </a>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="social-link"
      >
        <img src="/github.svg" alt="GitHub" className="social-icon" />
      </a>
    </footer>
  );
};

export default BottomBar;
