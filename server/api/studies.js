import { connDb } from "../services/connDb.js";
import { verifyToken } from '../utils/jwt.js';
import { Study } from '../schemas/studySchema.js';

// get study by its id, and populate the study with the retrieved data
const getStudy = async (e) => {
	// get studyId from the parameter in the URL
	const studyId = e.context.params?.studyId;

	// find study in databaaaaase
	const study = study.findOne({ _id: studyId });

    try {
		setResponseStatus(200);
		return { found: true, message: "..." };
    } catch (err) {
		return { found: false, message: "...", error: err.message };
    }
}

const newStudy = async (data) => {
	// deconstruct the data from body; `customTerms` fields need to be deconstructed again as it is nested
	const { id, user, title, description, demographicReq, demographic, questions,  customTerms: { request, terms } } = data;

	// only need to initialize study with the _id of `userProfile` to keep a reference of the creator and content; the rest of the fields comes with the `study` reactive variable
	// don't need to do field: value if they have the same name
    const createdStudy = new Study({
        id,
        user,
        title,
        description,
		demographicReq,
        demographic,
        questions,
        customTerms: {
            request, terms
        }
    });
	
    try {
		// create study and save it in the database
		await createdStudy.save();
		setResponseStatus(201);		
		return { created: true, message: "Study successfully created.", study: createdStudy };
    } catch (err) {
		console.log(err);
		return { created: false, message: "Issue occured while creating study.", error: err.message };
    }
}

// should make the parameters optional?
const updateStudy = async(data) => {
	// deconstruct to seperate id from the other data that will be updated
	const { id, ...updateFields } = data;

	try {
		// find one with matching study id, update it, and return the updated version of the study
		const study = await Study.findOneAndUpdate({ id: id }, updateFields, { new: true });
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
	const body = await readBody(e);

	if (e.node.req.method === 'GET') {
		const { title } = body;
		return await getStudy(title);
	}

	// read body, deconstruct data from the POST request, and create a new 'study' instance (currently with minimal fields to check)
	if (e.node.req.method === 'POST') {
		return await newStudy(body);
	}

	// update the study
	if (e.node.req.method === 'PUT') {	
		return await updateStudy(body);	}
});