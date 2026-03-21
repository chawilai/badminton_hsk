/**
 * Badminton Party — Quick Guide Screenshot Capture
 * ==================================================
 * จับภาพหน้าจอเฉพาะจุดสำคัญ สำหรับคู่มือ A4 1 หน้า
 *
 * Usage:
 *   node tutorial/capture-quickguide.cjs
 *   node tutorial/capture-quickguide.cjs --base-url=http://localhost:8000
 *   node tutorial/capture-quickguide.cjs --headed
 */

const { chromium } = require('playwright');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const getArg = (name) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : null;
};

const BASE_URL = getArg('base-url') || 'http://localhost:8000';
const HEADED = args.includes('--headed');
const OUT_DIR = path.join(__dirname, 'quickguide-screenshots');
const VIEWPORT = { width: 390, height: 844 };

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ── Auth via tutorial-login ──
function getAuthCookies() {
  try {
    const cookieFile = '/tmp/bp_quickguide_cookies.txt';
    execSync(`curl -s -c "${cookieFile}" -o /dev/null "${BASE_URL}/tutorial-login?user_id=1"`, { timeout: 10000 });
    const content = fs.readFileSync(cookieFile, 'utf-8');
    const cookies = [];
    for (let line of content.split('\n')) {
      if (!line.trim()) continue;
      let httpOnly = false;
      if (line.startsWith('#HttpOnly_')) {
        httpOnly = true;
        line = line.substring('#HttpOnly_'.length);
      } else if (line.startsWith('#')) continue;
      const parts = line.split('\t');
      if (parts.length >= 7) {
        cookies.push({
          name: parts[5], value: parts[6],
          domain: new URL(BASE_URL).hostname,
          path: parts[2], expires: parseInt(parts[4]) || -1,
          httpOnly, secure: false, sameSite: 'Lax',
        });
      }
    }
    return cookies;
  } catch (err) {
    console.error('❌ Auth failed:', err.message);
    return [];
  }
}

async function safeGoto(page, url) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(800);
    return true;
  } catch (err) {
    console.log(`  ⚠️ Failed: ${url}`);
    return false;
  }
}

async function clipScreenshot(page, name, clip) {
  const filePath = path.join(OUT_DIR, `${name}.png`);
  await page.waitForTimeout(300);
  await page.screenshot({ path: filePath, clip });
  console.log(`  ✅ ${name}.png`);
}

async function elementScreenshot(page, name, selector) {
  const filePath = path.join(OUT_DIR, `${name}.png`);
  await page.waitForTimeout(300);
  try {
    const el = page.locator(selector).first();
    if (await el.isVisible({ timeout: 3000 })) {
      await el.screenshot({ path: filePath });
      console.log(`  ✅ ${name}.png`);
      return true;
    }
  } catch {}
  // fallback: viewport screenshot
  await page.screenshot({ path: filePath });
  console.log(`  ✅ ${name}.png (viewport fallback)`);
  return false;
}

async function viewportScreenshot(page, name) {
  const filePath = path.join(OUT_DIR, `${name}.png`);
  await page.waitForTimeout(300);
  await page.screenshot({ path: filePath });
  console.log(`  ✅ ${name}.png`);
}

// ── Find a party with games ──
async function findPartyId(page) {
  for (const url of [`${BASE_URL}/my-parties`, `${BASE_URL}/party-lists`]) {
    if (await safeGoto(page, url)) {
      const links = await page.locator('a[href*="/party/"]').all();
      for (const link of links) {
        const href = await link.getAttribute('href').catch(() => null);
        const m = href && href.match(/\/party\/(\d+)/);
        if (m) return m[1];
      }
    }
  }
  return '1';
}

