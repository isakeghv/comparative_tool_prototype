import dotenv from 'dotenv';
import puppeteer from 'puppeteer';

dotenv.config();

// load environment variables from the .env file and have a fallback
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// launch a browser
const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/usr/bin/google-chrome', // for linux (had issue without specifying path; will be changed later)
    slowMo: 50,
    defaultViewport: null,
    args: ['--start-maximized']
});

const context = browser.defaultBrowserContext();

// just set a JWT token in cookies
await context.setCookie({
    name: 'token',
    value: 'insert jwt here',
    domain: 'localhost',
    path: '/',
    httpOnly: false 
});

const page = await browser.newPage();

await page.goto('http://localhost:3000/dashboard');
await page.click('#new-study');

// type a description
await page.type('#details__textarea', 'This is a description.');

// try to save, close popup that says it's not possible without a title
await page.click('#save-btn');
await page.click('#unable-save-exit');

// listen for alert and confirm it
page.on('dialog', async dialog => {
    // show confirm alert for two seconds
    // await new Promise(resolve => setTimeout(resolve, 2000));
    await dialog.dismiss();
});

// show alert can decide if you want to discard changes or save
await page.click('#study-return');

// add a title, save again, and return
await page.type('#details__title_input', 'Perfect title');
await page.click('#save-btn');
await page.click('#study-return');

// show localStorage saving as well here ...

// await page.waitForNavigation();

// await browser.close();