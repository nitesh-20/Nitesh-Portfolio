import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://niteshsahu.vercel.app"),
  title: "Nitesh Sahu | AI Systems & Full-Stack Engineer",
  description:
    "Portfolio of Nitesh Sahu — AI Systems & Full-Stack Engineer specializing in production LLM infrastructure, real-time Voice AI, and autonomous multi-agent workflows.",
  keywords: [
    "Nitesh Sahu",
    "AI Systems Engineer",
    "Full-Stack Engineer",
    "LLM Infrastructure",
    "Voice AI",
    "Agentic AI",
    "LangGraph",
    "FastAPI",
    "React",
    "GDG Lead",
    "Bengaluru",
  ],
  authors: [{ name: "Nitesh Sahu", url: "https://github.com/nitesh-20" }],
  creator: "Nitesh Sahu",
  icons: {
    icon: "/assets/favicon.svg",
  },
  openGraph: {
    title: "Nitesh Sahu | AI Systems & Full-Stack Engineer",
    description:
      "AI Systems & Full-Stack Engineer specializing in production LLM infrastructure, real-time Voice AI, and autonomous multi-agent workflows.",
    url: "https://niteshsahu.vercel.app",
    siteName: "Nitesh Sahu Portfolio",
    images: [
      {
        url: "/assets/profile.jpeg",
        width: 800,
        height: 800,
        alt: "Nitesh Sahu - AI Systems & Full-Stack Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nitesh Sahu | AI Systems & Full-Stack Engineer",
    description:
      "AI Systems & Full-Stack Engineer specializing in production LLM infrastructure, real-time Voice AI, and autonomous multi-agent workflows.",
    creator: "@Niteshsahu2001",
    images: ["/assets/profile.jpeg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nitesh Sahu",
  jobTitle: "AI Systems & Full-Stack Engineer",
  url: "https://niteshsahu.vercel.app",
  sameAs: [
    "https://github.com/nitesh-20",
    "https://www.linkedin.com/in/niteshsahu20/",
    "https://x.com/Niteshsahu2001",
  ],
  knowsAbout: [
    "AI Systems",
    "LLM Infrastructure",
    "Voice AI",
    "Agentic Workflows",
    "LangGraph",
    "FastAPI",
    "React",
    "Full-Stack Development",
  ],
  worksFor: {
    "@type": "Organization",
    name: "GDG on Campus SSIPMT Raipur",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
