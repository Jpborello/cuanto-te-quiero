import { SITE_URL, getActiveCategoriesWithSubcategories, slugify } from "@/lib/catalog";

export const revalidate = 3600;

// llms.txt: plain-language summary of the store for AI assistants (https://llmstxt.org)
export async function GET() {
    const categories = await getActiveCategoriesWithSubcategories();

    const catalog = categories
        .filter((c) => c.name.toLowerCase() !== "general")
        .map((c) => {
            const categoryUrl = `${SITE_URL}/categoria/${slugify(c.name)}`;
            const subs = c.subcategories
                .map((s) => `  - [${s.name}](${categoryUrl}/${slugify(s.name)})`)
                .join("\n");
            return `- [${c.name}](${categoryUrl})${subs ? `\n${subs}` : ""}`;
        })
        .join("\n");

    const body = `# Cuanto Te Quiero

> Tienda de Rosario (Santa Fe, Argentina) especializada en muebles infantiles y juveniles, cunas, blanquería, accesorios para bebés, coches y rodados, indumentaria y artículos para futura mamá. Atención personalizada en el local y consultas por WhatsApp.

## Datos del negocio

- Dirección: Mendoza 6378, Rosario, Santa Fe, Argentina
- WhatsApp: +54 9 341 602-9814 (https://wa.me/5493416029814)
- Instagram: https://www.instagram.com/cuanto_tequiero/
- Facebook: https://www.facebook.com/cuantotequieroCTQ
- Sitio: ${SITE_URL}
- Las compras y consultas se coordinan por WhatsApp.

## Catálogo

${catalog}

## Páginas

- [Inicio](${SITE_URL})
- [Sobre nosotros](${SITE_URL}/sobre-nosotros)
- [Preguntas frecuentes](${SITE_URL}/preguntas-frecuentes): devoluciones, garantía, armado de muebles y entregas
- [Sitemap con todos los productos](${SITE_URL}/sitemap.xml)
`;

    return new Response(body, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}
