// Renders the sample-deliverable placeholders (src/assets/samples/*.png) and the Open Graph image (public/og/home.png)
// from HTML with headless Chrome. All data in them is made up and every image is stamped as an example.
// Run: node scripts/render-images.mjs   (needs Google Chrome; set CHROME_PATH if it is not in the default place)
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const chrome = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const root = resolve(import.meta.dirname, '..');
const font = readFileSync(join(root, 'node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2')).toString('base64');
const logo = readFileSync(join(root, 'src/assets/vurgn-logo.png')).toString('base64');
const tmp = mkdtempSync(join(tmpdir(), 'vurgn-img-'));

const base = (w, h) => `
<style>
  @font-face { font-family: B; src: url(data:font/woff2;base64,${font}) format('woff2'); font-weight: 200 800; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { width: ${w}px; height: ${h}px; overflow: hidden; font-family: B, sans-serif; color: #0d141a; background: #fff; font-size: 22px; line-height: 1.35; }
  .stamp { position: absolute; top: 0; right: 0; background: #2b1660; color: #fff; padding: 18px 28px; font-size: 26px; font-weight: 600; letter-spacing: 0.01em; }
  .logo { height: 44px; width: auto; mix-blend-mode: multiply; }
  h1 { font-size: 54px; font-weight: 600; letter-spacing: -0.03em; line-height: 1; }
  h2 { font-size: 28px; font-weight: 600; letter-spacing: -0.01em; margin-bottom: 18px; }
  .soft { color: #5a546b; }
  .page { position: relative; width: 100%; height: 100%; padding: 56px 64px; }
  .top { display: flex; align-items: center; gap: 28px; margin-bottom: 44px; }
  .chip { display: inline-block; padding: 4px 14px; border-radius: 999px; font-size: 18px; background: #f3f0ff; }
</style>`;

const stamp = '<div class="stamp">EXAMPLE · made-up data</div>';
const head = (title, sub) => `<div class="top"><img class="logo" src="data:image/png;base64,${logo}" alt=""><div><h1>${title}</h1><p class="soft">${sub}</p></div></div>`;

