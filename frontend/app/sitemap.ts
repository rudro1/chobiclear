import { MetadataRoute } from "next";

const BLOG_POSTS = [
  "how-to-remove-background-from-image-free",
  "chobir-background-remove-bangla",
  "best-background-remover-bangladesh",
  "transparent-background-png-download",
  "remove-background-product-photo",
  "id-card-photo-background-change",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://chobiclear.vercel.app/";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/#pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/#faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes];
}
