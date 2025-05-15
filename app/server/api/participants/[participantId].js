import { connDb } from '~/server/services/connDb.js';
import { verifyToken } from '~/server/services/jwt.js';
import { Participant } from "../../schemas/participantSchema";
import { sanitizer } from '../../utils/sanitize'

const updateParticipant = async (e, data) => {
    const participantId = e.context.params?.participantId;

    if (!participantId) {
        return { updated: false, message: "Participant ID is missing or invalid." };
    }

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

        setResponseStatus(e, 200);
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
        const rawBody = await readBody(e);
        const body = sanitizer(rawBody)
        return await updateParticipant(e, body);
    }
});