import React from 'react';
import linkedinIcon from '../assets/linkedin-big-logo.svg';
import githubIcon from '../assets/github.svg';

const LINKEDIN_URL =
  import.meta.env.VITE_LINKEDIN_URL || 'https://linkedin.com';
const GITHUB_URL = import.meta.env.VITE_GITHUB_URL || 'https://github.com';

const BottomBar: React.FC = () => {
  return (
    <footer className="bottom-bar glass-panel">
      <a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="social-link"
      >
        <img src={linkedinIcon} alt="LinkedIn" className="social-icon" />
      </a>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="social-link"
      >
        <img src={githubIcon} alt="GitHub" className="social-icon" />
      </a>
    </footer>
  );
};

export default BottomBar;
