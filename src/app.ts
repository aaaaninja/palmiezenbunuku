import puppeteer from 'puppeteer'
import { promises as fs } from 'fs'
function pp<T> (v: T) { console.log(v); return v }
const last_matcher = /[^/]+$/

const target_course = process.argv[2]
const course_number = target_course.match(last_matcher)?.[0]

;(async () => {
  await fs.mkdir(`${course_number}`, { recursive: true }) // 保存用フォルダ

  const browser = await puppeteer.launch({ headless: false, devtools: true, defaultViewport: { width: 1600, height: 1200 }, args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security',
//  '--user-data-dir',
    '--disable-site-isolation-trials'
  ] })
  const page = await browser.newPage();

  await page.goto('https://www.palmie.jp/users/new', { waitUntil: ["networkidle2", "domcontentloaded"] })
  await page.click('.common-btn-pink')
  await page.type('input#session_email', process.env.DEF_USERNAME as string)
  await page.type('input#session_password', process.env.DEF_PASSWORD as string)
  await page.click('#main-body > div.popup-user-login-section > div > div > div.popup-user-login-content-inner > div.popup-user-form > form > div > button')
  await page.waitFor('footer')
  await page.reload({ waitUntil: ["networkidle2", "domcontentloaded"] });
  await page.waitFor(3000)

  await page.goto(target_course)

  await page.setRequestInterception(true);
  page.on('request', inter_req => {
    if (inter_req.url().includes('master.json')) { console.log(inter_req.url()) }
    inter_req.continue()
  })

  await page.goto('https://www.palmie.jp/courses/67', { waitUntil: ["networkidle2", "domcontentloaded"] })

  debugger;
  // @ts-ignore
  const target_url = await page.$eval('body > div.p-drawer-movable > main > div:nth-child(3) > div.l-course-show__right > div.p-course-show__buttons > a', a_link => a_link.href)
  await page.goto(pp(target_url), { waitUntil: ["networkidle2", "domcontentloaded"] })
  debugger;
  await page.waitFor(90000)

  await browser.close();
})()
//  | xargs yarn run vanilla-clipper 'https://www.nnn.ed.nico/contents/guides/2158/content'
