import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { useRuntimeConfig, setCookie } from '#imports';
import { connDb } from "../utils/connDb.js";
import { userCredential } from '../models/user.js';

// need to add functionality for token-checking, prevent brute-forcing etc. so this is temporary
const checkPassword = async (email, pwd, e) => {
    try {
        // access runtime config variables
        const config = useRuntimeConfig();

        // retrieve the user by its email; if it doesn't exist, return a message indicating error
        const user = await userCredential
                    .findOne({ email })
                    .lean();

        if (!user) {
            setResponseStatus(404)
            return { isValid: false, message: 'Incorrent email or password.' };
        } else {
            // check if password matches the found user using bcrypt in-built compare method
            const validPwd = await bcrypt.compare(pwd, user.password);

            if (!validPwd) {
                // 422 error code for email was found, but password wasn't correct (wrong input)
                setResponseStatus(422)
                return { isValid: false, message: 'Incorrent email or password.' };
              }
        }

        const userId = user._id.toString();

        // have user_id as payload that will be stored in JWT token, and let the token expire after 5 hour (currently using 30s for test-purpose)
        const token = jwt.sign({ userId: userId }, config.private.secretJWT, { expiresIn: '30s'})

        //setting token when logging in instead of setting to header. including jwt token in cookie for secure cookie.
        setCookie(e, 'token', token, {
            //make sure it uses http
            httpOnly: true,

            //make sure it uses https when in production (launched), e.g. only on secured transfer protocol
            secure: process.env.NODE_ENV === 'production',

            //make sure it can only be used when interracting directly with this site, and cannot be sent with cross-site-requests
            sameSite: 'strict',

            //cookie is accessible to all pages
            path: '/',
        })
        // set token in response header
        /*setHeaders(e, {
            'token': token
        });*/

        // set status to OK; return status and message that login operation was successful
        setResponseStatus(200);
        return { isValid: true, message: "Login successfully.", token: token };

    } catch (err) {
        setResponseStatus(500);

        // return false status and message that there was issue logging in
        return { isValid: false, message: "Issue while trying to login. Please try again." };
    }
}

export default defineEventHandler(async (e) => {
    await connDb();
    const body = await readBody(e);
    const { email, password } = body;

    return await checkPassword(email, password, e);
});
