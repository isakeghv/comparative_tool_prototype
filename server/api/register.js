import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { firstname, lastname, email, password } = body;

  //replace with connecting to database later
  const dbPath = path.join(process.cwd(), "database", "dummyDb.json");

  //replace with database reading contents of relevant table of later
  const rawData = fs.existsSync(dbPath)
    ? fs.readFileSync(dbPath, "utf-8")
    : '{"users":[]}';

  //collect data to dynamic variable
  const data = JSON.parse(rawData);
  const emails = data.emailCollection;

  //checking if email is already in use. If in use, returns "false" so front-end informs user.
  if (emails.includes(email))
    return { created: false, message: "Email already in use" };

  //creating unique user-id. using timestamp in ms + first letter of name and lastname = will always
  // be unique as the same time will never appear twice
  const letterId = `${firstname.split("")[0]}${lastname.split("")[0]}`;
  const userId = `${letterId}${JSON.stringify(Date.now())}`;

  //hashing password so that it is secure. "12" is for the salt rounds it will do: 12-14= safer
  const hashedPassword = await bcrypt.hash(password, 12);

  //Setting new user-email to include in email-array (email-array is used only to check if email is already in use)
  const newEmail = email;

  //used to check credentials, and get id of user if credentials are correct
  const newCredentials = { id: userId, email, password: hashedPassword };

  //used to store user information and id of user.
  // should only be accessible to the one specific user when in their dashboard, and nowhere else
  const newUser = { userId:{ id: userId, firstname, lastname, email, password: hashedPassword } };

  try {
    const file = fs.openSync(dbPath, "r+");

    //inserting content to dynamic variable
    data.emailCollection.push(newEmail);
    data.credentialsCollection.push(newCredentials);
    data.userCollection[userId] = newUser;

    //removing old content now while using temp json file instead of mongodb. 
    //with json files, new content has to be inserted in full, not only new content. 
    // Therefore, clearing before inserting content to file
    fs.ftruncateSync(file, 0);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    fs.closeSync(file);

    //return status and message that account has been created
    return { created: true, message: "Account successfully created" };

  } catch (error) {
    //return false status and message that there was issue creating the account
    return { created: false, message: "Issue occured while creating account." };
  }
});
