import { connDb } from '~/server/services/connDb.js';
import { verifyToken } from '~/server/services/jwt.js';
import { Study } from '../../schemas/studySchema.js';
import { sanitizer } from '~/server/utils/sanitize.js';

const newStudy = async (body, e) => {

  const data = sanitizer(body);

	// deconstruct the data from body; `customTerms` fields need to be deconstructed again as it is nested
	const { id, user, title, description, demographicReq, demographic, questions, customTerms: { request, terms }, currentReplies, closingMethod, closingLimit: { date, duration, responses }, desiredResponses } = data;


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
            request,
            terms
        },
        currentReplies,
        closingMethod,
        closingLimit: {
            date,
            duration,
            responses
        },
        desiredResponses
    });

	
    try {
      // create study and save it in the database
      await createdStudy.save();

      

      setResponseStatus(e, 201);		

      return { created: true, message: "Study successfully created.", study: createdStudy };
    } catch (err) {
      console.log(err);
      return { created: false, message: "Issue occured while creating study.", error: err.message };
    }
}

export default defineEventHandler(async (e) => {
	verifyToken(e);
	await connDb();

	// read body, deconstruct data from the POST request, and create a new 'study' instance (currently with minimal fields to check)
	if (e.node.req.method === 'POST') {
		const body = await readBody(e);
		return await newStudy(body, e);
	}
});