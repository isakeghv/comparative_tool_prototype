import { connDb } from '~/server/services/connDb.js';
import { verifyToken } from '~/server/services/jwt.js';
import { Study } from '../../../schemas/studySchema.js';

// get study by its id, and populate the study with the retrieved data
const getStudy = async (e) => {
    // get studyId from the parameter in the URL
    const studyId = e.context.params?.studyId;

    try {
        // find specific study, and use projection to specify which fields should be included
        const study = await Study.findOne(
        { id: studyId },
        {
            _id: 0,
            id: 1,
            title: 1,
            description: 1,
            customTerms: 1,
            status: 1,
            questions: 1,
            demographicReq: 1,
            demographic: 1,
        }
        ).lean();

        // add future calculations based on closing methods later
        const isOpen = study.status === 'ongoing';
        
        setResponseStatus(201);
        return { found: true, message: "Study found successfully.", study, isOpen };
    } catch (err) {
        return { found: false, message: "Issue occured while fetching study.", error: err.message };
    }
}

// should make the parameters optional?
const updateStudy = async(e, data) => {
    // deconstruct to seperate id from the other data that will be updated
    const studyId = e.context.params?.studyId;
    const { id, ...updateFields } = data;
    
    try {
        // update last modified date
        updateFields.lastEdited = new Date();

        // find one with matching study id, update it, and return the updated version of the study
        // require to run the validators again (iin case 'title' has been removed)
        const study = await Study.findOneAndUpdate(
            { id: studyId },
            updateFields,
            { runValidators: true, new: true });

        setResponseStatus(200);
        return { updated: true, message: "Study updated successfully.", study};
    } catch (err) {
        console.log(err);
        return { updated: false, message: "Issue occured while updating study.", error: err.message };
    }
}

const deleteStudy = async (e) => {
    const studyId = e.context.params?.studyId;

    // use one of MongoDB's CRUD functions to delete a study by its id
    await Study.findOneAndDelete({ id: studyId });

    try {
        setResponseStatus(204);
        return { found: true, message: "Study deleted successfully." };
    } catch (err) {
        return { found: false, message: "Issue occured while deleting study.", error: err.message };
    }
}

export default defineEventHandler(async (e) => {
    verifyToken(e);
    await connDb();

    // deconstruct the method and the url from the event request object
    const { method } = e.node.req;

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