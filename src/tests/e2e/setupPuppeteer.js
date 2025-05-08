import puppeteer from 'puppeteer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const USER_ID = '67cac451bfd17c05c0e86c44';

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.SECRET_JWT || '1', { expiresIn: '1h' });
};

export const setupBrowserWithLogin = async () => {
    const token = generateToken(USER_ID);

    const browser = await puppeteer.launch({
        headless: false,
        executablePath: '/usr/bin/google-chrome',
        slowMo: 65,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();
    const context = browser.defaultBrowserContext();

    await context.setCookie({
        name: 'token',
        value: token,
        domain: 'localhost'
    });

    await page.goto(`${BASE_URL}/dashboard`);

    return { browser, page };
};
