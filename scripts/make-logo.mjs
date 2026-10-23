// Crops the client's square logo (vurgn.com/wp-content/uploads/2026/08/24605.png) to the wordmark and makes favicons.
import sharp from 'sharp';
const src = new URL('./logo-source.png', import.meta.url).pathname;
// Ink box measured in the browser: x 126–673, y 312–486 on the 800×800 file.
await sharp(src).extract({ left: 110, top: 296, width: 580, height: 206 }).png().toFile('src/assets/vurgn-logo.png');
await sharp(src).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(src).resize(48, 48).png().toFile('public/favicon.png');
await sharp(src).extract({ left: 110, top: 296, width: 580, height: 206 }).png().toFile('public/vurgn-logo.png');
console.log('ok');
