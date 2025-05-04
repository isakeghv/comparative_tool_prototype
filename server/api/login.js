import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { useRuntimeConfig, setCookie } from '#imports';
import validator from "validator";
import { readBody, setResponseStatus, getRequestHeader, defineEventHandler } from "h3";
import { connDb } from '~/server/services/connDb.js';
import { UserCredential } from '~/server/schemas/userSchema.js';
import { checkRateLimit } from '~/server/services/rateLimiter.js';
import { $fetch } from 'ofetch';

// access runtime config variables
const config = useRuntimeConfig();

// need to add functionality for token-checking, prevent brute-forcing etc. so this is temporary
const checkPassword = async (email, pwd, event) => {
    try {
        // retrieve the user by its email; if it doesn't exist, return a message indicating error
        const user = await UserCredential
            .findOne({ email })
            .lean();

        if (!user) {
            setResponseStatus(event, 401)
            return { isValid: false, message: 'Incorrect email or password.' };
        } else {
            // check if password matches the found user using bcrypt in-built compare method
            const validPwd = await bcrypt.compare(pwd, user.password);

            if (!validPwd) {
                // 422 error code for email was found, but password wasn't correct (wrong input)
                setResponseStatus(event, 422)
                return { isValid: false, message: 'Incorrect email or password.' };
            }
        }

        const userId = user._id.toString();

        // have user_id as payload that will be stored in JWT token, and let the token expire after 5 hour (currently using 1h for test-purpose rn)
        const token = jwt.sign({ userId: userId }, config.private.secretJWT, { expiresIn: '1h' })

        //setting token when logging in instead of setting to header. including jwt token in cookie for secure cookie.
        setCookie(event, 'token', token, {
            //make sure it uses http
            httpOnly: true,

            //make sure it uses https when in production (launched), e.g. only on secured transfer protocol
            secure: process.env.NODE_ENV === 'production',

            //make sure it can only be used when interracting directly with this site, and cannot be sent with cross-site-requests
            sameSite: 'strict',

            //cookie is accessible to all pages
            path: '/',
        })

        // set status to OK; return status and message that login operation was successful
        setResponseStatus(event, 200);
        return { isValid: true, message: "Login successfully.", token: token };

    } catch (err) {
        setResponseStatus(event, 500);

        // return false status and message that there was issue logging in
        return { isValid: false, message: "Issue while trying to login. Please try again." };
    }
}

//moved code into function that can be exported: So testing can be preformed
export async function loginLogic(event) {
    if (!event) {
        setResponseStatus(event, 401)
        return { isValid: false, message: 'Invalid/incomplete input provided' }
    }

    //updated to use try/catch for database, so errors can be caught and returned
    try {
        await connDb();
    } catch (err) {
        setResponseStatus(event, 500);
        return { isValid: false, message: 'Unable to connect to database' }
    }

    const body = await readBody(event);

    if (!body) {
        setResponseStatus(event, 401)
        return { isValid: false, message: 'Invalid/incomplete input provided' }
    }

    const rawEmail = body.email?.toString() || "";

    //updated to check if password exists before attemptint to turn into string
    const rawPassword = body.password?.toString() || "";
    const turnstileToken = body.turnstileToken || "";

    const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

    // RateLimiter
    const ip = getRequestHeader(event, 'x-forwarded-for') || event.node.req.socket.remoteAddress;
    const { allowed, retryAfter } = await checkRateLimit(ip, '/api/login');
    if (!allowed) {
        setResponseStatus(event, 429);
        return {
            isValid: false,
            message: `Too many login attempts. Try again in ${Math.ceil(retryAfter / 60000)} minutes.`,
        };
    }


    const captchaRes = await $fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: new URLSearchParams({
            secret: TURNSTILE_SECRET_KEY,
            response: turnstileToken,
        }),
    });

    if (!captchaRes.success) {
        setResponseStatus(event, 403);
        return { isValid: false, message: "CAPTCHA verification failed." };
    }

    // Validation for Email password remains as is for security
    if (!rawEmail || !validator.isEmail(rawEmail) || !rawPassword) {
        setResponseStatus(event, 400)
        return { isValid: false, message: "Incorrect email or password." }
    }

    // Sanitize
    const cleanEmail = validator.normalizeEmail(rawEmail);

    return await checkPassword(cleanEmail, rawPassword, event);
}

export default defineEventHandler(async (event) => { return loginLogic(event) });
