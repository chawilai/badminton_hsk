/**
 * Badminton Party — Quick Guide PDF Generator
 * =============================================
 * แปลง quickguide.html → PDF (A4 Landscape, 1 หน้า)
 *
 * Usage:
 *   node tutorial/generate-quickguide.cjs
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const HTML_FILE = path.join(__dirname, 'quickguide.html');
const OUTPUT_PDF = path.join(__dirname, 'Badminton-Party-คู่มือเริ่มต้น.pdf');

async function main() {
  console.log('📄 Quick Guide PDF Generator');
  console.log(`   Input:  ${HTML_FILE}`);
  console.log(`   Output: ${OUTPUT_PDF}\n`);

  if (!fs.existsSync(HTML_FILE)) {
    console.error('❌ quickguide.html not found!');
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const fileUrl = `file://${HTML_FILE}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Check images
  const imgCount = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img');
    let loaded = 0;
    imgs.forEach(img => { if (img.complete && img.naturalWidth > 0) loaded++; });
    return { total: imgs.length, loaded };
  });
  console.log(`   Images: ${imgCount.loaded}/${imgCount.total} loaded`);

  if (imgCount.loaded < imgCount.total) {
    console.log('   ⚠️  Some images missing — run capture-quickguide.cjs first');
  }

  await page.pdf({
    path: OUTPUT_PDF,
    landscape: true,
    format: 'A4',
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
    printBackground: true,
    preferCSSPageSize: true,
  });

  await browser.close();

  const fileSize = (fs.statSync(OUTPUT_PDF).size / 1024).toFixed(0);
  console.log(`\n✅ PDF generated: ${OUTPUT_PDF} (${fileSize} KB)`);
}

main().catch(console.error);
