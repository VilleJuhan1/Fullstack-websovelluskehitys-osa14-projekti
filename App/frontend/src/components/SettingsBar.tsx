import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SettingsBar.css';

export default function SettingsBar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showDevBar = import.meta.env.VITE_SHOW_DEV_BAR === 'true';

  return (
    <div
      ref={menuRef}
      className="settings-bar-container"
      style={{ top: showDevBar ? 'calc(var(--space-lg) + 36px)' : undefined }}
    >
      <button
        className="settings-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}
        aria-label="Settings"
      >
        <img
          src="/cogwheel.svg"
          alt="Settings"
          style={{ width: 20, height: 20, filter: 'invert(1)' }}
        />
      </button>

      {isOpen && (
        <div className="glass-panel settings-dropdown">
          <Link to="/login" onClick={() => setIsOpen(false)} className="settings-menu-link">Login</Link>
          <Link to="/signup" onClick={() => setIsOpen(false)} className="settings-menu-link">Sign Up</Link>
          <div className="settings-divider" />
          <Link to="/account" onClick={() => setIsOpen(false)} className="settings-menu-link">Account Information</Link>
        </div>
      )}
    </div>
  );
}
