import React from 'react';

/**
 * ProjectCard - Displays a project's title, description, tech badges, and actions.
 */
// PUBLIC_INTERFACE
export default function ProjectCard({ project }) {
  const { title, description, tech = [], links = [] } = project || {};
  return (
    <article className="project-card" role="listitem" aria-label={`${title} project`}>
      <h3>{title}</h3>
      <p>{description}</p>
      {tech?.length > 0 && (
        <div className="project-tech" aria-label="Technologies used">
          {tech.map((t) => (
            <span key={t} className="badge">{t}</span>
          ))}
        </div>
      )}
      {links?.length > 0 && (
        <div className="card-actions">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className={`btn ${l.variant || 'btn-outline'}`}
              aria-label={l.label}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
