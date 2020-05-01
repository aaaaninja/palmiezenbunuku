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

