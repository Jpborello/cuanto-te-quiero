import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/admin/",
                "/api/",
            ],
        },
        sitemap: "https://www.cuantotequiero.com.ar/sitemap.xml",
    };
}
