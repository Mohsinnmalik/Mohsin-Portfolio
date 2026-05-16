import type { Metadata } from "next";
import dynamic from "next/dynamic";

// BUG-17 FIX: Metadata is fully defined in layout.tsx for the root route.
// Defining it again here was a maintenance hazard — any update had to be made in two files.
// layout.tsx metadata applies to all child routes; page-level metadata here is unnecessary.
export const metadata: Metadata = {
  // Canonical is the only override needed at page level to ensure accuracy
  alternates: {
    canonical: "https://mohsin-portfolio-orpin.vercel.app",
  },
};

// FIX: ssr:false is REQUIRED — MainApp renders Scene3D (Three.js/WebGL) which crashes on the server.
// React's insertBefore hydration error is caused by server-rendered DOM not matching WebGL canvas output.
// Metadata above handles SEO without any server rendering of the component tree.
const MainApp = dynamic(() => import("@/components/MainApp"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#0a0f1d]" />,
});

export default function Page() {
  return <MainApp />;
}
