import { Page } from 'puppeteer'

type PrimeProps = {
  slide: {
    url: string
  },
  course: object,
  primeLessons: {id: number}[]
}

export async function extract_data_react_props(page: Page) {
  return await page.$eval('div[data-react-props]', (el): PrimeProps => JSON.parse(el.getAttribute('data-react-props') || ''))
}

export async function video_URLs (page: Page) {
  const prime_props = await extract_data_react_props(page)
  return prime_props.primeLessons
                    .map(c => c.id)
                    .map((cid) => `https://www.palmie.jp/prime_lessons/${cid}`)
}

export async function slide_URLs(page: Page) {
  const prime_props = await extract_data_react_props(page)
  return prime_props.slide.url
}

export async function special_offer_URLs (page: Page) {
  return await page.$$eval('a', list => {
    const offer_link = list.find(el => el.textContent === '講座資料・特典ファイルのダウンロード') as HTMLLinkElement | undefined
    return offer_link ? offer_link.href : ''
  })
}

export function capture_video_URL (page: Page): Promise<string> {
  return new Promise(async (resolve, reject) => {
    await page.setRequestInterception(true);
    page.on('request', inter_req => {
      if (inter_req.url().includes('master.json')) { resolve(inter_req.url()) }
      inter_req.continue().catch(e => e)
    })
    await page.reload({ waitUntil: ["networkidle2", "domcontentloaded"] });
  })
}
