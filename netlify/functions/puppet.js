import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'

chromium.setHeadlessMode = true
chromium.setGraphicsMode = false

export async function handler(event, context) {

  let availableFlowers = [];
  let lastScrapeTimestamp = '';

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath('/var/task/node_modules/@sparticuz/chromium/bin')),
    })
    let site = 'https://www.mamedica.co.uk/repeat-prescription/'

    console.log('Opening Browser');
    const page = await browser.newPage();
    await page.goto(site);
    await page.setViewport({width: 1080, height: 1024});
    await page.waitForSelector('#field_3_31')
    await page.click('#label_3_31_0');
    await page.click('#label_3_45_0');
    await page.click('#label_3_32_0');
    await page.waitForSelector('#field_3_50 .selectric-scroll')
    
    // capture all the items in stock list
    let elements = await page.$$('#field_3_50 .selectric-scroll ul li');

    // loop trough items
    availableFlowers = [];
    for (let i = 1; i < elements.length; i++) {
      await page.click('#field_3_50 b.button');
      await page.click(`#field_3_50 .selectric-items .selectric-scroll ul li[data-index*="${i}"]`);
      const flower = await page.$eval(`#field_3_50 .selectric-items .selectric-scroll ul li[data-index*="${i}"]`, e => e.innerText);
      await page.waitForTimeout(10) 
      await page.$eval('#input_3_53', el => el.value = '1');
      await page.click('#field_3_77');
      await page.waitForTimeout(20) 
      const getCosts = await page.$eval('#input_3_67', e => e.value);
      const cost = getCosts.replace(/\s/g, '');
      await page.waitForTimeout(20) 
      availableFlowers.push({ "item": 
        {"flower": flower, "cost": cost}
      })
    }

    lastScrapeTimestamp = new Date().toLocaleString('en-GB', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });
    console.log('Scraped data at', lastScrapeTimestamp);
    await browser?.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        availableFlowers,
        lastScrapeTimestamp,
      }),
    }
  } catch (error) {
    console.error('Error during scraping:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    }
  }
}