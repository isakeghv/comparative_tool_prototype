import { connDb } from '../services/connDb.js';
import { getCookie, useRuntimeConfig } from "#imports";
import { UserCredential, UserProfile } from "../schemas/userSchema.js";
import { Study } from "../schemas/studySchema.js";
import jwt from "jsonwebtoken";
import { sanitizer } from '../utils/sanitize.js';

export default defineEventHandler(async (e) => {
	const token = getCookie(e, "token");

	//if token is not present, return and provide error code
	if (!token) return { user: null, error: 401, message: "Unauthorized" };

	await connDb();

	const config = useRuntimeConfig();

	try {
		const decoded = jwt.verify(token, process.env.SECRET_JWT);
		const rawID = decoded.userId;

		const userId = sanitizer(rawID);
		// get the userCredential account
		const user = await UserCredential.findOne({ _id: userId }).lean();

	//checking that the user is found
	if (user) {
		// convert to ObjectId to str, and save userProfile id in variable
		const userProfileId = user.userProfile.toString();
		const userProfileData = await UserProfile.findOne({ _id: userProfileId }).lean();

		//getting the studies associated with user
		const studies = await Study.find({ user: userProfileId }).lean();

		// return userProfileId and the studies connected to it
		return {userProfileData, studies}
	}

	//return { user };
	} catch (err) {
		return { user: null, error: 401, message: "Invalid token" };
	}
});
