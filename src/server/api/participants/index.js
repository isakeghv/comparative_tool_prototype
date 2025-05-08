import { connDb } from '~/server/services/connDb.js';
import { verifyToken } from '~/server/services/jwt.js';
import { Participant } from "../../schemas/participantSchema";

const createParticipant = async (studyId) => {
    try {
        const session = new Participant({
            study: studyId,
        });
        
        await session.save();
 
        setResponseStatus(201);
        return { found: true, message: 'Participant session created successfully.', id: session._id };
    } catch (err) {
        return { found: false, message: 'Issue occurred while creating participant session.', error: err.message };
    }
}

export default defineEventHandler(async (e) => {
    verifyToken(e);
    await connDb();

    // deconstruct the method and the url from the event request object
    const { method } = e.node.req;

    if (method === 'POST') {
        const { study } = await readBody(e);
        return await createParticipant(study);
    }
});