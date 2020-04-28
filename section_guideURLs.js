const puppeteer = require('puppeteer');
const fs = require('fs').promises;

//const target_chapter_url = process.argv[2]

(async () => {
  const browser = await puppeteer.launch({ devtools: true })
  const page = await browser.newPage();

  await page.goto('https://www.palmie.jp/users/new', { waitUntil: ["networkidle2", "domcontentloaded"] })
  await page.click('.common-btn-pink')
  await page.type('input#session_email', process.env.DEF_USERNAME)
  await page.type('input#session_password', process.env.DEF_PASSWORD)
  await page.click('#main-body > div.popup-user-login-section > div > div > div.popup-user-login-content-inner > div.popup-user-form > form > div > button')
  await page.waitFor('footer')
  await page.reload({ waitUntil: ["networkidle2", "domcontentloaded"] });
  await page.waitFor(3000)

  await browser.close();
})();
//  | xargs yarn run vanilla-clipper 'https://www.nnn.ed.nico/contents/guides/2158/content'
