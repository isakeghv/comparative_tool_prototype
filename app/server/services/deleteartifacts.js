import { promises as fs } from 'fs';
import path from 'path';
import { join } from 'path';


export const deleteartifact = async (e, artifacts) => {

    //array containing files that should be deleted
    const deleteArr = []

    //getting the file names for each of the artifact paths provided
    artifacts.forEach(a => {
        const b = a.split('/')
        const i = b.length - 1;
        deleteArr.push(b[i]);
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