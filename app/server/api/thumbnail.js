import { Study } from '../schemas/studySchema';
import { auth } from '../services/authenticated';

//function is setting which uploaded file should be set as thumbnail for study
export default defineEventHandler(async (e) => {

    //return if not auth
    if (!auth(e)) {
        setResponseStatus(e, 401);
        return { success: false }
    }

    const { artifact, studyID } = await readBody(e);

    //return if invalid
    if (!artifact || !studyID) {
        setResponseStatus(e, 400)
        return { success: false };
    }

    //updating in db
    const update = await Study.updateOne({ id: studyID }, { $set: { thumbnail: artifact } }, { upsert: true })

    //return if error
    if (update.modifiedCount === 0 && update.upsertedCount === 0) {
        setResponseStatus(e, 400);
        return { success: false };
    }

    //return ok if success
    setResponseStatus(e, 201);
    return { success: true }
})