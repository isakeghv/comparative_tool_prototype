import { connDb } from "../services/connDb.js";
import { verifyToken } from '../services/jwt.js';
import { study } from '../schemas/studySchema.js';

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

const newStudy = async (id, userRef, title, desc, demographicArr, demographicReq) => {
	// only need to initialize study with the _id of userProfile to keep a reference of the creator and content; the rest of the fields are default / will get updated later
	const createdStudy = new study({
		id: id,
		user: userRef,
		title: title,
		description: desc,
		demographic: demographicArr,
		demographicReq: demographicReq
	})
	
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
const updateStudy = async(id, data) => {
	// const updateData = { title: 'idk'};
	const studyRecord = ''

	try {
		// find one with matching study id, update it, and return the updated version of the study
		const updatedStudy = await study.findOneAndUpdate({ id: id }, data, { new: true });
		// setResonseStatus here
		return { updated: true, message: "Study successfully updated." };
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
		const { id, user, title, description, demographic, demographicReq } = body;
		return await newStudy(id, user, title, description, demographic, demographicReq);
	}

	// update the study
	if (e.node.req.method === 'PUT') {
		const { id, updatedData } = body;
			
		return await updateStudy(id, updatedData);
	}
});