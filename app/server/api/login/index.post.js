import jwt from 'jsonwebtoken';
import { useRuntimeConfig, setCookie } from '#imports';
import validator from "validator";
import { readBody, setResponseStatus, defineEventHandler } from "h3";
import { connDb } from '~/server/services/connDb.js';
import { checkRateLimit } from '~/server/services/rateLimiter.js';
import { sanitizer } from '~/server/utils/sanitize'
import validate from "~/server/validation/validator";
import checkCaptcha from "~/server/services/captcha";
import checkCredentials from "~/server/services/authService";

// access runtime config variables
const config = useRuntimeConfig();

export async function loginLogic(event) {
    if (!event) {
        setResponseStatus(event, 401)
        return { isValid: false, message: 'Invalid/incomplete input provided' }
    }

    const rawBody = await readBody(event);

    const body = sanitizer(rawBody);
    if (!body) {
        setResponseStatus(event, 401)
        return { isValid: false, message: 'Invalid/incomplete input provided' }
    }

    // Sanitize
    const cleanEmail = validator.normalizeEmail(body?.email);

    const inputIsValid = validate.login({ password: body?.password, turnstileToken: body?.turnstileToken, email: cleanEmail })
    if (!inputIsValid) {
        setResponseStatus(event, 400);
        return { isValid: false, message: 'Invalid input' }
    }

    const { password, turnstileToken } = body;

    //updated to use try/catch for database, so errors can be caught and returned
    try {
        await connDb();
    } catch (err) {
        setResponseStatus(event, 500);
        return { isValid: false, message: 'Unable to connect to database' }
    }

    // RateLimiter
    const { allowed, retryAfter } = await checkRateLimit(event, '/api/login');
    if (!allowed) {
        setResponseStatus(event, 429);
        return { isValid: false, message: `Too many login attempts. Try in ${retryAfter} minutes.` };
    }

    const captchaRes = await checkCaptcha(process.env.TURNSTILE_SECRET_KEY, turnstileToken)
    if (!captchaRes.success) {
        setResponseStatus(event, 403);
        return { isValid: false, message: "CAPTCHA verification failed." };
    }

    const userID = await checkCredentials.userID(cleanEmail, password);
    if (!userID) {
        setResponseStatus(event, 404);
        return { isValid: false, message: 'Incorrect email or password' }
    }

    // have user_id as payload that will be stored in JWT token, and let the token expire after 5 hour (currently using 1h for test-purpose rn)
    const token = jwt.sign({ userId: userID }, process.env.SECRET_JWT, { expiresIn: '5h' })

    //setting token when logging in instead of setting to header. including jwt token in cookie for secure cookie.
    setCookie(event, 'token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    })

    // set status to OK; return status and message that login operation was successful
    setResponseStatus(event, 200);
    return { isValid: true, message: "Login successfully.", token: token };
}

export default defineEventHandler(async (event) => { return loginLogic(event) });
