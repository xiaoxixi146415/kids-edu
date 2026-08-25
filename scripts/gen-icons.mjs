/**
 * 生成 PWA 图标：把 public/favicon.svg（笑脸圆球）栅格化为 PNG。
 * - 常规图标：笑脸铺满 + 品牌天空蓝背景
 * - maskable 图标：笑脸缩至安全区（≤80%）+ 纯色背景，适配圆形裁切
 * 用法：npm run gen-icons（可重复运行，产物在 public/icons/）
 */
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const SRC = 'public/favicon.svg'
const OUT_DIR = 'public/icons'
const BG = '#bde4ff' // 与 theme-color / top-bar 一致的品牌天空蓝

mkdirSync(OUT_DIR, { recursive: true })

/** 以 scale（占图标边长比例）把笑脸居中合成到纯色背景上 */
async function gen(size, file, scale) {
  const sw = Math.round(size * scale)
  const offset = Math.round((size - sw) / 2)
  const smiley = await sharp(SRC).resize(sw, sw).png().toBuffer()
  await sharp({
    create: { width: size, height: size, channels: 3, background: BG },
  })
    .composite([{ input: smiley, left: offset, top: offset }])
    .png()
    .toFile(`${OUT_DIR}/${file}`)
  console.log(`✓ ${OUT_DIR}/${file} (${size}px, scale ${scale})`)
}

// 常规图标：笑脸占 92%（铺满）
await gen(192, 'icon-192.png', 0.92)
await gen(512, 'icon-512.png', 0.92)
await gen(180, 'apple-touch-icon.png', 0.92)
// maskable：笑脸占 70%（安全区内）
await gen(192, 'icon-maskable-192.png', 0.7)
await gen(512, 'icon-maskable-512.png', 0.7)

console.log('done.')
