import { setupBrowserWithLogin } from './setupPuppeteer.js';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

let browser, page;

describe('Testing study editor functionality', () => {  
    describe('Saving study', () => {
        beforeAll(async () => {
            try {
                const result = await setupBrowserWithLogin();
                browser = result.browser;
                page = result.page;
              } catch (err) {
                console.error('setup failed:', err);
              }
        });

        it('Saving without using a title', async () => {
            await page.waitForSelector('#new-study');
            await page.click('#new-study');
            await page.type('#details__textarea', 'This is a description.');
            await page.click('#header-save-btn');
            await page.click('#unable-save-exit');
        
            page.on('dialog', async dialog => {
                await dialog.dismiss();
            });
        
            await page.click('#study-return');
            await page.type('#details__title_input', 'Perfect title');
            await page.click('#header-save-btn');
            await page.click('#study-return');
        }, 30000);

        it('Deleting example study', async () => {
            await page.click('.card__button');
            await page.waitForSelector('#popup-delete-btn');
            await page.click('#popup-delete-btn');
        }, 20000);
    
        it('Reload without saving', async () => {
            await page.waitForSelector('#new-study');
            await page.click('#new-study');
            await page.type('#details__title_input', 'New study');
            await page.click('#header-undo-btn');

            await page.type('#details__title_input', 'cool study');
            await page.reload({ waitUntil: 'networkidle0' });
        }, 30000);

        // close after sub-suite
        afterAll(async () => {
            await browser.close();
        });
    });

    describe('Create, publish and see responses of study', () => {
        beforeAll(async () => {
            try {
                const result = await setupBrowserWithLogin();
                browser = result.browser;
                page = result.page;
              } catch (err) {
                console.error('setup failed:', err);
              }
        });

        it('Create a study, and show it in dashboard', async () => {
            await page.waitForSelector('#new-study');
            await page.click('#new-study');
            await page.type('#details__title_input', 'Research study');
            await page.type('#details__textarea', 'This is a description.');
        
            // add a question
            await page.click('.question__add');

            // empty the default question title, and add a new one
            await page.evaluate(() => {
                document.querySelector('#study_question_input').value = '';
            });
            await page.type('#study_question_input', 'What do you prefer?');

            // take the first question to duplicate
            await page.click('.question__duplicate');
            await page.click('#response_checkbox_radio');

            // save and return to dashboard
            await page.click('#header-save-btn');
            await page.click('#study-return');
        }, 60000);

        it('Add consent form, publish study, then check the published url', async () => {
            // close the confirmation box that appears after successfully copying the url
            page.on('dialog', async dialog => {
                await dialog.accept();
            });
            
            // click on the first card by default
            await page.click('.card__select');  // close the confirmation box

            // go to the consent form
            await page.click('#consent-form-button');
            await page.click('#terms__request');
            await page.type('#terms__textarea', 'Accept terms and services.')

            // save study and publish
            await page.click('#header-save-btn');
            await page.click('#header-publish-btn');

            // copy link and navigate to it
            await page.click('#header-link-btn');
            await page.click('#copy-link-btn');

            await page.waitForSelector('#copy');

            const copiedLink = await page.$eval('#copy', el => el.value);
            await page.goto(copiedLink, { waitUntil: 'networkidle0' });
        }, 60000)

        it('Add a response', async () => {
            // accept consent form, click start
            await page.click('#terms__checkbox');
            await page.click('#participant-start-btn');

            // navigate to the end of the two-step quiz
            await page.waitForSelector('#participant-next-btn');
            await page.click('#participant-next-btn');

            await page.waitForSelector('#participant-send-btn');
            await page.click('#participant-send-btn');
        }, 30000)

        it('Show responses', async () => {
            // go back to dashboard
            await page.goto(`${BASE_URL}/dashboard`);
            await page.waitForSelector('.card__select');
            await page.click('.card__select');
            await page.click('.question__button');
        
            // switch to view responses
            await page.click('#header-btn-responses');
            await page.select('#view_select', 'individual');
            await page.click('.slide__btn');

            // switch it off again
            await page.click('#header-btn-responses');
        }, 60000)
    
        // close after sub-suite
        afterAll(async () => {
            await browser.close();
        });
    });
});