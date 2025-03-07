import { connDb } from "../utils/connDb.js";
import { getCookie, useRuntimeConfig } from "#imports";
import { userCredential, userProfile } from "../models/user.js";
import { study } from "../models/study.js";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (e) => {
	const token = getCookie(e, "token");

	//if token is not present, return and provide error code
	if (!token) return { user: null, error: 401, message: "Unauthorized" };

	await connDb();

	const config = useRuntimeConfig();

	try {
		const decoded = jwt.verify(token, config.private.secretJWT);
		const userId = decoded.userId;
		// get the userCredential account
		const user = await userCredential.findOne({ _id: userId }).lean();

	//checking that the user is found
	if (user) {
		// convert to ObjectId to str, and save userProfile id in variable
		const userProfileId = user.userProfile.toString();
		const userProfileData = await userProfile.findOne({ _id: userProfileId }).lean();

		//getting the studies associated with user
		const studies = await study.find({ user: userProfileId }).lean();

		// return userProfileId and the studies connected to it
		return {userProfileData, studies}
	}

	//return { user };
	} catch (err) {
		return { user: null, error: 401, message: "Invalid token" };
	}
});
