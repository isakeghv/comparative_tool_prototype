import jwt from 'jsonwebtoken';
import { getCookie, useRuntimeConfig } from '#imports';

// return if not JWT token in cookies or if it has been tampered with
export const verifyToken = (e) => {
    const token = getCookie(e, "token");
    const config = useRuntimeConfig();
    
    if (!token) return { user: null, error: 401, message: "Unauthorized" };

    try {
        const decoded = jwt.verify(token, config.private.secretJWT);
        return { valid: true, decoded };
    } catch (err) {
        return { valid: false, error: err.message };
    }
};