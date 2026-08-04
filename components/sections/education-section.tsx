import { SectionHeading } from "@/components/ui/section-heading";
import type { PortfolioContent } from "@/content/portfolio";

export function EducationSection({ education }: { education: PortfolioContent["education"] }) {
  return (
    <section className="education full-row" id="education">
      <div className="rail content-section">
        <SectionHeading title="Education" kicker="Academic Background" />
        <article className="education-card">
          <div className="education-header">
            <div className="education-main">
              <span className="education-icon" aria-hidden="true">
                🎓
              </span>
              <div>
                <h3>{education.institution}</h3>
                <p className="education-degree">{education.degree}</p>
              </div>
            </div>
            <div className="education-meta">
              <span className="education-location">📍 {education.location}</span>
              <strong className="education-duration">{education.duration}</strong>
            </div>
          </div>
          <div className="education-body">
            <ul className="education-highlights">
              {education.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}
