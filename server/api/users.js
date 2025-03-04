import { connDb } from "../utils/connDb.js";
import { getCookie, useRuntimeConfig } from "#imports";
import { userProf } from "../models/userCredential.js";
import { Study } from "../models/study.js";
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

    const user = await userProf.findOne({ userCredential: userId }).lean();

    //checking that the user is found
    if (user) {

      //saving user-id in variable
      const id = user._id;

      //getting the studies saved to user
      const studies = await Study.find({ user: id }).lean();


      return {user, studies}
    }

    //return { user };
  } catch {
    return { user: null, error: 401, message: "Invalid token" };
  }
});
