import { connDb } from '~/server/services/connDb.js';
import { verifyToken } from '~/server/services/jwt.js';
import { Study } from '../../../schemas/studySchema.js';

const closeStudy = async (e) => {
    const studyId = e.context.params?.studyId;

    try {
        // find study, check if is not equal to 'closed', and update status
        const updatedStudy = await Study.findOneAndUpdate(
            { id: studyId, status: { $ne: 'closed' } },
            { status: 'closed' }, 
            { new: true }
        );

        // if it wasn't found, it means the status was already 'closed'
        if (!updatedStudy) return { updated: false, message: "Study is already closed." };

        return { updated: true, message: "Study successfully published.", studyId: updatedStudy.id };
    } catch (err) {
        return { updated: false, message: "Issue occured while updating study.", error: err.message };
    }
}

export default defineEventHandler(async (e) => {
    verifyToken(e);
    await connDb();

    // deconstruct the method and the url from the event request object
    const { method, url } = e.node.req;

    // update the status to close
    if (method === 'PATCH' && url.endsWith('/close')) {
        return await closeStudy(e);
    }
});