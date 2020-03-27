const puppeteer = require('puppeteer');
const fs = require('fs').promises;

(async () => {
  const browser = await puppeteer.launch(
    { headless: true
    , devtools: true
    }
  )
  const page = await browser.newPage();
  await page.goto('https://www.nnn.ed.nico/oauth_login?next_url=https://www.nnn.ed.nico/home&target_type=niconico', { waitUntil: 'domcontentloaded' })
  await page.type('input#input__mailtel', process.env.DEF_USERNAME)
  await page.type('input#input__password', process.env.DEF_PASSWORD)
  await page.click('input#login__submit')
  await page.waitFor('a.sc-bdVaJa.gtVQmG')
  await page.waitFor(3000)

  const course_name_and_urls = await page.$$eval('a.sc-bdVaJa.gtVQmG', course_list => {
    return course_list.map(course => [course.querySelector('div.sc-bdVaJa.gRaSAC').textContent, course.href])
  })
  console.error(course_name_and_urls)

  for (const [name, url] of course_name_and_urls) {
    console.error(`start --- ${name}`)

    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await page.waitFor('div.u-list.has-linked-children > li > a')
    const chapter_name_and_urls = await page.$$eval('div.u-list.has-linked-children > li > a', chapter_list => chapter_list.map(chapter => [chapter.querySelector('p').textContent, chapter.href]))
    console.error(chapter_name_and_urls)
    for (const [chapter_name, chapter_url] of chapter_name_and_urls) {
      console.error(`start --- --- ${chapter_name}`)

      await page.goto(chapter_url, { waitUntil: 'domcontentloaded' })
      await page.waitFor('div[data-react-class="App.Chapter"]')
      const [section, lesson] =
        JSON.parse(await page.$eval('div[data-react-class="App.Chapter"]', el => el.getAttribute('data-react-props')))
            .chapter
            .chapter
            .class_headers
//
      await fs.writeFile(`lessons.json`, JSON.stringify(lesson))
      for (const lesson_content of lesson.sections) {
        await page.goto(`https://www.nnn.ed.nico/lessons/${lesson_content.id}`, { waitUntil: 'networkidle2' }) // こんな感じのurl => https://www.nnn.ed.nico/contents/links/90253?content_type=n-yobi or https://www.nnn.ed.nico/lessons/4526123 (こっちはid)
        await page.waitFor(2000)

        console.log( // こんな感じに => https://cdn.fccc.info/MbQa/soroban/42e0e48f88c8ec6dbea9ebf3ad7febcf/soroban-lesson-482528546/movie-1m-private-public.m3u8
          await page.$eval('video', video => video.firstChild.src.replace(/[^\/]+m3u8\?.*/, 'movie-1m-private-public.m3u8'))
        )
      }
      console.error(`end --- --- ${chapter_name}`)
    }
//

    console.error(`end --- ${name}`)
  }

  await browser.close();
})();
// | xargs --replace ffmpeg -i "{}" -movflags faststart -c copy  rec.mp4
