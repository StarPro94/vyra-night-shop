import QRCode from "qrcode";
import fs from "fs";
import path from "path";

const url = process.argv[2] || "https://vyra-night-shop.vercel.app";
const outputDir = path.resolve("public/images");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate SVG QR Code with Vyra branding
const svgString = await QRCode.toString(url, {
  type: "svg",
  errorCorrectionLevel: "H",
  margin: 2,
  width: 1024,
  color: {
    dark: "#66BB6A",
    light: "#0A0A0A",
  },
});

// Parse viewBox to get coordinate system
const viewBoxMatch = svgString.match(/viewBox="0 0 (\d+) (\d+)"/);
const vbSize = viewBoxMatch ? parseInt(viewBoxMatch[1]) : 37;
const center = vbSize / 2;
const logoW = 9;
const logoH = 5;

const logoOverlay = `
  <rect x="${center - logoW / 2 - 0.8}" y="${center - logoH / 2 - 0.8}" width="${logoW + 1.6}" height="${logoH + 1.6}" rx="0.5" fill="#0A0A0A"/>
  <rect x="${center - logoW / 2 - 0.3}" y="${center - logoH / 2 - 0.3}" width="${logoW + 0.6}" height="${logoH + 0.6}" rx="0.3" fill="#141414" stroke="#66BB6A" stroke-width="0.15"/>
  <text x="${center}" y="${center - 0.2}" text-anchor="middle" dominant-baseline="middle" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="3.2" fill="#F5F5F5" letter-spacing="0.3">VYRA</text>
  <text x="${center}" y="${center + 1.8}" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-weight="700" font-size="1.2" fill="#66BB6A" letter-spacing="0.4">NIGHT SHOP</text>
`;

const styledSvg = svgString.replace("</svg>", `${logoOverlay}\n</svg>`);

const svgPath = path.join(outputDir, "vyra-qr-code.svg");
fs.writeFileSync(svgPath, styledSvg, "utf-8");
console.log(`SVG QR Code saved: ${svgPath} (viewBox: ${vbSize}x${vbSize})`);

// PNG version (basic, no logo overlay)
const pngBuffer = await QRCode.toBuffer(url, {
  type: "png",
  errorCorrectionLevel: "H",
  margin: 2,
  width: 1024,
  color: {
    dark: "#66BB6A",
    light: "#0A0A0A",
  },
});

const pngPath = path.join(outputDir, "vyra-qr-code.png");
fs.writeFileSync(pngPath, pngBuffer);
console.log(`PNG QR Code saved: ${pngPath}`);
console.log(`URL: ${url}`);
