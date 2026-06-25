import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const page = readFileSync("app/page.tsx", "utf8");
const shell = readFileSync("components/portfolio-shell.tsx", "utf8");
const heroSection = readFileSync("components/sections/hero-section.tsx", "utf8");
const content = readFileSync("content/portfolio.ts", "utf8");
const route = readFileSync("app/api/github-activity/route.ts", "utf8");
const githubLib = readFileSync("lib/github.ts", "utf8");
const css = readFileSync("app/globals.css", "utf8");

assert(page.includes("PortfolioShell"), "home page should render the portfolio shell");
assert(shell.includes("GitHubActivitySection"), "portfolio shell should include the live GitHub section");
assert(shell.includes("ThemeProvider"), "portfolio shell should include the theme provider");
assert(shell.includes("CommandPalette"), "portfolio shell should include the command palette");
assert(content.includes("SSIPMT Raipur"), "content should include SSIPMT Raipur experience");
assert(content.includes("GDG Lead"), "content should include GDG Lead experience");
assert(content.includes("LawGPT"), "content should include LawGPT project");
assert(content.includes("Vaani.AI"), "content should include Vaani.AI project");
assert(content.includes("Agrisahayak"), "content should include Agrisahayak project");
assert(content.includes("Google Build Blog Marathon 2025"), "content should include Google Build Blog Marathon achievement");
assert(route.includes("fetchGitHubSnapshot"), "GitHub API route should use the shared snapshot helper");
assert(githubLib.includes("https://api.github.com/users/nitesh-20"), "GitHub lib should fetch the public profile");
assert(githubLib.includes("https://api.github.com/graphql"), "GitHub lib should support the GraphQL contribution calendar");
assert(githubLib.includes("process.env.GITHUB_TOKEN"), "GitHub lib should support a server token");
assert(css.includes("--bg: #070708;"), "global styles should define the new dark theme background");
assert(css.includes("repeating-linear-gradient"), "global styles should include the grid-based background theme");
assert(css.includes('font-family: Inter'), "global styles should keep the portfolio typography base");
assert(css.includes(".github-chart-card"), "global styles should include GitHub card styling");
assert(heroSection.includes('className="rail hero-frame"'), "hero section should keep the original rail hero frame");
assert(readFileSync("components/sections/github-activity-section.tsx", "utf8").includes("Coding Activity"), "GitHub section should use the new coding activity theme");
assert(existsSync("public/assets/icons/github.svg"), "public assets should be copied for Next.js");
assert(!existsSync("index.html"), "legacy index.html should be removed");
assert(!existsSync("script.js"), "legacy script.js should be removed");
assert(!existsSync("styles.css"), "legacy styles.css should be removed");
assert(!existsSync("api/github-activity.js"), "legacy Vercel API should be removed");

console.log("Next.js portfolio contract passed.");
