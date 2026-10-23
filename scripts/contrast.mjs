// WCAG contrast for every ground/foreground pair the page uses. Run: node scripts/contrast.mjs
const L = (hex) => { const c = hex.match(/\w\w/g).map((h) => parseInt(h, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const pairs = [
  // [ground, foreground, use, minimum]
  ['#ffffff', '#0d141a', 'paper: text', 4.5], ['#ffffff', '#5a546b', 'paper: soft text', 4.5], ['#ffffff', '#543d87', 'paper: link/primary', 4.5],
  ['#543d87', '#ffffff', 'primary: text on button', 4.5], ['#ffffff', '#9c5eee', 'paper: logo violet (shape)', 3], ['#ffffff', '#b3261e', 'paper: error', 4.5],
  ['#f3f0ff', '#0d141a', 'wash: text', 4.5], ['#f3f0ff', '#5a546b', 'wash: soft text', 4.5], ['#f3f0ff', '#543d87', 'wash: link', 4.5], ['#f3f0ff', '#b3261e', 'wash: error', 4.5],
  ['#cdb6fa', '#0d141a', 'lavender: text', 4.5], ['#cdb6fa', '#2b1660', 'lavender: deep text/focus', 4.5], ['#cdb6fa', '#543d87', 'lavender: primary button edge', 3],
  ['#543d87', '#f3f0ff', 'primary field: wash text', 4.5], ['#543d87', '#cdb6fa', 'primary field: lavender focus', 3], ['#543d87', '#ffc2bb', 'primary field: error', 4.5], ['#543d87', '#b5ebc6', 'primary field: success', 4.5],
  ['#2b1660', '#ffffff', 'deep: text', 4.5], ['#2b1660', '#cdb6fa', 'deep: soft text/focus', 4.5], ['#2b1660', '#543d87', 'deep: primary tile edge', 1],
  ['#9c5eee', '#0d141a', 'violet panel: text', 4.5], ['#0d141a', '#ffffff', 'ink button: text', 4.5], ['#ffffff', '#77708a', 'input border n-500 (UI)', 3],
  ['#543d87', '#ffffff', 'primary card: white input edge', 3], ['#ffffff', '#1d6b3a', 'paper: success', 4.5],
];
let fail = 0;
for (const [g, f, use, min] of pairs) { const r = ratio(g, f); const ok = r >= min; if (!ok) fail++; console.log(`${ok ? 'pass' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1  (need ${min})  ${f} on ${g}  ${use}`); }
process.exitCode = fail ? 1 : 0;
