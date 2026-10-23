# vurgn.com: Home page (Astro + React islands)

The new Home page only. Every other link (`/services`, `/contact`, `/privacy`…) points at a page that does not exist yet.

## Run it

Needs Node 22.22 or newer. Astro is pinned to 7.4.1 because 7.4.2 requires Node 22.23.4 and this machine has 22.23.3.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static HTML in dist/client, plus the contact endpoint in dist/server
npm run preview   # serves the build (runs in the background; stop with `npx astro preview stop`)
npm test          # contact-form validation tests (node --test)
npm run check     # TypeScript and Astro diagnostics
```

## Where things live

| What | Where |
| --- | --- |
| Design tokens (colour, type, 4px spacing, radius, shadow, motion) | `src/styles/tokens.css` |
| Base styles, field colours, button states, scroll entrances | `src/styles/global.css` |
| **All page copy** (DRAFT, for client review) | `src/content/home.ts` |
| Sanity schema for the `homePage` singleton (not wired up) | `sanity/schemas/homePage.ts` |
| Page | `src/pages/index.astro` |
| Components | `src/components/`: Button, SectionHeading, ServiceCard, ProcessStep, FAQItem, FormField, CTABand, Header, Footer, HeroVisual, ProofFolder |
| React islands | `MobileNav.tsx`, `FAQ.tsx`, `ContactForm.tsx` |
| Small plain scripts (no framework) | hero typing loop in `HeroVisual.astro`, mega-menu toggles and Escape in `Header.astro` |
| Navigation, mega-menu panels, industries | `nav` and `industries` in `src/content/home.ts`; services panel reuses `services` |
| Contact endpoint | `src/pages/api/contact.ts` (the only on-demand route) |
| Shared validation (client and server) | `src/lib/contact.ts`, tests in `src/lib/contact.test.ts` |
| Logo | `src/assets/vurgn-logo.png`, cropped from the live site's logo by `scripts/make-logo.mjs` |
| Sample-deliverable placeholders | `src/assets/samples/*.png`, made by `scripts/render-images.mjs` (made-up data, stamped EXAMPLE) |
| Open Graph image | `public/og/home.png`, made by `scripts/render-images.mjs` |
| Contrast check for every colour pair | `node scripts/contrast.mjs` |
| Lighthouse reports | `reports/` |

To change copy, edit `src/content/home.ts`. Moving to Sanity later means replacing that import with a query that returns the same shape; components do not change.

To replace a sample deliverable with a real case study, edit its entry in `proof`: new `image`, `isExample: false`, and a `link`. The "Example with made-up data" label disappears automatically. Only do this with real, consented client results.

## Contact form

The form validates in the browser and posts JSON to `/api/contact`, which validates again on the server.

- If `CONTACT_WEBHOOK_URL` is **not** set, the endpoint answers `503 not_configured`. The form then shows an error with the email and WhatsApp fallback. It never shows a success message it cannot back up.
- If it **is** set, the endpoint forwards the enquiry as JSON to that URL (a CRM, Zapier/Make/n8n hook, or an email service's webhook). Success is shown only after that request succeeds.

**TODO (client):** choose where enquiries go and set `CONTACT_WEBHOOK_URL`. Spam protection (honeypot or Turnstile) and rate limiting are not added yet.

## Deploy

Pages are static. Only `/api/contact` needs a server, so the project uses an adapter:

- **Default (Node):** `npm run build`, then `node dist/server/entry.mjs` with `HOST`, `PORT` and `CONTACT_WEBHOOK_URL` set. Put it behind a proxy or CDN that applies gzip or brotli. The Node server does not compress: served uncompressed, Lighthouse mobile scored 93 in two of three runs, against 99–100 compressed.
- **Vercel, Netlify or Cloudflare:** run `npx astro add vercel` (or `netlify`, `cloudflare`) to replace `@astrojs/node` in `astro.config.mjs`, then set `CONTACT_WEBHOOK_URL` in the host's environment settings. These hosts compress and cache `/_astro/*` automatically.
- **Purely static hosting:** delete `src/pages/api/contact.ts` and the adapter, and point the form at a hosted form service instead.

- **GitHub Pages (preview):** `.github/workflows/deploy.yml` builds on every push to `main` and publishes `dist/client` to `https://dinesh-dlanzer.github.io/vurgn-site/`. It sets `BASE_PATH=/vurgn-site` so assets resolve under the repo path. Pages is static, so the contact form shows its "could not send" fallback there. Links to pages that do not exist yet (`/services`, `/contact`…) 404. The canonical URL still points at `https://vurgn.com/`. Open Graph, Twitter and the JSON-LD logo point at the preview itself (`DEPLOY_URL`), so a shared preview link shows its own card.

Cache `/_astro/*` as immutable (the file names are hashed). Analytics is not included: add it deferred in `src/layouts/Base.astro` where the TODO is, once there is a property ID.
