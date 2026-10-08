# Molis AI Folio preview

Deploy this branch as a static Vercel **Preview** with authenticated access protection.

- Branch: `codex/folio-vercel-preview`
- Source commit: `d26c807386e14dac79363eaf92b87f69b8cf1f97`
- Framework: Other; no install or build command; output directory: `.`
- Entry: `/demos/brand/folio` (also available at `/`)
- Pages: home, tool, work, solutions, life, story.
- Original React interactions and animations are preserved.
- Contact, community, and knowledge links point to the original Cloudflare application.
- This branch contains only the presentation preview. No backend, database, credentials, or user data is included.

Preserve authenticated/private access protection. `noindex` is not access control.
Do not change the production domain, source application's Sites binding, or database.

Validation completed before export: source type check, 18 unit tests, production build, HTTP checks, and browser regression at desktop/tablet/mobile widths. The exported static preview also passed interaction and responsive browser checks.

Implementation and review: https://github.com/molis-ai/molis-club/pull/16