// ── Main ──
async function main() {
  ensureDir(OUT_DIR);
  console.log('🏸 Quick Guide Screenshot Capture');
  console.log(`   Base URL: ${BASE_URL}`);
  console.log(`   Output:   ${OUT_DIR}\n`);

  const browser = await chromium.launch({ headless: !HEADED });

  // Get auth
  console.log('🔑 Getting auth cookies...');
  const cookies = getAuthCookies();
  if (!cookies.length) { console.log('❌ No cookies'); return; }
  console.log(`  ✅ Got ${cookies.length} cookies\n`);

  const ctx = await browser.newContext({
    viewport: VIEWPORT, locale: 'th-TH', timezoneId: 'Asia/Bangkok',
  });
  await ctx.addCookies(cookies);
  const page = await ctx.newPage();

  // Verify auth
  if (await safeGoto(page, `${BASE_URL}/party-lists`)) {
    if (page.url().includes('login')) {
      console.log('❌ Not authenticated'); return;
    }
  }

  // ═══ 1. Party Lists — รายการปาร์ตี้ ═══
  console.log('📸 1. Party Lists');
  if (await safeGoto(page, `${BASE_URL}/party-lists`)) {
    // Crop top portion showing party cards
    await clipScreenshot(page, '01-party-lists', { x: 0, y: 60, width: 390, height: 340 });
  }

  // ═══ 2. Party Detail — ภายในปาร์ตี้ ═══
  const partyId = await findPartyId(page);
  console.log(`\n📸 2. Party Detail (ID: ${partyId})`);
  if (await safeGoto(page, `${BASE_URL}/party/${partyId}`)) {
    // Tab Game view — playing/listing zone
    await viewportScreenshot(page, '02-party-game-tab');

    // Tab Info
    const infoClicked = await page.locator('button, [role="tab"], div, span')
      .filter({ hasText: /ข้อมูล|Info/i }).first()
      .click().then(() => true).catch(() => false);
    if (infoClicked) {
      await page.waitForTimeout(500);
      await clipScreenshot(page, '02b-party-info', { x: 0, y: 80, width: 390, height: 400 });
    }

    // Back to game tab
    await page.locator('button, [role="tab"], div, span')
      .filter({ hasText: /เกม|Game/i }).first()
      .click().catch(() => {});
    await page.waitForTimeout(500);
  }

  // ═══ 3. Create Game — สร้างเกม ═══
  console.log('\n📸 3. Create Game');
  if (await safeGoto(page, `${BASE_URL}/party/${partyId}`)) {
    // Click create game button
    const createBtn = page.locator('button').filter({ hasText: /สร้างเกม|สร้าง เกม/i }).first();
    if (await createBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createBtn.click();
      await page.waitForTimeout(800);
      await viewportScreenshot(page, '03-create-game');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    } else {
      // Fallback — just screenshot the game tab
      await viewportScreenshot(page, '03-create-game');
    }
  }

  // ═══ 4. Game List — รายการเกม + สถานะ ═══
  console.log('\n📸 4. Game List & Status');
  if (await safeGoto(page, `${BASE_URL}/party/${partyId}`)) {
    // Scroll down to see game cards
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(500);
    await clipScreenshot(page, '04-game-list', { x: 0, y: 0, width: 390, height: 500 });
  }

  // ═══ 5. Score / Finish Game — ลงผล (เปิด dialog + ใส่คะแนน) ═══
  console.log('\n📸 5. Score / Finish');
  if (await safeGoto(page, `${BASE_URL}/party/${partyId}`)) {
    await page.waitForTimeout(1000);
    let found = false;

    // Scroll down gradually to find and click btn-success
    for (let i = 0; i < 15; i++) {
      const btnPos = await page.evaluate(() => {
        const btns = document.querySelectorAll('button.btn-success');
        for (const btn of btns) {
          const rect = btn.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0 && rect.y >= 0 && rect.y < window.innerHeight) {
            return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
          }
        }
        return null;
      });

      if (btnPos) {
        console.log('  📍 Score button at:', JSON.stringify(btnPos));
        await page.mouse.click(btnPos.x, btnPos.y);
        await page.waitForTimeout(1500);

        // Scroll to top so modal overlay is fully visible
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);

        // Check modal opened
        const modalOpen = await page.locator('dialog.modal-open').count();
        if (modalOpen > 0) {
          console.log('  ✅ Score modal opened!');

          // Click "21 แต้ม" for team1
          const btn21 = page.locator('dialog.modal-open button').filter({ hasText: /21 แต้ม/ }).first();
          if (await btn21.isVisible({ timeout: 1000 }).catch(() => false)) {
            await btn21.click();
            await page.waitForTimeout(300);
          }

          // Set team2 score to 15 via range slider
          await page.evaluate(() => {
            const modal = document.querySelector('dialog.modal-open .modal-box');
            if (modal) {
              const ranges = modal.querySelectorAll('input[type="range"]');
              if (ranges[1]) {
                const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                nativeSetter.call(ranges[1], 15);
                ranges[1].dispatchEvent(new Event('input', { bubbles: true }));
              }
            }
          });
          await page.waitForTimeout(500);

          await viewportScreenshot(page, '05-game-score');
          found = true;
        }
        break;
      }

      await page.evaluate(() => window.scrollBy(0, 150));
      await page.waitForTimeout(300);
    }

    if (!found) {
      console.log('  ⚠️ No score dialog found — using fallback');
      await viewportScreenshot(page, '05-game-score');
    }
  }

  // ═══ 6. Party Statistics — สถิติปาร์ตี้ ═══
  console.log('\n📸 6. Party Statistics');
  if (await safeGoto(page, `${BASE_URL}/party/${partyId}`)) {
    // Click tab สถิติ
    await page.waitForTimeout(500);

    // Find and click the สถิติ tab
    const tabs = page.locator('button, [role="tab"], div, span');
    const statTab = tabs.filter({ hasText: /^สถิติ$|Statistic/i }).first();

    if (await statTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await statTab.click();
      await page.waitForTimeout(1000);
      await viewportScreenshot(page, '06-party-stats');
    } else {
      // Fallback: try broader match
      const allTabs = await tabs.all();
      for (const tab of allTabs) {
        const text = await tab.textContent().catch(() => '');
        if (text.includes('สถิติ')) {
          await tab.click();
          await page.waitForTimeout(1000);
          break;
        }
      }
      await viewportScreenshot(page, '06-party-stats');
    }
  }

  await ctx.close();
  await browser.close();

  const files = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.png'));
  console.log(`\n🎉 Done! ${files.length} screenshots → ${OUT_DIR}`);
  console.log('\n📄 Next: node tutorial/generate-quickguide.cjs');
}

main().catch(console.error);
