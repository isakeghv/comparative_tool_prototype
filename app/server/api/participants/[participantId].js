import { connDb } from '~/server/services/connDb.js';
import { verifyToken } from '~/server/services/jwt.js';
import { Participant } from "../../schemas/participantSchema";

const updateParticipant = async (e, data) => {
    const participantId = e.context.params?.participantId;

    if (!participantId) {
        return { updated: false, message: "Participant ID is missing or invalid." };
    }

    console.log(JSON.stringify(data.questions, null, 2));

    try {
        // find session by id, and update with the answers
        const session = await Participant.findById(participantId);

        if (!session) {
            setResponseStatus(404);
            return { updated: false, message: 'Participant not found' };
        }

        session.questions = data.questions;
        session.demographic = data.demographic;
        session.status = 'completed';

        // cannot use 'findByIdAndUpdate' due to relying on a pre-hook to save `timeTaken` field
        await session.save(); 
 
        console.log(session);
        setResponseStatus(200);
        return { updated: true, message: 'Participant session updated successfully.', result: session.toJSON() };
    } catch (err) {
        return { updated: false, message: 'Issue occurred while updating participant session.', error: err.message };
    }
}

export default defineEventHandler(async (e) => {
    verifyToken(e);
    await connDb();

    const { method } = e.node.req;

    if (method === 'PUT') {
        const body = await readBody(e);
        return await updateParticipant(e, body);
    }
});