import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.paperdrill.me";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/saved"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