const pages = {
  'ai-visibility-audit': `${base(1600, 1000)}
<style>
  .grid { display: grid; grid-template-columns: 360px 1fr 1fr; gap: 24px; height: 760px; }
  .score { background: #2b1660; color: #fff; padding: 32px; display: flex; flex-direction: column; justify-content: space-between; }
  .score b { font-size: 190px; font-weight: 600; line-height: 0.85; letter-spacing: -0.05em; }
  .panel { background: #f3f0ff; padding: 32px; }
  table { width: 100%; border-collapse: collapse; font-size: 20px; }
  th { text-align: left; font-weight: 600; padding: 0 0 12px; color: #5a546b; font-size: 18px; }
  td { padding: 14px 0; border-top: 2px solid #dfdbe9; vertical-align: top; }
  .y { color: #1d6b3a; font-weight: 600; } .n { color: #b3261e; font-weight: 600; }
  ol { padding-left: 30px; display: grid; gap: 16px; } li::marker { font-weight: 600; color: #543d87; }
</style>
<div class="page">${stamp}${head('AI visibility audit', 'Sample Physio Clinic, Example City · prepared October 2026')}
<div class="grid">
  <section class="score"><h2>Visibility score</h2><p><b>38</b><span style="font-size:40px">/100</span></p><p>Named in 2 of the 12 answers we tested.</p></section>
  <section class="panel"><h2>Questions we tested</h2>
    <table><tr><th>Question</th><th>Google</th><th>ChatGPT</th><th>Gemini</th></tr>
      <tr><td>Best physio near me</td><td class="n">Not shown</td><td class="n">Not named</td><td class="y">3rd</td></tr>
      <tr><td>Physio open on Sunday</td><td class="y">2nd</td><td class="n">Not named</td><td class="n">Not named</td></tr>
      <tr><td>Back pain specialist</td><td class="n">Not shown</td><td class="n">Not named</td><td class="n">Not named</td></tr>
      <tr><td>Sports injury clinic</td><td class="n">Not shown</td><td class="n">Not named</td><td class="n">Not named</td></tr>
    </table></section>
  <section class="panel"><h2>Fixes, in order</h2><ol>
    <li>Complete the Google Business Profile: hours, services, photos.</li>
    <li>Add a page for each treatment that answers the questions above.</li>
    <li>Add FAQ and clinic structured data to the website.</li>
    <li>List the clinic on two trusted health directories.</li>
    <li>Ask recent patients for reviews by WhatsApp after each visit.</li></ol></section>
</div></div>`,

  '90-day-roadmap': `${base(1600, 1000)}
<style>
  .goal { background: #cdb6fa; padding: 24px 32px; font-size: 30px; font-weight: 600; letter-spacing: -0.01em; margin-bottom: 24px; }
  .cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .col { padding: 28px; min-height: 520px; display: flex; flex-direction: column; gap: 14px; }
  .c1 { background: #543d87; color: #fff; } .c2 { background: #f3f0ff; } .c3 { background: #f8f7fb; }
  .task { display: flex; justify-content: space-between; gap: 12px; padding: 14px 16px; background: rgba(255,255,255,0.92); color: #0d141a; }
  .task .chip { flex: none; font-size: 16px; } .you { background: #cdb6fa; }
  .measures { margin-top: 24px; font-size: 22px; }
</style>
<div class="page">${stamp}${head('90-day roadmap', 'Sample Interiors Studio, Example City · agreed October 2026')}
<p class="goal">Goal: 30 qualified enquiries a month from search and WhatsApp by January</p>
<div class="cols">
  <div class="col c1"><h2>Month 1 · Foundations</h2>
    <div class="task">Audit and baseline report<span class="chip">Vurgn</span></div>
    <div class="task">Google Business Profile clean-up<span class="chip">Vurgn</span></div>
    <div class="task">Share past project photos<span class="chip you">Your team</span></div>
    <div class="task">Set up enquiry tracking<span class="chip">Vurgn</span></div></div>
  <div class="col c2"><h2>Month 2 · Build</h2>
    <div class="task">Five service pages<span class="chip">Vurgn</span></div>
    <div class="task">WhatsApp enquiry bot<span class="chip">Vurgn</span></div>
    <div class="task">Approve bot answers<span class="chip you">Your team</span></div>
    <div class="task">Google Ads test, small budget<span class="chip">Vurgn</span></div></div>
  <div class="col c3"><h2>Month 3 · Improve</h2>
    <div class="task">Review results together<span class="chip you">Both</span></div>
    <div class="task">Fix weakest page<span class="chip">Vurgn</span></div>
    <div class="task">Follow-up automation<span class="chip">Vurgn</span></div>
    <div class="task">Decide next quarter<span class="chip you">Both</span></div></div>
</div>
<p class="measures"><b>We report monthly:</b> enquiries · calls · bookings · AI answers that name you</p></div>`,

  'monthly-dashboard': `${base(1600, 1000)}
<style>
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
  .kpi { padding: 24px 28px; background: #f3f0ff; } .kpi b { display: block; font-size: 84px; font-weight: 600; letter-spacing: -0.04em; line-height: 1; margin: 8px 0; }
  .kpi.dark { background: #2b1660; color: #fff; }
  .lower { display: grid; grid-template-columns: 1.3fr 1fr; gap: 20px; }
  .chart { padding: 28px; background: #f8f7fb; }
  .bar { display: grid; grid-template-columns: 210px 1fr 50px; align-items: center; gap: 16px; margin: 18px 0; }
  .bar i { display: block; height: 34px; background: #543d87; }
  .note { padding: 28px; background: #cdb6fa; font-size: 24px; }
  .note p + p { margin-top: 14px; }
</style>
<div class="page">${stamp}${head('Monthly results', 'Sample Dental Care · September 2026')}
<div class="kpis">
  <div class="kpi dark">Enquiries<b>64</b>12 more than August</div>
  <div class="kpi">Calls<b>21</b>from Google profile</div>
  <div class="kpi">Bookings<b>18</b>7 booked after 8 pm</div>
  <div class="kpi">AI answers naming you<b>4/12</b>up from 2/12</div>
</div>
<div class="lower">
  <div class="chart"><h2>Enquiries by channel</h2>
    <div class="bar">Google search<i style="width:100%"></i>26</div>
    <div class="bar">WhatsApp bot<i style="width:69%"></i>18</div>
    <div class="bar">Google Ads<i style="width:46%"></i>12</div>
    <div class="bar">Instagram<i style="width:31%"></i>8</div></div>
  <div class="note"><h2>What changed</h2><p>The WhatsApp bot now answers after-hours questions and offers a slot.</p><p><b>Next month:</b> reminders the day before each appointment, and replies in Hindi.</p></div>
</div></div>`,

  og: `${base(1200, 630)}
<style>
  body { background: #cdb6fa; }
  .og { position: relative; height: 100%; padding: 64px 72px; display: flex; flex-direction: column; justify-content: space-between; }
  .brand { background: #fff; align-self: flex-start; padding: 16px 22px; } .brand img { height: 52px; }
  .og h1 { font-size: 86px; line-height: 0.95; letter-spacing: -0.04em; max-width: 15ch; }
  .disc { position: absolute; right: 72px; bottom: 64px; width: 120px; height: 120px; border-radius: 50%; background: #9c5eee; }
</style>
<div class="og"><div class="brand"><img src="data:image/png;base64,${logo}" alt=""></div>
<h1>AI search &amp; automation for growing businesses</h1><span class="disc"></span></div>`,
};

const sizes = { og: [1200, 630] };
const out = { og: join(root, 'public/og/home.png') };
mkdirSync(join(root, 'public/og'), { recursive: true });
mkdirSync(join(root, 'src/assets/samples'), { recursive: true });

for (const [name, html] of Object.entries(pages)) {
  const [w, h] = sizes[name] ?? [1600, 1000];
  const file = join(tmp, `${name}.html`);
  writeFileSync(file, `<!doctype html><meta charset="utf-8">${html}`);
  const target = out[name] ?? join(root, `src/assets/samples/${name}.png`);
  execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--window-size=${w},${h}`, `--screenshot=${target}`, `file://${file}`], { stdio: 'ignore' });
  console.log('wrote', target);
}
