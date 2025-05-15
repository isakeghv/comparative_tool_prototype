import jwt from 'jsonwebtoken';

export const auth = (event) => {
    const token = getCookie(event, 'token');

    if (!token) return false;

    try {
        //try to decode to get user-info to authenticate their login
        const decoded = jwt.verify(token, process.env.SECRET_JWT);

        //return true if it can be decoded, and userID is found
        if (decoded && decoded.userId) return true;


    } catch (err) {

        console.log(err);
        return false
    }
}