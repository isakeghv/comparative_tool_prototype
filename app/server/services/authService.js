import { UserCredential } from "../schemas/userSchema";
import bcrypt from "bcryptjs";

const getUserId = async (email, pwd) => {

    // retrieve the user by its email; if it doesn't exist, return
    const user = await UserCredential.findOne({ email }).lean();
    if (!user) return null;

    const validPwd = await bcrypt.compare(pwd, user.password);
    if (!validPwd) return null;

    return user._id.toString();
}

const checkCredentials = {
    userID: getUserId
}

export default checkCredentials;