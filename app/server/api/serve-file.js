import { readFile } from 'fs/promises';
import { join } from 'path';
import mime from 'mime-types';

export default defineEventHandler(async (e) => {
    const query = getQuery(e)
    const file = query.filename

    if (!file) {
        setResponseStatus(e, 400)
        return { found: false, url: null, ok: false }
    }

    const filePath = join(process.cwd(), 'public', ...file.split('/'));
    const filetype = mime.lookup(filePath) || 'application/octet-stream';

    try {
        
        const file = await readFile(filePath);
        setHeader(e, 'Content-Type', filetype)
        return file;

    } catch (err) {
        console.log(err)
        setResponseStatus(e, 404)
        return { found: false, url: null, ok: false }
    }
})