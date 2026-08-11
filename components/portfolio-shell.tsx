"use client";

import { useState } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AboutSection } from "@/components/sections/about-section";
import { AchievementsSection } from "@/components/sections/achievements-section";
import { EducationSection } from "@/components/sections/education-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { GitHubActivitySection } from "@/components/sections/github-activity-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SocialLinksSection } from "@/components/sections/social-links-section";
import { StackSection } from "@/components/sections/stack-section";
import { CommandPalette } from "@/components/ui/command-palette";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { portfolioContent } from "@/content/portfolio";

function Divider() {
  return (
    <div className="divider full-row">
      <div className="rail pattern" />
    </div>
  );
}

export function PortfolioShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="site-shell">
        <header className="topbar full-row">
          <div className="rail">
            <a className="brand" href="#home" aria-label="Go to home">
              {portfolioContent.profile.initials}
            </a>
            <nav className="desktop-nav" aria-label="Primary navigation">
              {portfolioContent.navigation.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="toolbar">
              <CommandPalette links={portfolioContent.quickActions} copyActions={portfolioContent.copyActions} />
              <a
                className="pill-button resume-pill"
                href={portfolioContent.profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                title="Download Resume"
              >
                <span aria-hidden="true">📄</span>
                <span>Resume</span>
              </a>
              <a
                className="icon-button header-github-btn"
                href={portfolioContent.profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Open GitHub"
              >
                <img src="/assets/icons/github.svg" alt="" aria-hidden="true" />
              </a>
              <ThemeToggle />
              <button
                type="button"
                className="icon-button mobile-menu-toggle"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                <span aria-hidden="true" style={{ fontSize: "18px", fontWeight: "bold", lineHeight: 1 }}>
                  {mobileMenuOpen ? "✕" : "☰"}
                </span>
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <nav className="mobile-nav-panel rail" aria-label="Mobile navigation">
              <div className="mobile-nav-links">
                {portfolioContent.navigation.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="mobile-nav-link"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>
          )}
        </header>

        <main>
          <HeroSection profile={portfolioContent.profile} />
          <Divider />
          <SocialLinksSection socialLinks={portfolioContent.socialLinks} />
          <Divider />
          <ExperienceSection experience={portfolioContent.experience} />
          <Divider />
          <ProjectsSection projects={portfolioContent.projects} />
          <Divider />
          <AchievementsSection achievements={portfolioContent.achievements} />
          <Divider />
          <StackSection stackGroups={portfolioContent.stackGroups} />
          <Divider />
          <EducationSection education={portfolioContent.education} />
          <Divider />
          <AboutSection about={portfolioContent.about} />
          <Divider />
          <GitHubActivitySection />
          <footer className="footer full-row">
            <div className="rail footer-rail">
              <div className="footer-left">
                <p className="footer-name">NITESH SAHU</p>
                <p className="footer-sub">AI Systems & Full-Stack Engineer · {portfolioContent.profile.location}</p>
              </div>
              <div className="footer-right">
                <a href={`mailto:${portfolioContent.profile.email}`} className="footer-link">
                  {portfolioContent.profile.email}
                </a>
                <a href={portfolioContent.profile.resumeUrl} target="_blank" rel="noreferrer" className="footer-link">
                  Download Resume PDF ↗
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </ThemeProvider>
  );
}

