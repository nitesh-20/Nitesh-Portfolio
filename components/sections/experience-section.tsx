"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PortfolioContent } from "@/content/portfolio";

function ExperienceItem({ item, defaultOpen }: { item: PortfolioContent["experience"][number]; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <article className={`experience-card ${open ? "open" : ""}`}>
      <button
        type="button"
        className="experience-trigger"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="experience-logo-cell">
          <div className={`company-logo ${item.tone}`}>
            <img src={item.icon} alt="" aria-hidden="true" />
          </div>
        </span>
        <span className="experience-title-cell">
          <strong>{item.title}</strong>
          <em>{item.company}</em>
        </span>
        <span className="experience-date-cell">
          {item.meta.join(" · ")}
        </span>
        <span className="experience-chevron-cell" aria-hidden="true" />
      </button>

      <div className="experience-body">
        <div className="experience-body-inner">
          <div className="experience-content">
            {Array.isArray(item.description) ? (
              <ul className="experience-bullets">
                {item.description.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
            ) : (
              <p>{item.description}</p>
            )}
            {item.tags.length ? (
              <div className="tags compact">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ExperienceSection({ experience }: { experience: PortfolioContent["experience"] }) {
  return (
    <section className="experience full-row" id="experience">
      <div className="rail content-section">
        <SectionHeading title="Work Experience" kicker="Where I build" />
        <div className="experience-list">
          {experience.map((item, index) => (
            <ExperienceItem
              key={`${item.company}-${item.title}`}
              item={item}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
