import { works } from '../content/works';
import { siteUrl } from '../lib/site';
import { StructuredData } from './structured-data';
export function CatalogSchema({
  slugs,
  path,
  name,
}: {
  slugs: readonly string[];
  path: string;
  name: string;
}) {
  return (
    <StructuredData
      json={JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name,
        url: `${siteUrl}${path}`,
        itemListElement: slugs.map((slug, index) => {
          const work = works.find((w) => w.slug === slug)!;
          return {
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'CreativeWork',
              name: work.name,
              url: `${siteUrl}/works/${slug}`,
              description: work.description,
              creativeWorkStatus: work.status,
            },
          };
        }),
      })}
    />
  );
}
