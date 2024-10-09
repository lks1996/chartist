const puppeteer = require('puppeteer'); 
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const fs = require('fs');
const path = require('path');

function getFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--autoplay-policy=no-user-gesture-required']
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 520,
    height: 720,
    deviceScaleFactor: 2,
  });

  await page.evaluate(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  });

  const recorder = new PuppeteerScreenRecorder(page);

  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const formattedDate = getFormattedDate();
  const videoPath = path.join(outputDir, `output_${formattedDate}.mp4`);

  await page.goto('http://localhost:3000/sample.html', {
    waitUntil: 'networkidle2',
  });

  await recorder.start(videoPath);

  await wait(10500);

  await recorder.stop();

  await browser.close();
})();
