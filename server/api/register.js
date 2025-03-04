import bcrypt from "bcryptjs";
import { connDb } from "../utils/connDb.js";
import { userCredential } from '../models/userCredential.js';
import { userProfile } from '../models/userProfile.js';

const checkEmail = async (email) => {
	const existingUser = await userCredential.findOne({ email });

	if (existingUser) {
		// setting response to 200 to confirm that email was found
		setResponseStatus(200);
		return { created: false, message: "User with this email already exists." };
	}

	return null;
}

const createUser = async (fname, lname, email, pwd) => {
	//hashing password so that it is secure. "12" is for the salt rounds it will do: 12-14= safer
	const hashedPassword = await bcrypt.hash(pwd, 12);

	// create new user credentials using its schema
	const newUserC = new userCredential({
		email: email,
		password: hashedPassword,
	});

	// split the user credentials and profile data from each other
	const newUserP = new userProfile({
		firstName: fname,
		lastName: lname,
		userCredential: newUserC._id
	})

	try {
		// both operations have to succeed together
		await Promise.all([
			newUserC.save(),
			newUserP.save()
		]);

		setResponseStatus(201);
		
		//return status and message that account has been created
		return { created: true, message: "Account successfully created." };
	} catch (err) {
		console.log(err);
		setResponseStatus(500);

		//return false status and message that there was issue creating the account
		return { created: false, message: "Issue occured while creating account." };
	}
}

export default defineEventHandler(async (e) => {
	// connect to db
	await connDb();
	const body = await readBody(e);
	const { firstname, lastname, email, password } = body;

	// if checkEmail returns a value, return and don't continue executing the rest of the code
	const emailExist = await checkEmail(email);
	
	if (emailExist) {		
		return emailExist;
	}	

	return await createUser(firstname, lastname, email, password);
});
