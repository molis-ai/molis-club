import { knowledge } from '../../content/knowledge';
import { artistSkills } from '../../content/artists';
import stories from '../../content/stories.json';
import { publiclyIndexable, siteUrl } from '../../lib/site';

// 新站的页面清单。私有试用期间不公开任何可收录的地址（publiclyIndexable 为 false 时为空）。
export function GET() {
  const paths = publiclyIndexable
    ? [
        '/',
        '/work',
        '/tool',
        '/enterprise',
        '/community',
        '/community/methods',
        ...knowledge.map((entry) => `/community/methods/${entry.slug}`),
        ...artistSkills.map(
          (skill) => `/community/methods/artists/${skill.slug}`,
        ),
        '/about',
        '/team',
        '/essays',
        ...stories.map((story) => `/essays/${story.slug}`),
        '/along-the-way',
        '/contact',
        '/privacy',
      ]
    : [];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${siteUrl}${path}</loc></url>`).join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
}
