import { deleteCookie } from "#imports";

export default defineEventHandler(async (e) => {

    //removing cookie for log-in
    deleteCookie(e, 'token')

    //returning success message so front-end can reload and effecively log user out.
    return {success: true, message: 'Successfully logged out'};
});