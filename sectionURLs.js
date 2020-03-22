const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch(
    { headless: false
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
  console.log(course_name_and_urls)

  for (const [name, url] of course_name_and_urls) {
    console.log(`start --- ${name}`)

    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await page.waitFor('div.u-list.has-linked-children > li > a')
    const chapter_name_and_urls = await page.$$eval('div.u-list.has-linked-children > li > a', chapter_list => chapter_list.map(chapter => [chapter.querySelector('p').textContent, chapter.href]))
    console.log(chapter_name_and_urls)
    for (const [chapter_name, chapter_url] of chapter_name_and_urls) {
      console.log(`start --- --- ${chapter_name}`)

      await page.goto(chapter_url, { waitUntil: 'domcontentloaded' })
      await page.waitFor('div[data-react-class="App.Chapter"]')
      const [section, lesson] =
        JSON.parse(await page.$eval('div[data-react-class="App.Chapter"]', el => el.getAttribute('data-react-props')))
            .chapter
            .chapter
            .class_headers
      section.sections.forEach(section_content => console.log(section_content.content_url))
      console.log(`end --- --- ${chapter_name}`)
    }

    console.log(`end --- ${name}`)
  }

  debugger;
  await browser.close();
})();