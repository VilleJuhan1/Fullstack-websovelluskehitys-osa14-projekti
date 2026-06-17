import React, { useState, useRef, useEffect } from 'react';

const ServicesBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="services-bar-container">
      <button
        className="services-toggle-btn glass-panel"
        onClick={() => setIsOpen(!isOpen)}
        style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}
        aria-label="Services Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 20, height: 20 }}
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {isOpen && (
        <div className="glass-panel services-dropdown">
          <div
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              fontSize: '0.85rem',
              color: 'var(--color-primary)',
              fontWeight: 700,
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              marginBottom: 4,
            }}
          >
            Projects & Services
          </div>
          <a
            href="https://quizgame.hiekkalaatikko.tech"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="services-menu-link"
          >
            Quiz Game Demo App
          </a>
          <a
            href="https://grafana.hiekkalaatikko.tech"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="services-menu-link"
          >
            Grafana (restricted)
          </a>
          <a
            href="https://argo.hiekkalaatikko.tech"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="services-menu-link"
          >
            Argo CD (restricted)
          </a>
        </div>
      )}
    </div>
  );
};

export default ServicesBar;
