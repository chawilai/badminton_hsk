/**
 * Badminton Party — Screenshot Capture Script
 * =============================================
 * Usage:
 *   node tutorial/capture-screenshots.cjs
 *   node tutorial/capture-screenshots.cjs --base-url=http://localhost:8000
 *   node tutorial/capture-screenshots.cjs --section=auth
 *   node tutorial/capture-screenshots.cjs --headed
 */

const { chromium } = require('playwright');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// ────────────────── Config ──────────────────
const args = process.argv.slice(2);
const getArg = (name) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : null;
};

const BASE_URL = getArg('base-url') || 'http://localhost:8000';
const SECTION = getArg('section') || 'all';
const HEADED = args.includes('--headed');
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const MOBILE_VIEWPORT = { width: 390, height: 844 };
// ngrok browser warning bypass header
const EXTRA_HEADERS = { 'ngrok-skip-browser-warning': 'true' };

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ────────────────── Cookie Login via curl ──────────────────
function getAuthCookies() {
  try {
    const cookieFile = '/tmp/bp_tutorial_cookies.txt';
    execSync(`curl -s -c "${cookieFile}" -o /dev/null -H "ngrok-skip-browser-warning: true" "${BASE_URL}/tutorial-login?user_id=1"`, { timeout: 10000 });
    const content = fs.readFileSync(cookieFile, 'utf-8');
    const cookies = [];
    for (let line of content.split('\n')) {
      if (!line.trim()) continue;
      // Handle #HttpOnly_ prefix — it's a valid cookie line
      let httpOnly = false;
      if (line.startsWith('#HttpOnly_')) {
        httpOnly = true;
        line = line.substring('#HttpOnly_'.length);
      } else if (line.startsWith('#')) {
        continue; // skip comments
      }
      const parts = line.split('\t');
      if (parts.length >= 7) {
        cookies.push({
          name: parts[5],
          value: parts[6],
          domain: new URL(BASE_URL).hostname,
          path: parts[2],
          expires: parseInt(parts[4]) || -1,
          httpOnly,
          secure: false,
          sameSite: 'Lax',
        });
      }
    }
    return cookies;
  } catch (err) {
    console.error('  ❌ Failed to get auth cookies:', err.message);
    return [];
  }
}

// ────────────────── Screenshot Helpers ──────────────────
async function screenshot(page, name, options = {}) {
  const filePath = path.join(SCREENSHOT_DIR, `${name}.png`);
  await page.waitForTimeout(400);
  try {
    if (options.clip) {
      await page.screenshot({ path: filePath, clip: options.clip });
    } else {
      await page.screenshot({ path: filePath, fullPage: options.fullPage || false });
    }
    console.log(`  ✅ ${name}.png`);
  } catch (err) {
    console.log(`  ⚠️  ${name}.png — ${err.message}`);
  }
}

async function waitAndScreenshot(page, name, options = {}) {
  try { await page.waitForLoadState('networkidle', { timeout: 5000 }); } catch { }
  return screenshot(page, name, options);
}

async function safeGoto(page, url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(300);
      return true;
    } catch (err) {
      if (i < retries - 1) {
        console.log(`  🔄 Retry ${i + 1}/${retries - 1} for ${url}...`);
        await page.waitForTimeout(1000);
      } else {
        console.log(`  ⚠️  Failed: ${url} — ${err.message.split('\n')[0]}`);
        return false;
      }
    }
  }
  return false;
}

async function safeClick(page, selector, text) {
  try {
    const el = page.locator(selector).filter({ hasText: new RegExp(text, 'i') }).first();
    if (await el.isVisible({ timeout: 2000 }).catch(() => false)) {
      await el.click();
      await page.waitForTimeout(500);
      return true;
    }
  } catch { }
  return false;
}

// ────────────────── Capture sections ──────────────────

async function captureAuth(browser) {
  console.log('📸 Section: Authentication (guest)');
  const ctx = await browser.newContext({ viewport: MOBILE_VIEWPORT, locale: 'th-TH', timezoneId: 'Asia/Bangkok', extraHTTPHeaders: EXTRA_HEADERS });
  const p = await ctx.newPage();

  if (await safeGoto(p, `${BASE_URL}/login`)) {
    await waitAndScreenshot(p, '01-login-page', { fullPage: true });
    if (await safeClick(p, 'button, a', 'email|อีเมล')) {
      await waitAndScreenshot(p, '01b-login-email-form', { fullPage: true });
    }
  }
  if (await safeGoto(p, `${BASE_URL}/register`)) {
    await waitAndScreenshot(p, '02-register-page', { fullPage: true });
  }
  await ctx.close();
}

