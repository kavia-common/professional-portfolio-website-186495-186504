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

  // Always serve resume from public folder path
  const resumeHref = '/resume.pdf';

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
      // fallback: mailto to candidate email from resume summary
      const mailto = `mailto:kishoren6753@gmail.com?subject=${encodeURIComponent(
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
              <h2 className="name">Kishore N</h2>
              <p className="role">Data Analyst</p>
              <p className="bio">
                Data Analyst with hands-on experience in data cleaning, transformation, and visualization.
                Skilled in Python and SQL (Postgres) with a focus on reproducible analysis, data quality,
                and communicating insights to diverse stakeholders.
              </p>
              <div className="social-links" aria-label="Social links">
                {/* Placeholders omitted when unknown */}
                {/* GitHub/LinkedIn were not provided in summary; keeping subtle placeholders off to avoid inventing data */}
                <a href="mailto:kishoren6753@gmail.com" className="btn btn-outline" aria-label="Email Kishore">Email</a>
              </div>
            </div>
          </div>
        </Section>

        <Section id="projects" title="Projects">
          <div className="projects-grid" role="list">
            {/* Replace project cards with resume-extracted projects */}
            <ProjectCard
              key="proj-retail-forecast"
              project={{
                title: 'Retail Demand Forecasting',
                description: 'Forecasting retail demand with emphasis on data preparation and analysis.',
                tech: ['Python', 'SQL', 'Seaborn', 'Matplotlib'],
                links: []
              }}
            />
            <ProjectCard
              key="proj-delivery-time"
              project={{
                title: 'Delivery Time Prediction',
                description: 'Predicting delivery times; emphasized cleaning, modeling readiness, and visualization.',
                tech: ['Python', 'SQL', 'Seaborn', 'Matplotlib'],
                links: []
              }}
            />
          </div>
        </Section>

        <Section id="resume" title="Resume">
          <div className="resume-box">
            <p className="resume-summary">
              Intern (Data/Analytics) @ Gradtwin — Built real-time analytics dashboards; cleaned 5,000+ records
              with Python/Pandas to improve data accuracy; developed visualizations that improved decision-making by ~15%.
            </p>

            <div className="section" style={{ padding: 0 }}>
              <header className="section-header">
                <h2 id="skills-title" style={{ fontSize: 20, margin: 0 }}>Skills</h2>
              </header>
              <p className="bio" style={{ marginTop: 0 }}>
                Programming: Python, SQL • Databases: Postgres • Visualization: Seaborn, Matplotlib •
                Analytics: Data cleaning, transformation, dashboards • Communication: Presenting insights to mixed audiences
              </p>
            </div>

            <div className="section" style={{ padding: 0 }}>
              <header className="section-header">
                <h2 id="education-title" style={{ fontSize: 20, margin: 0 }}>Education</h2>
              </header>
              <p className="bio" style={{ marginTop: 0 }}>
                Artificial Intelligence and Data Science
                {/* Institution and dates not specified in summary */}
              </p>
            </div>

            <a
              href={resumeHref}
              className="btn btn-primary"
              aria-label="Download Resume (PDF)"
              target="_blank"
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
                  Tip: Or email directly at <a href="mailto:kishoren6753@gmail.com">kishoren6753@gmail.com</a>.
                </p>
              )}
            </div>
          </form>
        </Section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Kishore N. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
