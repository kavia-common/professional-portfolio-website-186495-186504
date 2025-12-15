import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import './index.css';
import Navbar from './components/Navbar';
import Section from './components/Section';
import ProjectCard from './components/ProjectCard';
import projects from './data/projects';

// PUBLIC_INTERFACE
function App() {
  /**
   * Traditional Gray theme palette
   * primary #374151, secondary #6B7280, success #059669, error #EF4444,
   * background #f9fafb, surface #ffffff, text #111827
   */
  const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useState(prefersDark ? 'dark' : 'light');
  const [activeId, setActiveId] = useState('about');

  const sections = useMemo(
    () => ([
      { id: 'about', label: 'About' },
      { id: 'projects', label: 'Projects' },
      { id: 'resume', label: 'Resume' },
      { id: 'contact', label: 'Contact' }
    ]),
    []
  );

  // Apply theme to html element (for CSS variables)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // IntersectionObserver for active nav link and reveal-on-scroll
  const observerRef = useRef(null);
  useEffect(() => {
    const callback = (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        // toggle reveal class
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }

        // update active section when a section is mostly in view
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          setActiveId(id);
        }
      });
    };

    observerRef.current = new IntersectionObserver(callback, {
      root: null,
      rootMargin: '0px',
      threshold: [0, 0.25, 0.6, 0.9],
    });

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });

    return () => observerRef.current && observerRef.current.disconnect();
  }, [sections]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  // ENV handling and small dev logging
  const flags = (process.env.REACT_APP_FEATURE_FLAGS || '').split(',').map((f) => f.trim());
  const contactApiEnabled = flags.includes('contact_api=1') && !!process.env.REACT_APP_BACKEND_URL;
  if (process.env.REACT_APP_NODE_ENV !== 'production' && process.env.REACT_APP_LOG_LEVEL !== 'silent') {
    // simple dev log to indicate feature flags state
    // eslint-disable-next-line no-console
    console.log('[App] contactApiEnabled:', contactApiEnabled);
  }

  const resumeHref = process.env.REACT_APP_FRONTEND_URL
    ? `${process.env.REACT_APP_FRONTEND_URL}/resume.pdf`
    : '#';

  const onSubmitContact = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    if (contactApiEnabled) {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to send');
        alert('Message sent. Thank you!');
        form.reset();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        alert('Failed to send message. Please try again later.');
      }
    } else {
      // fallback: mailto
      const mailto = `mailto:your.email@example.com?subject=${encodeURIComponent(
        `Portfolio Contact from ${payload.name || 'Visitor'}`
      )}&body=${encodeURIComponent(`${payload.message || ''}\n\nReply to: ${payload.email || ''}`)}`;
      window.location.href = mailto;
    }
  };

  return (
    <div className="App app-root">
      <Navbar
        sections={sections}
        activeId={activeId}
        onToggleTheme={toggleTheme}
        theme={theme}
      />

      <main>
        <Section id="about" title="About Me">
          <div className="about-container">
            <img
              src="https://avatars.githubusercontent.com/u/583231?v=4"
              alt="Profile avatar"
              className="avatar"
              width="128"
              height="128"
            />
            <div className="about-text">
              <h2 className="name">Jane Doe</h2>
              <p className="role">Full-Stack Developer</p>
              <p className="bio">
                I build reliable, accessible web applications with clean, maintainable code.
                My focus areas include React, Node.js, and modern CSS—delivering performant
                experiences with thoughtful UX.
              </p>
              <div className="social-links" aria-label="Social links">
                <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub" className="btn btn-outline">GitHub</a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="btn btn-outline">LinkedIn</a>
              </div>
            </div>
          </div>
        </Section>

        <Section id="projects" title="Projects">
          <div className="projects-grid" role="list">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </Section>

        <Section id="resume" title="Resume">
          <div className="resume-box">
            <p className="resume-summary">
              A concise summary of professional experience, core competencies, and education.
              Download the resume for detailed information.
            </p>
            <a
              href={resumeHref}
              className="btn btn-primary"
              aria-label="Download Resume"
              target={resumeHref === '#' ? '_self' : '_blank'}
              rel="noreferrer"
            >
              Download Resume
            </a>
          </div>
        </Section>

        <Section id="contact" title="Contact">
          <form className="contact-form" onSubmit={onSubmitContact} aria-label="Contact form">
            <div className="form-row">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" placeholder="Your name" required />
            </div>
            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="form-row">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" placeholder="How can I help?" required />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success">Send Message</button>
              {!contactApiEnabled && (
                <p className="help-text" role="note">
                  Tip: Enable contact API by adding "contact_api=1" to REACT_APP_FEATURE_FLAGS and setting REACT_APP_BACKEND_URL.
                </p>
              )}
            </div>
          </form>
        </Section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Jane Doe. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
