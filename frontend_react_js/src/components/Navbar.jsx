import React, { useState } from 'react';

/**
 * Navbar - sticky top navigation with anchors and active link highlighting.
 * Accessible and responsive with a simple mobile menu toggle (no external deps).
 */
// PUBLIC_INTERFACE
export default function Navbar({ sections, activeId, onToggleTheme, theme }) {
  /** Accessible mobile menu toggle */
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen((o) => !o);

  const handleNavLinkClick = () => {
    // close menu on navigation (mobile)
    setOpen(false);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="navbar-inner">
        <div className="brand" aria-label="Site title">JD Portfolio</div>

        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={handleClick}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <div
          id="primary-navigation"
          className={`nav-links ${open ? 'open' : ''}`}
          role="menubar"
          aria-label="Primary"
        >
          {sections.map((s) => (
            <a
              key={s.id}
              className={`nav-link ${activeId === s.id ? 'active' : ''}`}
              href={`#${s.id}`}
              onClick={handleNavLinkClick}
              role="menuitem"
            >
              {s.label}
            </a>
          ))}
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  );
}
