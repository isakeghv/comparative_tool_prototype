import { promises as fs } from 'fs';
import path from 'path';
import { Study } from '../schemas/studySchema';
import { UserCredential } from '../schemas/userSchema';
import { join } from 'path';
import jwt from "jsonwebtoken";
import { getCookie } from "#imports";

//make sure that an artifact that exists in other study cannot be deleted
const artifactIsInOtherStudy = (artifacts, artifact) => {
    const isInOtherStudy = artifacts.some(a => a === artifact)

    return isInOtherStudy;
}


export const deleteartifact = async (e, artifacts, studyId) => {

    const token = getCookie(e, "token");

    const decoded = jwt.verify(token, process.env.SECRET_JWT);

    if (!decoded) {
        setResponseStatus(e, 401)
        return { success: false }
    }

    // get the userCredential account
    const user = await UserCredential.findOne({ _id: decoded.userId }).lean();

    if (!user) {
        setResponseStatus(e, 401)
        return { success: false }
    }

    //getting the studies associated with user
    const otherStudies = await Study.find({ user: user.userProfile.toString(), id: {$ne: studyId} }).lean();

    //array containing files that should be deleted
    const deleteArr = []

    //get each source from each artifact in each question, in each study: 
    // - To use to make sure artifacts used in multiple studies are not deleted
    const allArtifacts = [...new Set(otherStudies.flatMap(s => s.questions.flatMap(q => q.artifacts.map(a => a.source))))]

    //getting the file names for each of the artifact paths provided
    artifacts.forEach(a => {
        const b = a.split('/')
        const i = b.length - 1;
        if (!artifactIsInOtherStudy(allArtifacts, a)) deleteArr.push(b[i]);
    })

    if (deleteArr.length === 0) {
        setResponseStatus(e, 200);
        return { success: true, message: 'No artifacts to delete', ok: true };
    }

    //saving path to delete files from
    const filepath = join(process.cwd(), "public", "artifacts");

    try {
        //deleting files from dir
        await Promise.allSettled(
            deleteArr.map(file => fs.unlink(path.join(filepath, file)))
        )

        //setting status and returning success message
        setResponseStatus(e, 200);
        return { success: true, deleteArr, ok: true };

        //catching error and returning err msg
    } catch (err) {
        setResponseStatus(e, 500);
        return { success: false, error: 'Unable to delete artifacts', deleteArr, ok: false }
    }
}