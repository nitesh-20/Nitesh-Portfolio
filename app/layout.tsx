import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Nitesh Sahu Portfolio",
  description: "Nitesh Sahu's portfolio as a Computer Science undergraduate & GDG Lead.",
  icons: {
    icon: "/assets/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
