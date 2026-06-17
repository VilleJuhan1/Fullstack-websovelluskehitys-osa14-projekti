import React from 'react';
import linkedinIcon from '../assets/linkedin-big-logo.svg';
import githubIcon from '../assets/github.svg';

// Fallback URLs ensure the component still functions if environment variables are missing
const LINKEDIN_URL =
  import.meta.env.VITE_LINKEDIN_URL || 'https://linkedin.com';
const GITHUB_URL = import.meta.env.VITE_GITHUB_URL || 'https://github.com';

/**
 * Renders a fixed navigation bar containing social media links.
 * 
 * Links are configured via environment variables with hardcoded fallbacks.
 * Designed to mirror the unified style of the quiz application's social bar.
 */
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
