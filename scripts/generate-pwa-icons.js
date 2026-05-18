const sharp = require("sharp")
const path = require("path")
const fs = require("fs")

const SIZES = [192, 384, 512]
const PUBLIC_DIR = path.join(__dirname, "..", "public", "icons")
const LOGO_PATH = path.join(__dirname, "..", "public", "logo.webp")

async function generateIcons() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true })
  }

  const logoExists = fs.existsSync(LOGO_PATH)

  for (const size of SIZES) {
    const outputPath = path.join(PUBLIC_DIR, `icon-${size}x${size}.png`)

    if (logoExists) {
      await sharp(LOGO_PATH)
        .resize(size, size, { fit: "contain", background: { r: 37, g: 99, b: 235, alpha: 1 } })
        .png()
        .toFile(outputPath)
      console.log(`Generated ${outputPath} from logo`)
    } else {
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <rect width="${size}" height="${size}" rx="${Math.round(size * 0.167)}" fill="#2563eb"/>
          <text x="${size / 2}" y="${size * 0.625}" 
                text-anchor="middle" font-family="Arial, sans-serif" 
                font-size="${Math.round(size * 0.375)}" font-weight="bold" fill="white">S</text>
        </svg>`

      await sharp(Buffer.from(svg)).png().toFile(outputPath)
      console.log(`Generated ${outputPath} from SVG`)
    }
  }
}

generateIcons().catch(console.error)
