import { connDb } from "../../services/connDb.js";
import { verifyToken } from '../../utils/jwt.js';
import { Study } from '../../schemas/studySchema.js';

// get study by its id, and populate the study with the retrieved data
const getStudy = async (e) => {
    // get studyId from the parameter in the URL
    const studyId = e.context.params?.studyId;

    // find study in databaaaaase
    const study = Study.findOne({ _id: studyId });

    try {
        setResponseStatus(200);
        return { found: true, message: "Study found..." };
    } catch (err) {
        return { found: false, message: "...", error: err.message };
    }
}

// should make the parameters optional?
const updateStudy = async(e, data) => {
    // deconstruct to seperate id from the other data that will be updated
    const studyId = e.context.params?.studyId;
    console.log(studyId);
    const { id, ...updateFields } = data;

    try {
        // find one with matching study id, update it, and return the updated version of the study
        const study = await Study.findOneAndUpdate({ id: studyId }, updateFields, { new: true });
        // setResonseStatus here
        return { updated: true, message: "Study successfully updated.", study};
    } catch (err) {
        console.log(err);
        return { updated: false, message: "Issue occured while updating study.", error: err.message };
    }
}

export default defineEventHandler(async (e) => {
    verifyToken(e);
    await connDb();

    if (e.node.req.method === 'GET') {
        // only need to pass in path param (id)
        return await getStudy(e);
    }

    // update the study
    if (e.node.req.method === 'PUT') {
        const body = await readBody(e);
        return await updateStudy(e, body);
    }
});