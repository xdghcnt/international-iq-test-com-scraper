import fs from "fs";
import scrapy from "node-scrapy";
import moment from "moment";
import puppeteer from "puppeteer";
import readLastLines from "read-last-lines";

let page;
const get = async (url) => {
    console.log(`getting ${decodeURI(url)}`);
    await launchBrowser();
    await page.goto(url);
    return page.content();
};
const launchBrowser = async () => {
    if (!page) {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox']
        });
        page = await browser.newPage();
    }
};

const
    url = 'https://international-iq-test.com',
    storeFile = 'store.txt',
    process = async () => {
        const scrapedData = scrapy.extract(await get(url), [
            '.col-xs-12 .res', {
                username: '.username',
                result: 'b',
                datetime: '.timeTF',
                countryName: '.flag (title)',
                flagImg: '.flag (src)'
            }
        ]).slice(3);
        scrapedData.forEach((item) => item.datetime = (+moment(item.datetime, 'DD/MM/YY hh:mm')/1000));
        const lastStoredLine = await readLastLines.read(storeFile, 1);
        const lastStoredDatetime = lastStoredLine ? JSON.parse(lastStoredLine).datetime : 0;
        const filteredScrapedData = scrapedData.reverse().filter((item) => item.datetime > lastStoredDatetime);
        if (filteredScrapedData.length)
            fs.appendFileSync(storeFile, `${filteredScrapedData.map((it) => JSON.stringify(it)).join("\n")}\n`);
    };

if (!fs.existsSync(storeFile))
    fs.writeFileSync(storeFile, '');

export async function startScraper() {
    await process();
    setInterval(process, 1000 * 60);
    console.log('scraper started');
}
