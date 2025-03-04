import bcrypt from "bcryptjs";
import { connDb } from "../utils/connDb.js";
import { userCredential } from '../models/userCredential.js';

// need to add functionality for token-checking, prevent brute-forcing etc. so this is temporary
const checkPassword = async (email, pwd) => {
    try {
        // retrieve the user by its email; if it doesn't exist, return a message indicating error
        const user = await userCredential.findOne({ email });
        const errMsg = 'Incorrent email or password.';

        if (!user) {
            // https://stackoverflow.com/questions/7939137/what-http-status-code-should-be-used-for-wrong-input
            // "The 422 (Unprocessable Entity) status code means the server understands the content type of the request entity, but was unable to process the contained instructions"
            setResponseStatus(422)
            return { isValid: false, message: errMsg };
        } else {
            // check if password matches the found user using bcrypt in-built compare method
            const validPwd = await bcrypt.compare(pwd, user.password);

            if (!validPwd) {
                setResponseStatus(422)
                return { isValid: false, message: errMsg };
              }
        }

        // set status to OK; return status and message that login operation was successful
        setResponseStatus(200);
        return { isValid: true, message: "Login successfully." };
    } catch (err) {
        console.log(err);
        setResponseStatus(500);

        //return false status and message that there was issue creating the account
        return { created: false, message: "Issue while trying to login. Please try again." };
    }
}

export default defineEventHandler(async (e) => {
    await connDb();
    const body = await readBody(e);
    const { email, password } = body;

    return await checkPassword(email, password);
});
