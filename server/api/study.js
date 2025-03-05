import { connDb } from "../utils/connDb.js";
import { verifyToken } from '../utils/jwt.js';
import { study, question } from '../models/study.js';

const newStudy = async (userId) => {
	// only need to initialize study with the _id of userProfile to keep a reference of the creator and content; the rest of the fields are default / will get updated later
	const createdStudy = new study({
		user: userId
	})
	
    try {
		// create study
		await createdStudy.save();
		setResponseStatus(201);		
		return { created: true, message: "Study successfully created." };
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

	// read body, deconstruct data from the POST request, and create a new 'study' instance
	if (e.node.req.method === 'POST') {
		const { userId } = body;
		return await newStudy(userId);
	}

	// patch to update the existing study resource
	if (e.node.req.method === 'PATCH') {
		const { updateData } = body;

		// ...
		return await newStudy(userId, updateData);
	}
});