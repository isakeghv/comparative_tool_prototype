import { useRuntimeConfig } from '#imports';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) =>{

    //getting cookie containing token
    const token = getCookie(event, 'token');

    if (!token) return { error: "No token found" };

    const config = useRuntimeConfig();

    try {
        //try to decode to get user-info
        const decoded = jwt.verify(token, process.env.SECRET_JWT);

        //return user info
        return { userId: decoded.userId, error: null };

      } catch {
        //return with error if token is invalid
        return { error: "Invalid token" }; // Return as response, not as a thrown error
      }
})