async function captureHome(page) {
  console.log('\n📸 Section: Home');
  if (await safeGoto(page, `${BASE_URL}/home`)) {
    await waitAndScreenshot(page, '03-home-page', { fullPage: true });
    await screenshot(page, '03b-home-carousel', { clip: { x: 0, y: 0, width: 390, height: 300 } });
    await screenshot(page, '03c-home-quick-actions', { clip: { x: 0, y: 300, width: 390, height: 250 } });
  }
}

async function capturePartyLists(page) {
  console.log('\n📸 Section: Party Lists');
  if (await safeGoto(page, `${BASE_URL}/party-lists`)) {
    await waitAndScreenshot(page, '04-party-lists', { fullPage: true });
    await screenshot(page, '04b-party-lists-header', { clip: { x: 0, y: 0, width: 390, height: 120 } });
    if (await safeClick(page, 'button, a', 'สร้าง|create|เพิ่ม')) {
      await waitAndScreenshot(page, '05-create-party-dialog', { fullPage: true });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
  }
  if (await safeGoto(page, `${BASE_URL}/party-my-parties`)) {
    await waitAndScreenshot(page, '06-my-parties', { fullPage: true });
  }
}

async function findPartyId(page) {
  for (const url of [`${BASE_URL}/party-my-parties`, `${BASE_URL}/party-lists`]) {
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

async function capturePartyDetail(page, partyId) {
  console.log('\n📸 Section: Party Detail');
  if (!await safeGoto(page, `${BASE_URL}/party/${partyId}`)) return;

  // Tab Game — viewport only (no fullPage, it's too long)
  await waitAndScreenshot(page, '07-party-tab-game');
  await screenshot(page, '07b-party-tabs', { clip: { x: 0, y: 0, width: 390, height: 100 } });

  const tabs = [
    ['ข้อมูล|Info', '08-party-tab-info'],
    ['ผู้เล่น|Player', '09-party-tab-player'],
    ['สถิติ|Stat', '10-party-tab-statistic'],
  ];
  for (const [text, file] of tabs) {
    if (await safeClick(page, 'button, [role="tab"], a, div, span', text)) {
      // Viewport only — no fullPage
      await waitAndScreenshot(page, file);
    }
  }

  // Back to game tab
  await safeClick(page, 'button, [role="tab"], a, div, span', 'เกม|Game');
  await page.waitForTimeout(400);

  // Create game
  if (await safeClick(page, 'button', 'สร้างเกม|สร้าง เกม')) {
    await waitAndScreenshot(page, '11-create-game');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // Share
  if (await safeClick(page, 'button, a', 'แชร์|share|เชิญ|invite')) {
    await waitAndScreenshot(page, '13-share-invite');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }
}

async function captureTV(browser, cookies, partyId) {
  console.log('\n📸 Section: TV Dashboard');
  const ctx = await browser.newContext({
    viewport: { width: 1920, height: 1080 }, locale: 'th-TH', timezoneId: 'Asia/Bangkok', extraHTTPHeaders: EXTRA_HEADERS,
  });
  await ctx.addCookies(cookies);
  const p = await ctx.newPage();
  if (await safeGoto(p, `${BASE_URL}/party/${partyId}/tv`)) {
    await p.waitForTimeout(2000);
    await p.screenshot({ path: path.join(SCREENSHOT_DIR, '14-tv-dashboard.png') });
    console.log('  ✅ 14-tv-dashboard.png');
  }
  await ctx.close();
}

async function captureProfile(page) {
  console.log('\n📸 Section: Profile');
  if (await safeGoto(page, `${BASE_URL}/profile`)) {
    // Viewport only — profile is very long
    await waitAndScreenshot(page, '15-profile');
    await screenshot(page, '15b-profile-header', { clip: { x: 0, y: 0, width: 390, height: 350 } });
    // Scroll down to show stats area
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(500);
    await waitAndScreenshot(page, '15c-profile-stats');
  }
  if (await safeGoto(page, `${BASE_URL}/profile/edit`)) {
    await waitAndScreenshot(page, '16-profile-edit');
  }
}

async function captureSkill(page) {
  console.log('\n📸 Section: Skill Assessment');
  if (await safeGoto(page, `${BASE_URL}/skill-assessment`)) {
    await waitAndScreenshot(page, '17-skill-assessment');
  }
}

async function captureChat(page) {
  console.log('\n📸 Section: Chat');
  if (await safeGoto(page, `${BASE_URL}/chat`)) {
    await waitAndScreenshot(page, '18-chat', { fullPage: true });
  }
}

async function captureFriends(page) {
  console.log('\n📸 Section: Friends');
  if (await safeGoto(page, `${BASE_URL}/friends`)) {
    await waitAndScreenshot(page, '19-friends', { fullPage: true });
    if (await safeClick(page, 'button, [role="tab"]', 'ได้รับ|received|คำขอ')) {
      await waitAndScreenshot(page, '19b-friends-received', { fullPage: true });
    }
  }
}

async function captureNotifications(page) {
  console.log('\n📸 Section: Notification Settings');
  if (await safeGoto(page, `${BASE_URL}/notifications/settings`)) {
    await waitAndScreenshot(page, '20-notification-settings', { fullPage: true });
  }
}

async function captureFeedback(page) {
  console.log('\n📸 Section: Feedback');
  if (await safeGoto(page, `${BASE_URL}/feedback`)) {
    await waitAndScreenshot(page, '21-feedback', { fullPage: true });
  }
}

async function captureNav(page) {
  console.log('\n📸 Section: Navigation');
  if (await safeGoto(page, `${BASE_URL}/party-lists`)) {
    const { width, height } = page.viewportSize();
    await screenshot(page, '22-bottom-nav', { clip: { x: 0, y: height - 80, width, height: 80 } });
    await screenshot(page, '22b-topbar', { clip: { x: 0, y: 0, width, height: 64 } });
  }
}

// ────────────────── Main ──────────────────
async function main() {
  ensureDir(SCREENSHOT_DIR);

  console.log('🏸 Badminton Party — Screenshot Capture');
  console.log(`   Base URL: ${BASE_URL}`);
  console.log(`   Section:  ${SECTION}`);
  console.log(`   Output:   ${SCREENSHOT_DIR}\n`);

  const browser = await chromium.launch({ headless: !HEADED });

  try {
    // ═══ Guest auth pages ═══
    if (SECTION === 'all' || SECTION === 'auth') {
      await captureAuth(browser);
    }

    // ═══ Get auth cookies ═══
    console.log('\n🔑 Getting auth cookies...');
    const cookies = getAuthCookies();
    if (cookies.length === 0) {
      console.log('❌ Failed to get cookies. Ensure tutorial-login route exists.');
      return;
    }
    console.log(`  ✅ Got ${cookies.length} cookies`);

    // ═══ Authenticated context ═══
    const ctx = await browser.newContext({
      viewport: MOBILE_VIEWPORT, locale: 'th-TH', timezoneId: 'Asia/Bangkok',
    });
    await ctx.addCookies(cookies);
    const page = await ctx.newPage();

    // Verify auth
    if (await safeGoto(page, `${BASE_URL}/party-lists`)) {
      if (page.url().includes('login')) {
        console.log('❌ Auth failed — redirected to login');
        return;
      }
      console.log('✅ Authenticated!\n');
    }

    // ═══ Sections ═══
    const runSection = (name) => SECTION === 'all' || SECTION === name;

    if (runSection('home')) await captureHome(page);
    if (runSection('party-lists')) await capturePartyLists(page);

    let partyId = null;
    if (runSection('party-detail') || runSection('tv')) {
      partyId = await findPartyId(page);
      console.log(`\n📍 Party ID: ${partyId}`);
    }

    if (runSection('party-detail') && partyId) await capturePartyDetail(page, partyId);
    if (runSection('tv') && partyId) {
      const allCookies = await ctx.cookies();
      await captureTV(browser, allCookies, partyId);
    }
    if (runSection('profile')) await captureProfile(page);
    if (runSection('skill')) await captureSkill(page);
    if (runSection('chat')) await captureChat(page);
    if (runSection('friends')) await captureFriends(page);
    if (runSection('notifications')) await captureNotifications(page);
    if (runSection('feedback')) await captureFeedback(page);
    if (runSection('nav')) await captureNav(page);

    await ctx.close();
  } finally {
    await browser.close();
  }

  const files = fs.readdirSync(SCREENSHOT_DIR).filter(f => f.endsWith('.png'));
  console.log(`\n🎉 Done! ${files.length} screenshots saved to: ${SCREENSHOT_DIR}`);
}

main().catch(console.error);
