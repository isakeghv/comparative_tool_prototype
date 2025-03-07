import { connDb } from "../utils/connDb.js";
import { verifyToken } from '../utils/jwt.js';
import { study, question } from '../models/study.js';

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

const newStudy = async (userId) => {
	// only need to initialize study with the _id of userProfile to keep a reference of the creator and content; the rest of the fields are default / will get updated later
	const createdStudy = new study({
		user: userId
	})
	
    try {
		// create study
		await createdStudy.save();
		setResponseStatus(201);		

		// send the newly created study id to make it possible to use it as an endpoint
		return { created: true, studyId: createdStudy._id, message: "Study successfully created." };
    } catch (err) {
		return { created: false, message: "Issue occured while creating study.", error: err.message };
    }
}

const updateStudy = async(studyId, data) => {
	// const updateData = { title: 'idk'};
	const studyRecord = ''

	// find by study id, update it, and return the updated version of the study
	const updatedStudy = await study.findByIdAndUpdate(studyId, data, { new: true });
}

export default defineEventHandler(async (e) => {
	verifyToken(e);
	await connDb();
	const body = await readBody(e);

	if (e.node.req.method === 'GET') {
		const { title } = body;
		return await getStudy(title);
	}

	// read body, deconstruct data from the POST request, and create a new 'study' instance
	if (e.node.req.method === 'POST') {
		const { userId } = body;
		return await newStudy(userId);
	}

	// update the study
	if (e.node.req.method === 'PUT') {
		const { updateData } = body;

		// ...
		return await newStudy(userId, updateData);
	}
});