import puppeteer from 'puppeteer'
import { promises as fs } from 'fs'
import spawnAsync from '@expo/spawn-async'
function pp<T> (v: T) { console.log(v); return v }
const last_matcher = /[^/]+$/

import { special_offer_URLs, extract_data_react_props, video_URLs, slide_URLs, capture_video_URL } from './daily'

const target_course = process.argv[2]
const course_number = target_course.match(last_matcher)?.[0]

;(async () => {
  const browser = await puppeteer.launch({ headless: false, devtools: true, defaultViewport: { width: 1600, height: 1200 }, args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security',
//  '--user-data-dir',
    '--disable-site-isolation-trials'
  ] })
  const page = await browser.newPage();

//login/////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
  await page.goto('https://www.palmie.jp/users/new', { waitUntil: ["networkidle2", "domcontentloaded"] })
  await page.click('.common-btn-pink')
  await page.type('input#session_email', process.env.DEF_USERNAME as string)
  await page.type('input#session_password', process.env.DEF_PASSWORD as string)
  await page.click('#main-body > div.popup-user-login-section > div > div > div.popup-user-login-content-inner > div.popup-user-form > form > div > button')
  await page.waitFor('footer')
  await page.reload({ waitUntil: ["networkidle2", "domcontentloaded"] });
  await page.waitFor(3000)
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  await page.goto(target_course, { waitUntil: ["networkidle2", "domcontentloaded"] })

  // @ts-ignore
  const target_chapter_url = await page.$eval('body > div.p-drawer-movable > main > div:nth-child(3) > div.l-course-show__right > div.p-course-show__buttons > a', a_link => a_link.href)
  const special_offer_url = pp(await special_offer_URLs(page))

  type CourseKind = 'daily_lesson_chapters' | 'prime_lessons'
  const course_kind = pp(target_chapter_url.match(/https:\/\/www.palmie.jp\/(.+)\//)?.[1]) as CourseKind// 'https://www.palmie.jp/prime_lessons/657'.match(/https:\/\/www.palmie.jp\/(.+)\//)[1] => "prime_lessons"

  await page.goto(pp(target_chapter_url), { waitUntil: ["networkidle2", "domcontentloaded"] })
  const [cur, video_urls, slide_url] = await (async () => { // 推論してくれない😠
    switch (course_kind) {
      case 'daily_lesson_chapters':
        const [cur, ...urls] = pp(await video_URLs(page))
        const slide_url = pp(await slide_URLs(page))
        return [cur, urls, slide_url]

      case 'prime_lessons':
        return 'hoge'

      default:
        const _: never = course_kind
        return _
    }
  })()

  const master_m3u8_url = pp(await capture_video_URL(page)).replace(last_matcher, 'master.m3u8')
  const target_directory = `${course_number}`
  const c_number = (cur as string).match(last_matcher)?.[0] // 推論してくれない😠
  await fs.mkdir(target_directory, { recursive: true })
  await fs.writeFile(`${target_directory}/info.txt`, JSON.stringify(await extract_data_react_props(page), null, 4))

  const [result_video, result_slide, result_offer] = await Promise.all([
    spawnAsync('youtube-dl', ['-o', `${target_directory}/${c_number}_%(format)s_%(resolution)s.mp4`, '-f', 'bestvideo+audio-high-audio/audio-medium-audio', master_m3u8_url]),
    spawnAsync('bash', ['get_slides.sh', (slide_url as string).replace(last_matcher,''), target_directory]).catch(e => e),
    special_offer_url ? spawnAsync('wget', [special_offer_url, '-P', target_directory]) : spawnAsync('echo', ['offerはなかったでござる'])
  ])

  for (const chapter of video_urls) {
    await page.goto(chapter, { waitUntil: ["networkidle2", "domcontentloaded"] })
    const master_m3u8_url = pp(await capture_video_URL(page)).replace(last_matcher, 'master.m3u8')
  }

  await browser.close();
})()
//  | xargs yarn run vanilla-clipper 'https://www.nnn.ed.nico/contents/guides/2158/content'
