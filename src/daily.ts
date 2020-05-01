import { Page } from 'puppeteer'

type DailyProps = {
  chapter: {
    slide: {
      url: string
    }
  },
  course: object,
  dailyLessons: Array<{chapters: Array<{id: number}>}>
}

export async function video_URLs (page: Page) {
  const daily_props = await page.$eval('div[data-react-props]', (el): DailyProps => JSON.parse(el.getAttribute('data-react-props') || ''))
  return daily_props.dailyLessons
                    .map(days => days.chapters.map(c => c.id))
                    .flat()
                    .map((cid) => `https://www.palmie.jp/daily_lesson_chapters/${cid}`)
}

export async function slide_URLs(page: Page) {
  const daily_props = await page.$eval('div[data-react-props]', (el): DailyProps => JSON.parse(el.getAttribute('data-react-props') || ''))
  return daily_props.chapter.slide.url
}

export async function special_offer_URLs (page: Page) {
  const isHTMLLinkElement = (el: any): el is HTMLLinkElement => el?.href

  const special_offer = await page.$$eval('a', list => list.find(el => el.textContent == '講座資料・特典ファイルのダウンロード'))
  return isHTMLLinkElement(special_offer) ? special_offer.href : ''
}

export function capture_video_URL (page: Page): Promise<string> {
  return new Promise((resolve, reject) => {
    page.on('request', inter_req => {
      if (inter_req.url().includes('master.json')) { resolve(inter_req.url()) }
      inter_req.continue()
    })
  })
}