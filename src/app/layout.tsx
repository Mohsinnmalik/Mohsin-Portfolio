import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });

export const metadata: Metadata = {
  title: "AI Engineer | Building Scalable Intelligent Systems",
  description: "Portfolio of an AI Engineer specializing in scalable intelligent systems, backend architecture, and machine learning solutions.",
  keywords: "AI Engineer, Machine Learning, Full-Stack Architect, Next.js, Product Designer",
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
