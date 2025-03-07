import { deleteCookie } from "#imports";
import mongoose from "mongoose";

export default defineEventHandler(async (e) => {

    //removing cookie for log-in, and close conenction to database
    deleteCookie(e, 'token')
    mongoose.connection.close();

    //returning success message so front-end can reload and effecively log user out.
    return {success: true, message: 'Successfully logged out'};
});