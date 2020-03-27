const puppeteer = require('puppeteer');
const fs = require('fs').promises;

const target_chapter_url = process.argv[2]

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

  console.error(`start --- ${target_chapter_url}`)

  await page.goto(target_chapter_url, { waitUntil: 'domcontentloaded' })
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
    section.sections.filter(el => el.resource_type === 'movie').forEach(({ content_url }) => console.log(content_url))
    const dir_name_content = `${name.replace(/[(\\|/|:|\\*|?|\"|<|>|\\\\|)]/g, '')}/${chapter_name.replace(/[(\\|/|:|\\*|?|\"|<|>|\\\\|)]/g, '')}`
    console.error(dir_name_content)
    await fs.mkdir(dir_name_content, { recursive: true })
    await fs.writeFile(`${dir_name_content}/sections.json`, JSON.stringify(section))
    for (const { content_url } of section.sections.filter(el => el.resource_type === 'movie')) {
      await page.goto(content_url, { waitUntil: 'networkidle2' }) // こんな感じのurl => https://www.nnn.ed.nico/contents/links/90253?content_type=n-yobi or https://www.nnn.ed.nico/contents/guides/2158/content (こっちはid)
      await page.waitFor(2000)

      await page.$$eval('#movie > source', ([_, source]) => console.log(source.src))
    }
    console.error(`end --- --- ${chapter_name}`)
  }

  console.error(`end --- ${target_chapter_url}`)
  await browser.close();
})();
