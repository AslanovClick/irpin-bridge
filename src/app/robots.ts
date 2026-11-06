import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

/** robots.txt: службові сторінки закриті від індексації (на них також стоїть noindex) */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cart", "/checkout", "/order/", "/request/", "/search", "/styleguide"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
