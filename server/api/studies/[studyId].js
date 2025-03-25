import { connDb } from "../../services/connDb.js";
import { verifyToken } from '../../utils/jwt.js';
import { Study } from '../../schemas/studySchema.js';

// get study by its id, and populate the study with the retrieved data
const getStudy = async (e) => {
    // get studyId from the parameter in the URL
    const studyId = e.context.params?.studyId;

    // find study in databaaaaase
    const study = await Study.findOne({ id: studyId });

    try {
        setResponseStatus(200);
        return { found: true, message: "Study found...", study };
    } catch (err) {
        return { found: false, message: "...", error: err.message };
    }
}

// should make the parameters optional?
const updateStudy = async(e, data) => {
    // deconstruct to seperate id from the other data that will be updated
    const studyId = e.context.params?.studyId;
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

const deleteStudy = async (e) => {
    const studyId = e.context.params?.studyId;

    // use one of MongoDB's CRUD function to delete a study by its id
    const study = await Study.findOneAndDelete({ id: studyId });

    try {
        setResponseStatus(200);
        return { found: true, message: "Study deleted successfully." };
    } catch (err) {
        return { found: false, message: "...", error: err.message };
    }
}

const publishStudy = async (e) => {
    const studyId = e.context.params?.studyId;

    try {
        // update status to ongoing
        const study = await Study.findOneAndUpdate({ id: studyId }, { status: 'ongoing' }, { new: true });
        return { updated: true, message: "Study successfully published.", study};
    } catch (err) {
        console.log(err);
        return { updated: false, message: "Issue occured while publishing study.", error: err.message };
    }
}

const closeStudy = async (e) => {
    const studyId = e.context.params?.studyId;

    try {
        const study = await Study.findOneAndUpdate({ id: studyId }, { status: 'closed' }, { new: true });
        return { updated: true, message: "Study successfully updated.", study};
    } catch (err) {
        return { updated: false, message: "Issue occured while updating study.", error: err.message };
    }
}

export default defineEventHandler(async (e) => {
    verifyToken(e);
    await connDb();

    // deconstruct the method and the url from the event request object
    const { method, url } = e.node.req;

    // check if the request is for status update (/studies/:id/publish), and chang the status to 'ongoing'
    if (method === 'PATCH') {
        //  && url.endsWith('/publish')
        return await publishStudy(e);
    }

    // update the status to close
    if (method === 'PATCH' && url.endsWith('/close')) {
        return await closeStudy(e);
    }

    if (method === 'GET') {
        // only need to pass in path param (id)
        return await getStudy(e);
    }

    if (method === 'PUT') {
        const body = await readBody(e);
        return await updateStudy(e, body);
    }

    if (method === 'DELETE') {
        return await deleteStudy(e);
    }
});