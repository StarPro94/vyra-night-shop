// Vyra Night Shop — QR glow-up generator.
// Usage:
//   node scripts/generate-qr.mjs                     → default URL
//   node scripts/generate-qr.mjs https://…           → custom URL
//
// Output: public/images/vyra-qr-code.{svg,png}

import path from "node:path";
import fs from "node:fs";
import { buildQrGlowupSvg } from "./lib/qr-glowup.mjs";
import { rasterize, ensureDir } from "./lib/svg-utils.mjs";
import { DEFAULT_URL } from "./lib/brand-tokens.mjs";

function parseArgs(argv) {
  let url = DEFAULT_URL;
  for (const arg of argv.slice(2)) {
    if (!arg.startsWith("--")) url = arg;
  }
  return { url };
}

async function main() {
  const { url } = parseArgs(process.argv);
  const outputDir = path.resolve("public/images");
  ensureDir(outputDir);

  const svg = await buildQrGlowupSvg({ url, size: 1024, withFrame: true });

  const svgPath = path.join(outputDir, "vyra-qr-code.svg");
  fs.writeFileSync(svgPath, svg, "utf-8");
  console.log(`SVG written: ${svgPath}`);

  // Framed canvas is 1200×1400. Rasterize at native aspect ratio.
  const pngPath = path.join(outputDir, "vyra-qr-code.png");
  await rasterize(svg, pngPath, { width: 1200, height: 1400, density: 300 });
  console.log(`PNG written: ${pngPath}`);
  console.log(`URL: ${url}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
