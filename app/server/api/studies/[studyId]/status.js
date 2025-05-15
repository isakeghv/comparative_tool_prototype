import { connDb } from '~/server/services/connDb.js';
import { verifyToken } from '~/server/services/jwt.js';
import { Study } from '../../../schemas/studySchema.js';
import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import { auth } from '~/server/services/authenticated.js';
import { sanitizer } from '~/server/utils/sanitize.js';


const updateStudyStatus = async (e, data) => {
    const studyId = e.context.params?.studyId;
    const status = data.status;

    // only allow 'ongoing' or 'completed' as valid statuses
    if (!['ongoing', 'completed'].includes(status)) {
        return { updated: false, message: "Invalid status provided." };
    }

    try {
        // validate in the backend as well; first check if the study itself has more than zero questions
        const currentStudy = await Study.findOne({ id: studyId });
        if (!currentStudy) return { updated: false, message: "Study not found." };

        if (status === 'ongoing' && currentStudy.questions.length === 0) {
            return {
                updated: false,
                message: "At least one question is required to publish the study."
            };
        }

        // if study is going to be published, set `publishedAt` date
        const updateFields = { status: status };
        if (status === 'ongoing') {
            updateFields.publishedAt = Date.now();
        }

        // find study, check if is not equal to 'ongoing', and update status
        const updatedStudy = await Study.findOneAndUpdate(
            { id: studyId, status: { $ne: status } },
            updateFields,
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
    if (!auth(e)) {
        setResponseStatus(e, 401)
        return { message: 'Unauthorized' }
    }
    try {
        verifyToken(e);
    } catch (err) {
        setResponseStatus(e, 401)
        return { updated: false, message: "Invalid or missing token.", error: err.message };
    }

    await connDb();

    // deconstruct the method and the url from the event request object
    const { method, url } = e.node.req;

    // check if the request is for status update (/studies/:id/publish), and chang the status to 'ongoing'
    if (method === 'PATCH' && url.endsWith('/status')) {
        const rawBody = await readBody(e)
        const body = sanitizer(rawBody)
        return await updateStudyStatus(e, body);
    }
});