import bcrypt from "bcryptjs";
import validator from "validator";
import { readBody, setResponseStatus } from "h3";
import { useRuntimeConfig } from '#imports';
import { connDb } from '~/server/services/connDb.js';
import { UserCredential, UserProfile } from '../schemas/userSchema.js';
import { checkRateLimit } from '../services/rateLimiter.js';

const config = useRuntimeConfig();

const checkEmail = async (email) => {
	const existingUser = await UserCredential.findOne({ email });

	if (existingUser) {
		// setting response to 200 to confirm that email was found
		setResponseStatus(e, 200);
		return { created: false, message: "User with this email already exists." };
	}

	return null;
}

const createUser = async (fname, lname, email, pwd, e) => {
	//hashing password so that it is secure. "12" is for the salt rounds it will do: 12-14= safer
	const hashedPassword = await bcrypt.hash(pwd, 12);

	// split the user credentials and profile data from each other
	const newUserP = new UserProfile({
		firstName: fname,
		lastName: lname,
	})

	// create new user credentials using its schema
	const newUserC = new UserCredential({
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

		setResponseStatus(e, 201);
		
		//return status and message that account has been created
		return { created: true, message: "Account successfully created." };
	} catch (err) {
		console.log(err);
		setResponseStatus(e, 500);

		//return false status and message that there was issue creating the account
		return { created: false, message: "Issue occured while creating account." };
	}
}

export default defineEventHandler(async (e) => {
	// connect to db
	await connDb();
	const body = await readBody(e);
	const { firstname, lastname, email, password, turnstileToken } = body;

	console.log(password);
	// const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

	// // RateLimiter
	// const ip = getRequestHeader(e, 'x-forwarded-for') || e.node.req.socket.remoteAddress;
	// const { allowed, retryAfter } = await checkRateLimit(ip, '/api/register');
	// if (!allowed) {
 	// 	setResponseStatus(e, 429);
	// 	return {
	// 		created: false,
	// 		message: `Too many registration attempts. Try again in ${Math.ceil(retryAfter / 60000)} minutes.`
	// 	};
	// }
	
	// // Verify Turnstile token
	// const captchaRes = await $fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
	// 	method: 'POST',
	// 	body: new URLSearchParams({
	// 		secret: TURNSTILE_SECRET_KEY,
	// 		response: turnstileToken
	// 		})
	// 	});

	// if (!captchaRes.success) {
	// 	setResponseStatus(e, 403);
	// 	return { created: false, message: 'CAPTCHA verification failed.' };
	// }

	//validation
	if (!firstname || !lastname || !email || !password) {
		setResponseStatus(e, 400)
		return { created: false, message: "All fields are required."}
	}
	// Email validation
	if (!validator.isEmail(email)){
		setResponseStatus(e, 400)
		return {created: false, message: "Invalid email format."}
	}

	// Password validation must meet criteria
	// it seems to always trigger even if pwd is correct
	// if (!validator.isStrongPassword(password, {
	// 	minLength: 8,
	// 	minUppercase: 1,
	// 	minNumbers: 1
	// })) {
	// 	setResponseStatus(e, 400)
	// 	return { created:false, message: "Password must be at least 8 characters long and include, uppercase letter and a number."}
	// }

	//Sanitize
	const cleanFirstName = validator.escape(firstname.trim());
	const cleanLastName = validator.escape(lastname.trim());
	const cleanEmail = validator.normalizeEmail(email);
	const cleanPassword = password.trim();

	// if checkEmail returns a value, return and don't continue executing the rest of the code
	const emailExist = await checkEmail(cleanEmail, e);
	
	if (emailExist) {		
		return emailExist;
	}	

	return await createUser(cleanFirstName, cleanLastName, cleanEmail, cleanPassword, e);
});
