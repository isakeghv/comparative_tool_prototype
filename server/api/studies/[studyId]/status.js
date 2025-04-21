import { connDb } from '~/server/services/connDb.js';
import { verifyToken } from '~/server/services/jwt.js';
import { Study } from '../../../schemas/studySchema.js';

const updateStudyStatus = async (e, data) => {
    const studyId = e.context.params?.studyId;
    const status = data.status;

    // only allow 'ongoing' or 'completed' as valid statuses
    if (!['ongoing', 'completed'].includes(status)) {
        return { updated: false, message: "Invalid status provided." };
    }

    try {
        // find study, check if is not equal to 'ongoing', and update status
        const updatedStudy = await Study.findOneAndUpdate(
            { id: studyId, status: { $ne: status } },
            { status: status }, 
            { new: true }
        );

        // if it wasn't found, it means the status was already the initial status
        if (!updatedStudy) {
            return { updated: false, message: `Study is already '${status}'.` };
        }

        setResponseStatus(200);

        // return id to find the correct id on the frontend, and update the change on the frontend as well
        return {
            updated: true,
            message: `Study successfully updated to '${status}'.`,
            studyId: updatedStudy.id
        };
    } catch (err) {
        console.log(err);
        return { updated: false, message: "Issue occured while publishing study.", error: err.message };
    }
}

export default defineEventHandler(async (e) => {
    try {
        verifyToken(e);
    } catch (err) {
        return { updated: false, message: "Invalid or missing token.", error: err.message };
    }

    await connDb();

    // deconstruct the method and the url from the event request object
    const { method, url } = e.node.req;

    // check if the request is for status update (/studies/:id/publish), and chang the status to 'ongoing'
    if (method === 'PATCH' && url.endsWith('/status')) {
        const body = await readBody(e);
        return await updateStudyStatus(e, body);
    }
});