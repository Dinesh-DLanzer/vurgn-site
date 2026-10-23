# Vurgn Home page rebuild: report

Built 23 October 2026. Astro 7.4.1 (static output) with React 19.3 islands. Home page only.

## 1. Brand colour

**Primary: `#543d87`**, used unchanged as `--brand-primary`.

How it was found (in Chrome, on https://vurgn.com/):

- Computed `background-color` of the filled buttons ("Get Started"): `rgb(84, 61, 135)` = `#543d87`. The coloured link on the page uses the same value.
- The site's Elementor kit defines it as a global colour (`--e-global-color-5420d44: #543d87`), and WordPress defines it as preset `color-3`.
- The logo (`/wp-content/uploads/2026/08/24605.png`, 800×800) is a black "Vurgn" wordmark on white with a violet full stop. Its most common pixel value is `#9c5eee`. It is kept as `--brand-violet` and used for shapes only.
- The other brand globals were kept as the palette: `#2b1660` (deep), `#f3f0ff` (wash), `#cdb6fa` (lavender), `#0d141a` (ink). The neutral scale is tinted toward the primary's hue.

Contrast, checked with `node scripts/contrast.mjs` (every pair the page uses passes):

| Pair | Ratio | Needed |
| --- | --- | --- |
| White text on `#543d87` / `#543d87` text on white | 8.77:1 | 4.5:1 |
| Ink on wash `#f3f0ff` | 16.53:1 | 4.5:1 |
| Ink on lavender `#cdb6fa` | 10.31:1 | 4.5:1 |
| White on deep `#2b1660` | 15.15:1 | 4.5:1 |
| Error `#ffc2bb` on the primary form card | 5.72:1 | 4.5:1 |
| Input edge (white) on the primary card | 8.77:1 | 3:1 |

**Shade adjustments: none needed for the primary.** The logo violet `#9c5eee` scores only 4.0:1 on white, so it is never used for text, only for shapes (the hero's full-stop disc and the highlight behind dark text). The Why section's highlighted text sits on violet in ink at 4.64:1.

## 2. Lighthouse (production build, mobile preset, Lighthouse 13.5.0)

Measured on `dist/client` served with gzip (`serve@14.2.6`), the way a static host or CDN serves it. Default mobile preset: simulated slow 4G, 4× CPU slowdown.

| Run | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT | FCP |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 100 | 100 | 100 | 100 | 1.4 s | 0 | 0 ms | 0.9 s |
| 2 | 100 | 100 | 100 | 100 | 1.4 s | 0 | 0 ms | 0.9 s |
| 3 | 100 | 100 | 100 | 100 | 1.4 s | 0 | 0 ms | 0.9 s |

Re-run after the second round (typing hero, mega menu, process accordion). In the first round, one of three runs scored 99 with LCP 2.0 s.

Targets: Performance 95+ ✓, Accessibility 100 ✓, Best Practices 95+ ✓, SEO 100 ✓, LCP under 2.0 s ✓, CLS under 0.05 ✓ (the typing animation reserves its space, so CLS stays 0).

Desktop preset, one run: 100 / 100 / 100 / 100, LCP 0.3 s, CLS 0, **no JavaScript files loaded**, 62 KB total.

**Uncompressed caveat:** the same build served by Astro's Node preview server, which does not compress, scored Performance 93, 93 and 100 (LCP 3.0, 3.0 and 1.7 s). The deploy therefore needs gzip or brotli in front, which every mainstream host provides. All reports are in `reports/`; the uncompressed ones are named `*-uncompressed-node-preview-*`.

## 3. JavaScript on the Home page

| File | Raw | Gzip | Loads when |
| --- | --- | --- | --- |
| Inline Astro island loader | 5.3 KB | n/a (inline) | always |
| Inline hero typing script (plain JS) | 0.8 KB | n/a (inline) | always; paused off screen |
| Inline mega-menu script (plain JS) | 0.8 KB | n/a (inline) | always |
| `client.js` (react-dom) | 208 KB | 64.1 KB | first island hydrates |
| `react.js` + `jsx-runtime.js` | 8.1 KB | 3.3 KB | first island hydrates |
| `MobileNav.js` | 1.9 KB | 0.8 KB | phones and tablets, at load |
| `FAQ.js` | 1.0 KB | 0.5 KB | 300px before the FAQ scrolls into view |
| `ContactForm.js` | 6.9 KB | 2.7 KB | 300px before the form scrolls into view |

- **Desktop first load: 0 KB** of JS files (only 6.9 KB of inline script: the island loader plus the two small plain scripts).
- **Mobile first load: about 70 KB gzip** (Lighthouse measured 70 KB transferred), almost all of it the React runtime, needed because the Menu button is visible.
- **Everything hydrated: about 73 KB gzip.**

Swapping React for Preact (`@astrojs/preact` with compat) would cut about 60 KB. I did not do it because the brief names React.

## 4. Islands and why each hydrates

| Island | Directive | Why it needs JS | Why this directive |
| --- | --- | --- | --- |
| `MobileNav` | `client:visible` | Open/close state, `aria-expanded`, a native modal `<dialog>` (focus trap, Escape, inert page), focus returned to the button | The button is `display:none` from 1024px, so desktop never hydrates it. Confirmed in Chrome: no React requests on desktop. |
| `FAQ` | `client:visible` (300px margin) | Accordion state, `aria-expanded`/`aria-controls`, one answer open at a time | Far below the fold. The margin hydrates it just before it is seen. |
| `ContactForm` | `client:visible` (300px margin) | Validation, error/loading/success states, the submit request | Last section before the footer. |

No `client:load` anywhere. Two small plain scripts (no framework) were added in the second round, at the client's request:

- **Hero:** types each customer question, then shows the answer and New enquiry → Replied → Booked one at a time. Hidden copies of every question reserve the bubble's size, so nothing shifts. It pauses off screen and in hidden tabs. Reduced motion, or no script, shows the full first frame.
- **Header mega menu:** Services and Industries panels open on hover (CSS). The toggle buttons give keyboard and touch users the same panels, with `aria-expanded`. Escape closes and returns focus (WCAG 1.4.13). Links in a closed panel can't be focused.

Everything else is plain `.astro` with no client JS. The process section's hover accordion (vertical titles, the hovered or focused stage opens) is CSS only, applies only with a mouse from 1024px, and keeps its text available to screen readers when closed. Motion is CSS only: the masked headline on load, scroll-driven entrances via `animation-timeline: view()` (browsers without support show the finished state), and a hover or press response on every control. All of it sits inside `prefers-reduced-motion: no-preference`.

## 5. Checked and working

- **Form, in Chrome against the real endpoint:**
  - An empty submit gives 3 field errors, focus moves to the first one and the alert announces the count. Each error is linked through `aria-describedby`, and errors clear as fields are corrected.
  - A valid submit with a webhook configured shows the success message, and the local test receiver got the payload.
  - With no webhook configured, the endpoint returns 503, the form shows an error with the email and WhatsApp fallback, and the button reads "Try again".
  - The server answers incomplete submissions with 422 and field errors, and malformed bodies with 400 (curl). A native form-encoded post is parsed the same way.
- **FAQ:** `aria-expanded` toggles, one panel is open at a time, and questions are `h3 > button`.
- **Mobile drawer:** opens as a modal, focus goes to Close, and `aria-expanded` follows. Closing now returns focus to the Menu button (fixed after testing).
- **Validation tests:** `npm test` (4 tests) pass. `astro check` reports 0 errors, warnings or hints.
- **SEO:**
  - Title is 53 characters, description 142, and the title matches the H1.
  - Canonical is `https://vurgn.com/`. OG and Twitter tags point at the local 1200×630 image.
  - There is exactly one H1 and headings run in order.
  - JSON-LD has Organization and FAQPage (6 questions, built from the FAQ data), with no ratings or reviews.
- **No console errors** in Chrome after scrolling the whole page.

## 6. Design direction (taste skill)

The "taste" skill is not registered in this workspace. I followed the copy installed at `AI Studio/.claude/skills/design-taste-frontend` (tasteskill v2) and ran its scripts.

- **Direction dealt:** "Colour chapters", seed 278734503, with the brand palette kept (`--keep palette`). Each section is a flat field of a brand colour, sharing one type face and one grid.
- **Idea:** the full stop in the "Vurgn." logo becomes the answer. A customer's question (a large "?") resolves into the logo's violet full stop, and the chapter headings end with a full stop.
- **Live element:** the hero's AI-chat tile cycles through three customer questions (clinic, restaurant, property) answered with "your business". It is CSS only, and reduced motion shows the first question.
- **Redraws and substitutions, with reasons:**
  - **Type:** the dealt Cabinet Grotesk, and the redraw Pilcrow Rounded, are Fontshare-only. The brief requires @fontsource, so I used the library's `bricolage-contrast` system: Bricolage Grotesque, self-hosted, one variable `wght` latin file of 41 KB. The optical-size axis was skipped to save 36 KB. The font is not preloaded; see §7.
  - **Hero:** the blueprint wants four photographs in the mosaic. These were drawn in CSS/SVG as the brief asks.
  - **About section:** team portraits replaced first by a two-column highlighted statement. After client feedback (it read as a wall of text) it is now a wash panel with the case and the consultation button, beside the four differentiators as a 2×2 list of headed statements. Each title ends in the logo's violet full stop.
  - **Proof section:** client logos replaced by stacked folders, because there are no clients to show yet.
  - **Contact section:** the address rows replaced by a coupon form, because there is no confirmed address and the brief needs a form.
  - **Process:** shown as four open panels rather than an accordion, so it needs no JS.
- **Inspector** (`inspect.mjs` at 1440, 768 and 390 px, last run before two non-visual island fixes):
  - **1 FAIL, defended:** "covered text" where the sample folders pile up as you scroll. That pile-up is the dealt blueprint's own mechanism, and each description is fully visible while its folder is on top.
  - **1 WARN, defended:** "no footage". The brief rules out stock or third-party media, and no honest clip exists.
  - **Lint:** clean. The drawer's shadow is marked as an allowed overlay.
- **Look-and-fix round:** I fixed a broken services grid (a grid area named `auto`), the Why columns, a FAQ heading colliding with the list, the CTA word not spanning the width, mobile hero chips, and scroll entrances the minifier had silently broken. I did not compute the skill's formal weighted critique score.

## 7. Decisions taken instead of asking

- **H1:** "AI search & automation for growing businesses". The ampersand keeps it to two lines at 360px. On phones it sets at about 29px; anything larger breaks onto three lines.
- **Service page URLs:** `/services/ai-search-seo`, `/services/ai-chatbots-voice-agents`, `/services/business-automation`, `/services/websites-paid-media`. The other routes are `/industries`, `/case-studies`, `/pricing`, `/about`, `/blog`, `/contact`, `/privacy` and `/terms`.
- **Form fields:**
  - Required: name, email and consent.
  - Optional: phone/WhatsApp and the one-line goal.
  - The service select defaults to "Not sure yet".
- **Endpoint:** forwards to `CONTACT_WEBHOOK_URL` when set, otherwise returns 503. No honeypot or rate limit yet.
- **Adapter:** `@astrojs/node`, because one endpoint needs a server and the host is unknown. The README explains how to swap it.
- **Copy marking:** marked DRAFT in the content file (`copyStatus: 'draft'` plus a header note), not with a visible banner on the page.
- **Industries list:** the "Who we work with" tile uses only the sectors the current site already names.
- **Logo:** cropped from the live site's PNG, not redrawn. The footer uses it at large size with `mix-blend-mode: multiply`.
- **No font preload (deviation from the brief):** on the live GitHub Pages site, Chrome treated the preloaded font as render-blocking and held the first paint for about 2 s even though the font had arrived. PageSpeed mobile Speed Index was 4.4 s (Performance 97). Without the preload, live runs score Performance 100, Speed Index 1.3–1.6 s, LCP 1.0–1.2 s and CLS 0.002 (font swap onto the size-matched fallback).
- **Pinned Astro 7.4.1:** 7.4.2 needs Node 22.23.4, and this machine has 22.23.3.

## 8. Not verified, or needs the client

- **Copy:** all copy is DRAFT, including the four differentiators (one plan, scoped start with a baseline, monthly plain-language report, everything in the client's name), which are commitments the client must confirm they keep. "We reply by email or WhatsApp" and "no obligation" also need confirming.
- **Sample deliverables:** made-up data (fictional clinic, studio and dental practice names), stamped EXAMPLE in the image and captioned under it. Replace them with real, consented case studies when available.
- **Real phones:** not tested on real devices or Safari/Firefox. Only Chrome (desktop) and the inspector's emulated 390px and 768px views. The drawer was tested in desktop Chrome by forcing the button visible, because the window would not shrink below 1200px.
- **Screen readers:** no manual pass with VoiceOver or NVDA. Lighthouse and axe checks pass.
- **Structured data:** not run through Google's Rich Results Test (external). The JSON parses and contains the intended types.
- **Pre-hydration:** the form and FAQ need JS. Before hydration, the FAQ answers are hidden and the Menu button does nothing. The form falls back to a native POST to the endpoint, which returns JSON.
- **Pending decisions:** analytics (no property ID given), postal address and legal entity (left out deliberately), and the enquiry destination (`CONTACT_WEBHOOK_URL`).
- **Other pages:** `/privacy`, `/terms` and every linked page do not exist yet. The consent checkbox links to `/privacy`, which must exist before launch.
