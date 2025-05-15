import { promises as fs } from 'fs'
import path from 'path';
import { Study } from '../schemas/studySchema';
import { join } from 'path'
import { auth } from '../services/authenticated'
import { sanitizer } from '../utils/sanitize';

//make sure that an artifact that exists in other study cannot be deleted
const artifactIsInOtherStudy = (artifacts, artifact) => {
    const isInOtherStudy = artifacts.some(a => a === artifact);

    return isInOtherStudy;
}

export default defineEventHandler(async (e) => {

    if (!auth(e)) {
        setResponseStatus(e, 401);
        return { success: false, code: 401, message: 'Not logged in' };
    }

    const rawBody = await readBody(e)

    const body = sanitizer(rawBody);

    const { artifacts, userID, studyID } = body;

    const otherStudies = await Study.find({ user: userID, id: {$ne: studyID} }).lean();

    //array containing files that should be deleted
    const deleteArr = []

    const allArtifacts = [...new Set(otherStudies.flatMap(s => s.questions.flatMap(q => q.artifacts.map(a => a.source))))]

    //getting the file names for each of the artifact paths provided
    artifacts.forEach(a => {
        const b = a.split('/')
        const i = b.length - 1;
        if (!artifactIsInOtherStudy(allArtifacts, a)) deleteArr.push(b[i]);
    })

    if (deleteArr.length === 0) {
        setResponseStatus(e, 200);
        return { success: true, message: 'No artifacts to delete' };
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
        return { success: true, deleteArr };

        //catching error and returning err msg
    } catch (err) {
        setResponseStatus(e, 500);
        return { success: false, error: 'Unable to delete artifacts', deleteArr }
    }
})