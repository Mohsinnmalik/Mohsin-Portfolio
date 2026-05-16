import type { Metadata, Viewport } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });

// SEO: Canonical URL updated to live Vercel deployment
const SITE_URL = "https://mohsin-portfolio-orpin.vercel.app";

export const metadata: Metadata = {
  title: "Mohsin Malik | Full Stack Engineer & AI Product Builder",
  description: "Portfolio of Mohsin Malik — Full Stack Developer & AI Product Builder specializing in scalable SaaS platforms, AI-integrated applications, and high-performance web systems. Founder @ CodeFlux.",
  keywords: ["Mohsin Malik", "Full Stack Engineer", "AI Product Builder", "Startup Founder", "CodeFlux", "SaaS Developer", "Web Architect", "AI Workshops", "Next.js Developer", "React Developer"],
  authors: [{ name: "Mohsin Malik", url: SITE_URL }],
  creator: "Mohsin Malik",
  // SEO: Canonical link to prevent duplicate content penalties
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Mohsin Malik | Full Stack Engineer & AI Product Builder",
    description: "Full Stack Engineer specializing in AI-powered products, Next.js, React, and Three.js. Founder @ CodeFlux. Available for freelance and full-time roles.",
    siteName: "Mohsin Malik Portfolio",
    // SEO: OG image for rich social previews
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Mohsin Malik — Full Stack Engineer & AI Product Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohsin Malik | Full Stack Engineer & AI Product Builder",
    description: "Full Stack Engineer specializing in AI-powered products, Next.js, React, and Three.js. Founder @ CodeFlux.",
    creator: "@mohsinnmalik",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // BUG-25 FIX: Removed maximumScale:1 and userScalable:false
  // These violate WCAG 2.1 SC 1.4.4 — users with visual impairments need pinch-to-zoom
  themeColor: "#0a0f1d",
};

// SEO: JSON-LD Person schema for Google Knowledge Panel eligibility
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mohsin Malik",
  url: SITE_URL,
  jobTitle: "Full Stack Engineer & AI Product Builder",
  description: "Full Stack Developer specializing in scalable SaaS platforms, AI-integrated applications, and high-performance web systems. Founder @ CodeFlux.",
  founder: {
    "@type": "Organization",
    name: "CodeFlux",
  },
  sameAs: [
    "https://github.com/mohsinnmalik",
    // BUG-20/21 FIX: Standardized to full LinkedIn URL matching the footer link
    "https://www.linkedin.com/in/mohsin-malik-0382b629b",
  ],
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "Three.js",
    "AI Integration",
    "SaaS Development",
    "Full Stack Engineering",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${firaCode.variable} font-sans antialiased bg-black text-white relative`} suppressHydrationWarning>
        {/* SEO: JSON-LD structured data for Google Knowledge Panel */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
