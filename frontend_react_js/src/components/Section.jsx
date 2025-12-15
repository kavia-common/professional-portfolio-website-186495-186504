import React from 'react';

/**
 * Section - Semantic wrapper for each page section with consistent spacing and header.
 */
// PUBLIC_INTERFACE
export default function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="section reveal" aria-labelledby={`${id}-title`}>
      <header className="section-header">
        <h2 id={`${id}-title`}>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>
      {children}
    </section>
  );
}
