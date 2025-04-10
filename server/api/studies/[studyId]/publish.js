import { connDb } from '~/server/services/connDb.js';
import { verifyToken } from '~/server/services/jwt.js';
import { Study } from '../../../schemas/studySchema.js';

const publishStudy = async (e) => {
    const studyId = e.context.params?.studyId;

    try {
        // find study, check if is not equal to 'ongoing', and update status
        const updatedStudy = await Study.findOneAndUpdate(
            { id: studyId, status: { $ne: 'ongoing' } },
            { status: 'ongoing' }, 
            { new: true }
        );

        // if it wasn't found, it means the status was already 'ongoing'
        if (!updatedStudy) return { updated: false, message: "Study is already ongoing." };

        // return id to find the correct id on the frontend, and update the change on the frontend as well
        return { updated: true, message: "Study successfully published.", studyId: updatedStudy.id };
    } catch (err) {
        console.log(err);
        return { updated: false, message: "Issue occured while publishing study.", error: err.message };
    }
}

export default defineEventHandler(async (e) => {
    verifyToken(e);
    await connDb();

    // deconstruct the method and the url from the event request object
    const { method, url } = e.node.req;

    // check if the request is for status update (/studies/:id/publish), and chang the status to 'ongoing'
    if (method === 'PATCH' && url.endsWith('/publish')) {
        return await publishStudy(e);
    }
});