/**
 * Badminton Party — PDF Generator
 * =================================
 * แปลง tutorial.html → PDF ด้วย Playwright
 *
 * Usage:
 *   node tutorial/generate-pdf.cjs
 *
 * Prerequisites:
 *   npm install @playwright/test
 *   npx playwright install chromium
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const getArg = (name) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : null;
};

const HTML_FILE = path.join(__dirname, 'tutorial.html');
const OUTPUT_PDF = getArg('output') || path.join(__dirname, 'Badminton-Party-คู่มือการใช้งาน.pdf');

async function main() {
  console.log('📄 Badminton Party — PDF Generator');
  console.log(`   Input:  ${HTML_FILE}`);
  console.log(`   Output: ${OUTPUT_PDF}\n`);

  if (!fs.existsSync(HTML_FILE)) {
    console.error('❌ tutorial.html not found!');
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Load via file:// URL so relative image paths resolve correctly
  const fileUrl = `file://${HTML_FILE}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // Wait for images to load
  await page.waitForTimeout(3000);

  // Check how many images loaded
  const imgCount = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img');
    let loaded = 0;
    imgs.forEach(img => { if (img.complete && img.naturalWidth > 0) loaded++; });
    return { total: imgs.length, loaded };
  });
  console.log(`   Images: ${imgCount.loaded}/${imgCount.total} loaded`);

  // Generate PDF
  await page.pdf({
    path: OUTPUT_PDF,
    format: 'A4',
    margin: {
      top: '15mm',
      bottom: '15mm',
      left: '12mm',
      right: '12mm',
    },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-size: 9px; color: #999; width: 100%; text-align: center; padding: 0 20px;">
        Badminton Party — คู่มือการใช้งาน
      </div>
    `,
    footerTemplate: `
      <div style="font-size: 9px; color: #999; width: 100%; text-align: center; padding: 0 20px;">
        หน้า <span class="pageNumber"></span> / <span class="totalPages"></span>
      </div>
    `,
  });

  await browser.close();

  const fileSize = (fs.statSync(OUTPUT_PDF).size / 1024 / 1024).toFixed(2);
  console.log(`\n✅ PDF generated: ${OUTPUT_PDF} (${fileSize} MB)`);
}

main().catch(console.error);
