import { works } from '../../content/works';
import stories from '../../content/stories.json';
import { publiclyIndexable, siteUrl } from '../../lib/site';
export function GET() {
  // No private URLs are advertised as indexable during the owner-only preview.
  const paths = publiclyIndexable
    ? [
        '/',
        '/products',
        '/solutions',
        ...works.map((w) => `/works/${w.slug}`),
        ...stories.map((s) => `/story/${s.slug}`),
      ]
    : [];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${siteUrl}${path}</loc></url>`).join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
}
