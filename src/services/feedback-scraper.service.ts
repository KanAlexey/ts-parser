import { Feedback } from '../models/feedback.model';
import {launch} from 'puppeteer';

export class FeedbackScraperService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public crawl() {
        (async () => {
            const browser = await launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
     
            const page = await browser.newPage();
            await page.goto(this.baseUrl);

            let items: { author: string, rating: string, body: string, date: string }[] = []

            const selectorForLoadMoreButton = 'button.vendor-reviews__btn--load-more';
            console.info('started scraping')
            let loadMoreVisible = await this.isElementVisible(page, selectorForLoadMoreButton);
            while (loadMoreVisible) {
                items = await page.evaluate(this.extractItems);
                await page
                .click(selectorForLoadMoreButton)
                .catch(() => {});
                loadMoreVisible = await this.isElementVisible(page, selectorForLoadMoreButton);
            }
            console.info("scraped successfully");
            console.info("started write to database");
            await this.saveItems(items);
            console.info("finish write to database");
        
            browser.close();
        })();
    }

    private async isElementVisible(page: any, cssSelector: string) {
        const cssSelector2 = 'div.vendor-reviews-result__container'
        let visible = true;
        await page
          .waitForSelector(cssSelector, { visible: true, timeout: 5000 })
          .catch(() => {
            visible = false;
          });
          await page
          .waitForSelector(cssSelector2, { visible: false, timeout: 2000 })
          .catch(() => {
            visible = true;
          });
        return visible;
      }

    private async saveItems(items: any) {
        items.forEach(async (i: any) => {
            // TODO check wheather to update feedback or not 
            // const oldFeedback = await Feedback.find({ author: i.author, body: i.body });
            // if (oldFeedback) {
                
            // }
            const rated_at = await this.getDate(i.date);
            console.log(i)
            const feedback = new Feedback({ ...i, rated_at });
            await feedback.save();
        })
    }

    public async getDate(dateString: string) {
        const monthArray = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        const dateArray = dateString.split(' ');
        const day = dateArray[0];
        const year = dateArray[dateArray.length - 2].replace(',', '');
        const month = monthArray.indexOf(dateArray[1]) + 1;
        const time = dateArray[dateArray.length - 1].split(':');
        const hours = time[0].length < 2  ? `0${time[0]}` : time[0]
        const mins = time[1]
        return new Date(`${year}-${month}-${day}T${hours}:${mins}:00Z`).toISOString();
    }

    private extractItems(): { author: string, rating: string, body: string, date: string, answers?: string[] }[] {
        const extractedContainers = document.querySelectorAll('li.vendor-reviews-item__container')
        const items: { author: string, rating: string, body: string, date: string, answers?: string[] }[] = [];
        for(let element of extractedContainers) {
            const body: any = element.querySelector('div.vendor-reviews-item__text');
            const author: any = element.querySelector('span.vendor-reviews-item__username');
            const rating: any = element.querySelector('span.rating__value');
            const date: any  = element.querySelector('span.vendor-reviews-item__date');

            const obj: { author: string, rating: string, body: string, date: string, answers?: string[] } = {
                body: body.textContent, author: author.textContent,  rating: rating.textContent, date: date.textContent
            };

            const answers: any = element.querySelectorAll('div.vendor-reviews-item__answer-text');
            if (answers) {
                let answerArray = [];
                for (let answer of answers) {
                    answerArray.push(answer.textContent);
                }
                obj.answers = answerArray;

            }
            items.push(obj);
        }

        return items;
      }

}