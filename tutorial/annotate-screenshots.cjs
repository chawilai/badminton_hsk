/**
 * Badminton Party — Screenshot Annotator
 * ========================================
 * วาดกรอบ ลูกศร ข้อความ บน screenshot
 *
 * Usage:  node tutorial/annotate-screenshots.cjs
 * Prerequisites: npm install sharp
 *
 * พิกัดทั้งหมดวัดจาก Playwright boundingBox() จริง (viewport 390x844)
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const ANNOTATED_DIR = path.join(SCREENSHOT_DIR, 'annotated');

// ────────────────── SVG Drawing Helpers ──────────────────

function createSvgOverlay(width, height, elements) {
  const svgParts = elements.map(el => {
    switch (el.type) {
      case 'rect': return drawRect(el);
      case 'arrow': return drawArrow(el);
      case 'label': return drawLabel(el);
      case 'circle': return drawCircle(el);
      case 'number': return drawNumber(el);
      default: return '';
    }
  });

  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="2" flood-color="rgba(0,0,0,0.5)"/>
        </filter>
        <marker id="ah-red" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444"/>
        </marker>
        <marker id="ah-blue" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6"/>
        </marker>
        <marker id="ah-green" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e"/>
        </marker>
        <marker id="ah-orange" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#f97316"/>
        </marker>
      </defs>
      ${svgParts.join('\n')}
    </svg>
  `);
}

function drawRect({ x, y, w, h, color = '#ef4444', strokeWidth = 3, radius = 8, dashed = false }) {
  const da = dashed ? `stroke-dasharray="8 4"` : '';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" rx="${radius}" ${da} filter="url(#shadow)"/>`;
}

function drawArrow({ x1, y1, x2, y2, color = '#ef4444', strokeWidth = 3 }) {
  const c = color === '#3b82f6' ? 'blue' : color === '#22c55e' ? 'green' : color === '#f97316' ? 'orange' : 'red';
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${strokeWidth}" marker-end="url(#ah-${c})" filter="url(#shadow)"/>`;
}

function drawLabel({ x, y, text, color = '#ef4444', bg = 'white', fontSize = 14 }) {
  const pad = 5;
  const tw = text.length * fontSize * 0.52;
  return `
    <rect x="${x - pad}" y="${y - fontSize - pad}" width="${tw + pad * 2}" height="${fontSize + pad * 2}" fill="${bg}" stroke="${color}" stroke-width="2" rx="5" filter="url(#shadow)"/>
    <text x="${x + 2}" y="${y - 2}" font-family="sans-serif" font-size="${fontSize}" font-weight="bold" fill="${color}">${text}</text>`;
}

function drawCircle({ x, y, r = 20, color = '#ef4444', strokeWidth = 3 }) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" filter="url(#shadow)"/>`;
}

function drawNumber({ x, y, num, color = '#ef4444', size = 28 }) {
  const r = size / 2;
  return `
    <circle cx="${x}" cy="${y}" r="${r}" fill="${color}" filter="url(#shadow)"/>
    <text x="${x}" y="${y + 5}" font-family="sans-serif" font-size="${size * 0.6}" font-weight="bold" fill="white" text-anchor="middle">${num}</text>`;
}

// ────────────────── Blur Helper ──────────────────

async function applyBlurs(image, blurs) {
  let buffer = await image.toBuffer();
  for (const { x, y, w, h, sigma } of blurs) {
    const blurred = await sharp(buffer)
      .extract({ left: Math.round(x), top: Math.round(y), width: Math.round(w), height: Math.round(h) })
      .blur(sigma || 15)
      .toBuffer();
    buffer = await sharp(buffer)
      .composite([{ input: blurred, top: Math.round(y), left: Math.round(x) }])
      .toBuffer();
  }
  return sharp(buffer);
}

// ════════════════════════════════════════════════════════════
// ANNOTATION DEFINITIONS — ค่าทั้งหมดวัดจาก Playwright จริง
// ════════════════════════════════════════════════════════════

const annotations = {

  // ━━━ 01-LOGIN (390x844) ━━━
  // LINE: x=43 y=525 w=304 h=42
  // Email: x=43 y=616 w=304 h=41
  '01-login-page': [
    { type: 'rect', x: 38, y: 520, w: 314, h: 52, color: '#22c55e', strokeWidth: 3 },
    { type: 'number', x: 18, y: 546, num: 1, color: '#22c55e', size: 28 },
    { type: 'label', x: 80, y: 512, text: 'กดเข้าสู่ระบบผ่าน LINE', color: '#22c55e', fontSize: 13 },

    { type: 'rect', x: 38, y: 611, w: 314, h: 50, color: '#3b82f6', strokeWidth: 3, dashed: true },
    { type: 'number', x: 18, y: 636, num: 2, color: '#3b82f6', size: 28 },
    { type: 'label', x: 80, y: 603, text: 'หรือ เข้าด้วยอีเมล', color: '#3b82f6', fontSize: 13 },
  ],

  // ━━━ 02-REGISTER (fullPage) ━━━
  // LINE: x=43 y=394 w=304 h=42
  // FirstInput: x=43 y=478 w=304 h=37
  // LastInput: x=43 y=694 w=304 h=37
  // Submit: x=43 y=745 w=304 h=35
  '02-register-page': [
    { type: 'rect', x: 38, y: 389, w: 314, h: 52, color: '#22c55e', strokeWidth: 3 },
    { type: 'number', x: 18, y: 415, num: 1, color: '#22c55e', size: 26 },
    { type: 'label', x: 80, y: 381, text: 'สมัครผ่าน LINE (แนะนำ)', color: '#22c55e', fontSize: 12 },

    { type: 'rect', x: 30, y: 453, w: 335, h: 340, color: '#3b82f6', strokeWidth: 2, dashed: true },
    { type: 'number', x: 14, y: 620, num: 2, color: '#3b82f6', size: 26 },
    { type: 'label', x: 55, y: 446, text: 'หรือสมัครด้วยอีเมล', color: '#3b82f6', fontSize: 12 },
  ],

  // ━━━ 03-HOME (fullPage ~920) ━━━
  // quickBtns (หาปาร์ตี้): y=214
  // features (จัดเกมอัตโนมัติ): y=486
  // CTA (พร้อมตีแบด): y=752
  // Banner ช่วงบน: ~y=48-180 (จากตำแหน่ง UI)
  '03-home-page': [
    { type: 'blur', x: 340, y: 3, w: 38, h: 38, sigma: 15 },
    { type: 'rect', x: 16, y: 48, w: 358, h: 132, color: '#22c55e', strokeWidth: 3 },
    { type: 'label', x: 26, y: 40, text: 'แบนเนอร์หลัก', color: '#22c55e', fontSize: 12 },

    { type: 'rect', x: 16, y: 195, w: 358, h: 145, color: '#3b82f6', strokeWidth: 3 },
    { type: 'label', x: 26, y: 187, text: 'เมนูลัด', color: '#3b82f6', fontSize: 12 },

    { type: 'rect', x: 16, y: 370, w: 358, h: 260, color: '#f97316', strokeWidth: 2, dashed: true },
    { type: 'label', x: 26, y: 362, text: 'คุณสมบัติเด่น', color: '#f97316', fontSize: 12 },
  ],

  // ━━━ 04-PARTY-LISTS ━━━
  // CreateParty: x=276 y=84 w=100 h=32
  '04-party-lists': [
    { type: 'blur', x: 340, y: 3, w: 38, h: 38, sigma: 15 },
    { type: 'rect', x: 271, y: 79, w: 110, h: 42, color: '#ef4444', strokeWidth: 3 },
    { type: 'arrow', x1: 215, y1: 80, x2: 267, y2: 95, color: '#ef4444' },
    { type: 'label', x: 95, y: 74, text: 'กดสร้างปาร์ตี้', color: '#ef4444', fontSize: 13 },

    { type: 'rect', x: 20, y: 142, w: 358, h: 148, color: '#22c55e', strokeWidth: 2 },
    { type: 'label', x: 30, y: 295, text: 'การ์ดปาร์ตี้: ชื่อ, สนาม, เวลา, สมาชิก', color: '#22c55e', fontSize: 11 },
  ],

  // ━━━ 05-CREATE-PARTY (fullPage) ━━━
  // NameInput: x=18 y=224 w=233 h=28
  // DateInput: x=18 y=280 w=355 h=28
  // MaxPlayers: x=18 y=319 / CourtSelect: x=200 y=319
  // CostTabs: x=18 y=435 w=115 h=25
  // NoteLabel: x=18 y=546
  '05-create-party-dialog': [
    { type: 'number', x: 12, y: 236, num: 1, color: '#ef4444', size: 22 },
    { type: 'rect', x: 14, y: 190, w: 365, h: 68, color: '#ef4444', strokeWidth: 2 },

    { type: 'number', x: 12, y: 292, num: 2, color: '#3b82f6', size: 22 },
    { type: 'rect', x: 14, y: 270, w: 365, h: 42, color: '#3b82f6', strokeWidth: 2 },

    { type: 'number', x: 12, y: 345, num: 3, color: '#f97316', size: 22 },
    { type: 'rect', x: 14, y: 314, w: 365, h: 55, color: '#f97316', strokeWidth: 2 },

    { type: 'number', x: 12, y: 450, num: 4, color: '#22c55e', size: 22 },
    { type: 'rect', x: 14, y: 422, w: 365, h: 100, color: '#22c55e', strokeWidth: 2 },

    { type: 'number', x: 12, y: 570, num: 5, color: '#8b5cf6', size: 22 },
    { type: 'rect', x: 14, y: 536, w: 365, h: 135, color: '#8b5cf6', strokeWidth: 2 },
  ],

  // ━━━ 07-PARTY-TAB-GAME ━━━
  // Tab ข้อมูล: y=131, ผู้เล่น: y=123, สถิติ: y=131 → tab row y=118-155
  // CreateGame: x=307 y=66 w=69 h=28
  '07-party-tab-game': [
    { type: 'blur', x: 340, y: 3, w: 38, h: 38, sigma: 15 },
    { type: 'rect', x: 18, y: 118, w: 355, h: 40, color: '#3b82f6', strokeWidth: 3 },
    { type: 'label', x: 28, y: 110, text: 'แถบแท็บ: เกม / ข้อมูล / ผู้เล่น / สถิติ', color: '#3b82f6', fontSize: 11 },

    { type: 'rect', x: 302, y: 61, w: 78, h: 34, color: '#22c55e', strokeWidth: 2 },
    { type: 'label', x: 192, y: 55, text: 'สร้างเกม', color: '#22c55e', fontSize: 11 },
  ],

  // ━━━ 08-PARTY-TAB-INFO ━━━
  '08-party-tab-info': [
    { type: 'blur', x: 340, y: 3, w: 38, h: 38, sigma: 15 },
    { type: 'rect', x: 18, y: 118, w: 355, h: 40, color: '#3b82f6', strokeWidth: 3 },
    { type: 'label', x: 28, y: 110, text: 'แท็บข้อมูล (กำลังดูอยู่)', color: '#3b82f6', fontSize: 11 },
  ],

  // ━━━ 09-PARTY-TAB-PLAYER ━━━
  '09-party-tab-player': [
    { type: 'blur', x: 340, y: 3, w: 38, h: 38, sigma: 15 },
    { type: 'rect', x: 18, y: 118, w: 355, h: 40, color: '#3b82f6', strokeWidth: 3 },
    { type: 'label', x: 28, y: 110, text: 'แท็บผู้เล่น (กำลังดูอยู่)', color: '#3b82f6', fontSize: 11 },

    // ชื่อเรียก (display name)
    { type: 'rect', x: 68, y: 240, w: 120, h: 25, color: '#22c55e', strokeWidth: 2 },
    { type: 'arrow', x1: 192, y1: 252, x2: 190, y2: 252, color: '#22c55e' },
    { type: 'label', x: 200, y: 238, text: 'ชื่อเรียก (กดแก้ไขได้)', color: '#22c55e', fontSize: 10 },

    // สถานะ toggle (พร้อม/พัก) — วงกลมเขียวขวาสุด
    { type: 'circle', x: 363, y: 252, r: 14, color: '#f97316', strokeWidth: 3 },
    { type: 'label', x: 240, y: 278, text: 'สถานะ: พร้อม/พัก', color: '#f97316', fontSize: 10 },

    // ลำดับ + avatar
    { type: 'rect', x: 22, y: 240, w: 40, h: 25, color: '#8b5cf6', strokeWidth: 2 },
    { type: 'label', x: 22, y: 228, text: 'ลำดับ', color: '#8b5cf6', fontSize: 10 },
  ],

  // ━━━ 09b-PLAYER-SCROLL (scrolled view) ━━━
  '09b-party-tab-player-scroll': [
    { type: 'rect', x: 68, y: 125, w: 120, h: 25, color: '#22c55e', strokeWidth: 2 },
    { type: 'label', x: 200, y: 123, text: 'ชื่อเรียก', color: '#22c55e', fontSize: 10 },

    { type: 'circle', x: 363, y: 137, r: 14, color: '#f97316', strokeWidth: 3 },
    { type: 'label', x: 240, y: 163, text: 'สถานะ', color: '#f97316', fontSize: 10 },
  ],

  // ━━━ 15-PROFILE (viewport 390x844) ━━━
  // Main avatar: x=160 y=81 w=70 h=70. Topbar: x=343 y=6 w=32 h=32. Friend: x=26 y=726 w=35 h=35
  '15-profile': [
    { type: 'blur', x: 155, y: 76, w: 80, h: 80, sigma: 20 },
    { type: 'blur', x: 340, y: 3, w: 38, h: 38, sigma: 15 },
    { type: 'blur', x: 22, y: 722, w: 42, h: 42, sigma: 15 },

    { type: 'rect', x: 16, y: 55, w: 358, h: 340, color: '#22c55e', strokeWidth: 2 },
    { type: 'label', x: 26, y: 47, text: 'โปรไฟล์ + เลเวล MMR', color: '#22c55e', fontSize: 12 },

    { type: 'rect', x: 16, y: 412, w: 358, h: 140, color: '#3b82f6', strokeWidth: 2 },
    { type: 'label', x: 26, y: 404, text: 'สถิติการเล่น', color: '#3b82f6', fontSize: 12 },
  ],

  // ━━━ 18-CHAT ━━━
  // Chat avatars: Jk x=26 y=145 w=32 h=32. Topbar: x=343 y=6 w=32 h=32
  '18-chat': [
    { type: 'blur', x: 340, y: 3, w: 38, h: 38, sigma: 15 },
    { type: 'blur', x: 22, y: 141, w: 40, h: 40, sigma: 15 },

    { type: 'circle', x: 350, y: 98, r: 18, color: '#22c55e', strokeWidth: 3 },
    { type: 'arrow', x1: 280, y1: 85, x2: 328, y2: 94, color: '#22c55e' },
    { type: 'label', x: 150, y: 78, text: 'สร้างแชทใหม่', color: '#22c55e', fontSize: 13 },

    { type: 'rect', x: 20, y: 132, w: 355, h: 145, color: '#3b82f6', strokeWidth: 2, dashed: true },
    { type: 'label', x: 30, y: 282, text: 'รายการแชท', color: '#3b82f6', fontSize: 12 },
  ],

  // ━━━ 19-FRIENDS ━━━
  // Friend avatar: x=26 y=218 w=32 h=32. Topbar: x=343 y=6 w=32 h=32
  '19-friends': [
    { type: 'blur', x: 340, y: 3, w: 38, h: 38, sigma: 15 },
    { type: 'blur', x: 22, y: 214, w: 40, h: 40, sigma: 15 },
    { type: 'rect', x: 18, y: 130, w: 358, h: 60, color: '#3b82f6', strokeWidth: 3 },
    { type: 'label', x: 28, y: 122, text: 'แท็บ: เพื่อน / คำขอรับ / คำขอส่ง', color: '#3b82f6', fontSize: 11 },

    { type: 'rect', x: 18, y: 204, w: 358, h: 50, color: '#22c55e', strokeWidth: 2 },
    { type: 'label', x: 28, y: 259, text: 'ปุ่มแชท + เลิกเป็นเพื่อน', color: '#22c55e', fontSize: 11 },
  ],

  // ━━━ 20-NOTIFICATIONS ━━━
  // LineStatus: y=129, MasterToggle: y=198, TypeHeader: y=270
  // FirstType(ถูกเชิญ): y=304, LastType(สมาชิกใหม่): y=559
  // TestBtn: y=613 w=362 h=35
  '20-notification-settings': [
    { type: 'blur', x: 340, y: 3, w: 38, h: 38, sigma: 15 },
    { type: 'rect', x: 18, y: 108, w: 358, h: 68, color: '#22c55e', strokeWidth: 2 },
    { type: 'label', x: 28, y: 100, text: 'สถานะเชื่อมต่อ LINE', color: '#22c55e', fontSize: 11 },

    { type: 'rect', x: 18, y: 186, w: 358, h: 48, color: '#f97316', strokeWidth: 2 },
    { type: 'label', x: 28, y: 178, text: 'เปิด/ปิดทั้งหมด', color: '#f97316', fontSize: 11 },

    { type: 'rect', x: 18, y: 262, w: 358, h: 325, color: '#3b82f6', strokeWidth: 2, dashed: true },
    { type: 'label', x: 28, y: 254, text: 'แจ้งเตือนแต่ละประเภท (6 รายการ)', color: '#3b82f6', fontSize: 10 },
  ],

  // ━━━ 22-BOTTOM-NAV (390x80) ━━━
  '22-bottom-nav': [
    { type: 'number', x: 48, y: 18, num: 1, color: '#ef4444', size: 20 },
    { type: 'number', x: 146, y: 18, num: 2, color: '#f97316', size: 20 },
    { type: 'number', x: 243, y: 18, num: 3, color: '#3b82f6', size: 20 },
    { type: 'number', x: 340, y: 18, num: 4, color: '#22c55e', size: 20 },
  ],
};

// ────────────────── Main Annotator ──────────────────

async function annotateImage(inputFile, outputFile, elements) {
  let image = sharp(inputFile);
  const { width, height } = await image.metadata();

  // Apply blurs first
  const blurs = elements.filter(e => e.type === 'blur');
  if (blurs.length > 0) {
    image = await applyBlurs(image, blurs);
  }

  // Apply SVG overlay
  const svgElements = elements.filter(e => e.type !== 'blur');
  if (svgElements.length > 0) {
    const svgOverlay = createSvgOverlay(width, height, svgElements);
    image = image.composite([{ input: svgOverlay, top: 0, left: 0 }]);
  }

  await image.png().toFile(outputFile);
}

async function main() {
  if (!fs.existsSync(ANNOTATED_DIR)) fs.mkdirSync(ANNOTATED_DIR, { recursive: true });

  console.log('🎨 Badminton Party — Screenshot Annotator');
  console.log(`   Input:  ${SCREENSHOT_DIR}`);
  console.log(`   Output: ${ANNOTATED_DIR}\n`);

  let annotated = 0, skipped = 0;
  for (const [name, elements] of Object.entries(annotations)) {
    const src = path.join(SCREENSHOT_DIR, `${name}.png`);
    const dst = path.join(ANNOTATED_DIR, `${name}.png`);
    if (!fs.existsSync(src)) { console.log(`  ⏭️  ${name}.png — not found`); skipped++; continue; }
    try {
      await annotateImage(src, dst, elements);
      console.log(`  ✅ ${name}.png`);
      annotated++;
    } catch (err) { console.error(`  ❌ ${name}.png — ${err.message}`); }
  }

  // Copy non-annotated
  for (const file of fs.readdirSync(SCREENSHOT_DIR).filter(f => f.endsWith('.png'))) {
    const name = file.replace('.png', '');
    if (!annotations[name]) {
      const src = path.join(SCREENSHOT_DIR, file);
      const dst = path.join(ANNOTATED_DIR, file);
      if (!fs.existsSync(dst) || fs.statSync(src).mtimeMs > fs.statSync(dst).mtimeMs) {
        fs.copyFileSync(src, dst);
        console.log(`  📋 ${file}`);
      }
    }
  }

  console.log(`\n🎉 Done! ${annotated} annotated, ${skipped} skipped`);
}

main().catch(console.error);
