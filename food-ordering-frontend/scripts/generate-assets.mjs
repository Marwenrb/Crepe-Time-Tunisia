/**
 * generate-assets.mjs — Generate OG image + crisp favicons from existing logo
 * Run: node scripts/generate-assets.mjs
 */
import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");
const LOGO = join(PUBLIC, "crepe-time-logo.png");

const PURPLE_BG = "#4C1D95";
const DARK_BG = "#1E1042";

async function generateOGImage() {
  console.log("🎨 Generating OG social sharing image (1200×630)...");

  // Load the logo and resize to fit nicely in the card
  const logoBuffer = await sharp(LOGO)
    .resize(360, 360, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Create the SVG overlay with text
  const textOverlay = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#1E1042"/>
          <stop offset="50%" stop-color="${PURPLE_BG}"/>
          <stop offset="100%" stop-color="#1E1042"/>
        </linearGradient>
        <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F5D16B"/>
          <stop offset="100%" stop-color="#D4AF37"/>
        </linearGradient>
        <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="transparent"/>
          <stop offset="15%" stop-color="#D4AF37"/>
          <stop offset="85%" stop-color="#D4AF37"/>
          <stop offset="100%" stop-color="transparent"/>
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bg)"/>

      <!-- Subtle border -->
      <rect x="24" y="24" width="1152" height="582" rx="16" fill="none" stroke="#D4AF37" stroke-width="2" opacity="0.4"/>

      <!-- Gold divider line -->
      <line x1="120" y1="430" x2="1080" y2="430" stroke="url(#goldLine)" stroke-width="1.5"/>

      <!-- Brand name -->
      <text x="600" y="480" text-anchor="middle" font-family="Georgia,Times,serif" font-size="58" font-weight="bold" fill="url(#gold)" letter-spacing="4">Crêpe Time</text>

      <!-- Tagline -->
      <text x="600" y="535" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="26" fill="#E8D5B7" letter-spacing="6" opacity="0.9">THE SWEETEST ESCAPE</text>

      <!-- CTA subtitle -->
      <text x="600" y="585" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="20" fill="#D4AF37" letter-spacing="2" opacity="0.7">Crêperie Premium à Nabeul · Commande en ligne</text>
    </svg>
  `);

  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 30, g: 16, b: 66, alpha: 255 },
    },
  })
    .composite([
      { input: textOverlay, top: 0, left: 0 },
      { input: logoBuffer, top: 20, left: 420, blend: "over" },
    ])
    .png({ quality: 90 })
    .toFile(join(PUBLIC, "og-image.png"));

  console.log("  ✅ og-image.png (1200×630)");
}

async function generateFavicons() {
  console.log("🔧 Regenerating crisp favicons from logo...");

  // Favicon 32x32 — use the whole logo, sharp will downscale crisply
  await sharp(LOGO)
    .resize(32, 32, { fit: "contain", background: { r: 76, g: 29, b: 149, alpha: 255 } })
    .png()
    .toFile(join(PUBLIC, "favicon-32x32.png"));
  console.log("  ✅ favicon-32x32.png");

  // Favicon 16x16
  await sharp(LOGO)
    .resize(16, 16, { fit: "contain", background: { r: 76, g: 29, b: 149, alpha: 255 } })
    .png()
    .toFile(join(PUBLIC, "favicon-16x16.png"));
  console.log("  ✅ favicon-16x16.png");

  // Apple touch icon 180x180
  await sharp(LOGO)
    .resize(180, 180, { fit: "contain", background: { r: 76, g: 29, b: 149, alpha: 255 } })
    .png()
    .toFile(join(PUBLIC, "apple-touch-icon.png"));
  console.log("  ✅ apple-touch-icon.png (180×180)");

  // Android chrome 192x192
  await sharp(LOGO)
    .resize(192, 192, { fit: "contain", background: { r: 76, g: 29, b: 149, alpha: 255 } })
    .png()
    .toFile(join(PUBLIC, "android-chrome-192x192.png"));
  console.log("  ✅ android-chrome-192x192.png");

  // Android chrome 512x512
  await sharp(LOGO)
    .resize(512, 512, { fit: "contain", background: { r: 76, g: 29, b: 149, alpha: 255 } })
    .png()
    .toFile(join(PUBLIC, "android-chrome-512x512.png"));
  console.log("  ✅ android-chrome-512x512.png");

  // Maskable icon 512x512 — extra padding for safe zone (80% of icon area)
  const maskableSize = 512;
  const logoInMaskable = Math.round(maskableSize * 0.65); // 65% to stay within safe zone
  const maskableLogo = await sharp(LOGO)
    .resize(logoInMaskable, logoInMaskable, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: maskableSize,
      height: maskableSize,
      channels: 4,
      background: { r: 76, g: 29, b: 149, alpha: 255 },
    },
  })
    .composite([{
      input: maskableLogo,
      top: Math.round((maskableSize - logoInMaskable) / 2),
      left: Math.round((maskableSize - logoInMaskable) / 2),
    }])
    .png()
    .toFile(join(PUBLIC, "maskable-icon-512x512.png"));
  console.log("  ✅ maskable-icon-512x512.png (with safe zone padding)");

  // Generate ICO from 16x16 and 32x32 — sharp can output ico-compatible PNG
  // Most browsers accept PNG-in-ICO, and the .ico is already there
  // Just regenerate the 32x32 as favicon.ico
  await sharp(LOGO)
    .resize(32, 32, { fit: "contain", background: { r: 76, g: 29, b: 149, alpha: 255 } })
    .toFormat("png")
    .toFile(join(PUBLIC, "favicon.ico"));
  console.log("  ✅ favicon.ico (32×32)");
}

async function main() {
  console.log("\n━━━ Crêpe Time Asset Generator ━━━\n");
  await generateOGImage();
  await generateFavicons();
  console.log("\n✨ All assets generated!\n");
}

main().catch((err) => {
  console.error("❌ Asset generation failed:", err);
  process.exit(1);
});
