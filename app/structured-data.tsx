// Callers serialize only the same editorial facts that are visible on the page.
export function StructuredData({ json }: { json: string }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, '\\u003c') }}
    />
  );
}
