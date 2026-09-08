import { publiclyIndexable, siteUrl } from '../../lib/site';
export function GET() {
  return new Response(
    publiclyIndexable
      ? `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /account\nSitemap: ${siteUrl}/sitemap.xml\n`
      : 'User-agent: *\nDisallow: /\n',
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}
