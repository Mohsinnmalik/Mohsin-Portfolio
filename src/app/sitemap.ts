import type { MetadataRoute } from "next";

// SEO: Sitemap for all routes — tells Google what pages exist and when they were updated
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://mohsin-portfolio-orpin.vercel.app",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
