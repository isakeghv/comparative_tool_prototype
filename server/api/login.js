import bcrypt from "bcryptjs";
import { connDb } from "../utils/connDb.js";
import { userCredential } from '../models/userCredential.js';

// need to add functionality for token-checking, prevent brute-forcing etc. so this is temporary
const checkPassword = async (email, pwd) => {
    try {
        // retrieve the user by its email; if it doesn't exist, return a message indicating error
        const user = await userCredential.findOne({ email });

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

        // set status to OK; return status and message that login operation was successful
        setResponseStatus(200);
        return { isValid: true, message: "Login successfully." };
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

    return await checkPassword(email, password);
});
