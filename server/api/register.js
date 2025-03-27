import bcrypt from "bcryptjs";
import { connDb } from "../utils/connDb.js";
import { userCredential, userProfile } from '../models/user.js';
import validator from "validator";
import { readBody, setResponseStatus } from "h3";


const checkEmail = async (email, event) => {
	const existingUser = await userCredential.findOne({ email });

	if (existingUser) {
		// setting response to 200 to confirm that email was found
		setResponseStatus(event, 200);
		return { created: false, message: "User with this email already exists." };
	}

	return null;
}

const createUser = async (fname, lname, email, pwd) => {
	//hashing password so that it is secure. "12" is for the salt rounds it will do: 12-14= safer
	const hashedPassword = await bcrypt.hash(pwd, 12);

	// split the user credentials and profile data from each other
	const newUserP = new userProfile({
		firstName: fname,
		lastName: lname,
	})

	// create new user credentials using its schema
	const newUserC = new userCredential({
		email: email,
		password: hashedPassword,
		userProfile: newUserP._id
	});

	try {
		// both operations have to succeed together
		await Promise.all([
			newUserC.save(),
			newUserP.save()
		]);

		setResponseStatus(event, 201);
		
		//return status and message that account has been created
		return { created: true, message: "Account successfully created." };
	} catch (err) {
		console.log(err);
		setResponseStatus(event, 500);

		//return false status and message that there was issue creating the account
		return { created: false, message: "Issue occured while creating account." };
	}
}

export default defineEventHandler(async (event) => {
	// connect to db
	await connDb();
	const body = await readBody(event);
	const { firstname, lastname, email, password } = body;

	//validation
	if (!firstname || !lastname || !email || !password) {
		setResponseStatus(event, 400)
		return { created: false, message: "All fields are required"}
	}
	// Email validation
	if (!validator.isEmail(email)){
		setResponseStatus(event, 400)
		return {created: false, message: "Invalid email format"}
	}
	// Password validation must meet criteria
	if (!validator.isStrongPassword(password, {
		minLength: 8,
		minUppercase: 1,
		minNumbers: 1
	})) {
		setResponseStatus(event, 400)
		return { created:false, message: "Password must be at least 8 characters long and include, uppercase letter and a number"}
	}


	//Sanitize
	const cleanFirstName = validator.escape(firstname.trim());
	const cleanLastName = validator.escape(lastname.trim());
	const cleanEmail = validator.normalizeEmail(email);
	const cleanPassword = password.trim();

	// if checkEmail returns a value, return and don't continue executing the rest of the code
	const emailExist = await checkEmail(cleanEmail, event);
	
	if (emailExist) {		
		return emailExist;
	}	

	return await createUser(cleanFirstName, cleanLastName, cleanEmail, cleanPassword, event);
});
