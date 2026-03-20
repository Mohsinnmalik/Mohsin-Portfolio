import type { Metadata, Viewport } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });

export const metadata: Metadata = {
  title: "Mohsin Malik | Full Stack Engineer & AI Product Builder",
  description: "Portfolio of Mohsin Malik, a Full Stack Developer & AI Product Builder specializing in scalable SaaS platforms, AI-integrated applications, and high-performance web systems. Founder @ CodeFlux.",
  keywords: ["Mohsin Malik", "Full Stack Engineer", "AI Product Builder", "Startup Founder", "CodeFlux", "SaaS Developer", "Web Architect", "AI Workshops"],
  authors: [{ name: "Mohsin Malik" }],
  creator: "Mohsin Malik",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mohsinnmalik.github.io/Mohsin-Portfolio/",
    title: "Mohsin Malik | Full Stack Engineer & AI Product Builder",
    description: "I build real-world web products. Founder @ CodeFlux.",
    siteName: "Mohsin Malik Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohsin Malik | Full Stack Engineer & AI Product Builder",
    description: "I build real-world web products. Founder @ CodeFlux.",
    creator: "@mohsinnmalik",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0f1d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${firaCode.variable} font-sans antialiased bg-black text-white relative`}>
        {children}
      </body>
    </html>
  );
}
