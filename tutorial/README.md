# Badminton Party — คู่มือการใช้งาน (Tutorial)

## ไฟล์ในโฟลเดอร์

| ไฟล์ | คำอธิบาย |
|------|----------|
| `tutorial.html` | คู่มือฉบับเต็ม (HTML) — เปิดในเบราว์เซอร์ได้เลย |
| `capture-screenshots.js` | Playwright script จับภาพหน้าจอทุกหน้า |
| `annotate-screenshots.js` | Script วาดกรอบ/ลูกศร/ข้อความบน screenshot |
| `generate-pdf.js` | แปลง HTML → PDF ด้วย Playwright |
| `screenshots/` | โฟลเดอร์เก็บ screenshot ดิบ |
| `screenshots/annotated/` | โฟลเดอร์เก็บ screenshot ที่ annotate แล้ว |

## วิธีใช้

### ขั้นตอนที่ 1: ติดตั้ง dependencies

```bash
npm install playwright sharp
npx playwright install chromium
```

### ขั้นตอนที่ 2: จับภาพหน้าจอ

```bash
# ต้องรัน Laravel dev server ก่อน
php artisan serve

# จับภาพทุกหน้า
TUTORIAL_EMAIL=your@email.com TUTORIAL_PASSWORD=yourpass \
  node tutorial/capture-screenshots.js --base-url=http://localhost:8000

# จับเฉพาะบาง section
node tutorial/capture-screenshots.js --section=login
node tutorial/capture-screenshots.js --section=party-lists
node tutorial/capture-screenshots.js --section=profile

# เปิด browser ให้เห็น (headed mode)
node tutorial/capture-screenshots.js --headed
```

**Sections ที่เลือกได้:**
`auth`, `home`, `party-lists`, `party-detail`, `game`, `invite`, `tv`, `profile`, `skill`, `chat`, `friends`, `notifications`, `feedback`, `nav`

### ขั้นตอนที่ 3: วาด annotations

```bash
node tutorial/annotate-screenshots.js
```

> ⚠️ หลังจับภาพจริง ควรปรับพิกัด annotations ใน `annotate-screenshots.js` ให้ตรงกับ screenshot จริง

### ขั้นตอนที่ 4: สร้าง PDF

```bash
node tutorial/generate-pdf.js
# Output: tutorial/Badminton-Party-คู่มือการใช้งาน.pdf
```

## รายชื่อ Screenshots

| ไฟล์ | หน้าจอ |
|------|--------|
| `01-login-page.png` | หน้า Login — ปุ่ม LINE + อีเมล |
| `01b-login-email-form.png` | Login — ฟอร์มอีเมล (เปิดแล้ว) |
| `01c-login-filled.png` | Login — กรอกข้อมูลแล้ว |
| `02-register-page.png` | หน้าสมัครสมาชิก |
| `03-home-page.png` | หน้าหลัก Home |
| `03b-home-carousel.png` | Home — แบนเนอร์ carousel (crop) |
| `03c-home-quick-actions.png` | Home — เมนูลัด (crop) |
| `04-party-lists.png` | รายการปาร์ตี้ |
| `04b-party-lists-header.png` | Party Lists — header (crop) |
| `05-create-party-dialog.png` | Dialog สร้างปาร์ตี้ |
| `06-my-parties.png` | ปาร์ตี้ของฉัน |
| `07-party-tab-game.png` | ปาร์ตี้ — แท็บเกม |
| `07b-party-tabs.png` | ปาร์ตี้ — แถบแท็บ (crop) |
| `08-party-tab-info.png` | ปาร์ตี้ — แท็บข้อมูล |
| `09-party-tab-player.png` | ปาร์ตี้ — แท็บผู้เล่น |
| `10-party-tab-statistic.png` | ปาร์ตี้ — แท็บสถิติ |
| `11-create-game.png` | สร้างเกม + จัดทีม |
| `12-game-detail.png` | รายละเอียดเกม |
| `13-share-invite.png` | แชร์ลิงก์เชิญ |
| `14-tv-dashboard.png` | โหมดทีวี (1920x1080) |
| `15-profile.png` | โปรไฟล์ (full) |
| `15b-profile-header.png` | โปรไฟล์ — header (crop) |
| `16-profile-edit.png` | แก้ไขโปรไฟล์ |
| `17-skill-assessment.png` | ประเมินทักษะ |
| `18-chat.png` | แชท |
| `19-friends.png` | เพื่อน — แท็บเพื่อนของฉัน |
| `19b-friends-received.png` | เพื่อน — คำขอที่ได้รับ |
| `20-notification-settings.png` | ตั้งค่าแจ้งเตือน |
| `21-feedback.png` | แจ้งปัญหา/ข้อเสนอแนะ |
| `22-bottom-nav.png` | แถบเมนูด้านล่าง (crop) |
| `22b-topbar.png` | แถบเมนูด้านบน (crop) |

## ปรับแต่ง Annotations

เปิดไฟล์ `annotate-screenshots.js` แก้ไข object `annotations` — แต่ละ key คือชื่อ screenshot:

```js
'01-login-page': [
  { type: 'rect', x: 30, y: 280, w: 330, h: 56, color: '#22c55e' },
  { type: 'arrow', x1: 310, y1: 30, x2: 330, y2: 40, color: '#ef4444' },
  { type: 'label', x: 50, y: 270, text: 'กดตรงนี้', color: '#22c55e' },
  { type: 'number', x: 20, y: 308, num: 1, color: '#22c55e' },
  { type: 'circle', x: 350, y: 50, r: 24, color: '#ef4444' },
]
```

**Annotation types:**
- `rect` — กรอบสี่เหลี่ยม (x, y, w, h, color, dashed)
- `arrow` — ลูกศร (x1, y1, x2, y2, color)
- `label` — ข้อความ + พื้นหลัง (x, y, text, color, fontSize)
- `number` — วงกลมมีตัวเลข (x, y, num, color, size)
- `circle` — วงกลมเปล่า (x, y, r, color)

**สี:** `#ef4444` (แดง), `#3b82f6` (น้ำเงิน), `#22c55e` (เขียว), `#f97316` (ส้ม)
