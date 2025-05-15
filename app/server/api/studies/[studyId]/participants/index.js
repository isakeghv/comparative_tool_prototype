
import { connDb } from '~/server/services/connDb.js';
import { verifyToken } from '~/server/services/jwt.js';
import { Participant } from '~/server/schemas/participantSchema';
import { sanitizer } from '../../../../utils/sanitize';

const getResponsesByStudyId = async (e) => {
    const rawID = e.context.params?.studyId;

    const studyId = sanitizer(rawID)
    try {
        // find all participants that answered the study in anscending order, and exclude uneccessary fields
        const participants = await Participant.find(
            { study: studyId },
            {
                _id: 0,
                study: 0,
                _v: 0
            }
        ).sort({ startTime: 1 }).lean();

        setResponseStatus(e, 200);
        return participants;
    } catch (err) {
        throw new Error('Error fetching participants');
    }
}

// add filtering for partial / completed responses idk
export default defineEventHandler(async (e) => {
    verifyToken(e);
    await connDb();

    // deconstruct the method and the url from the event request object
    const { method } = e.node.req;

    if (method === 'GET') {
        return await getResponsesByStudyId(e);
    }
});