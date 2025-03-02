import * as path from 'node:path'
import * as fsp from 'node:fs/promises'

export default defineEventHandler(async (e) => {
    const { name, email, password } = await readBody(e);

    // read file in Nuxt 3: https://stackoverflow.com/questions/76453100/how-to-read-txt-file-in-nuxt-3-in-a-folder
    const currentDir = process.cwd();
    const filePath = path.resolve(currentDir, 'database', 'dummyDb.json');
    
    try {
        const data = await fsp.readFile(filePath, 'utf-8');
        const db = JSON.parse(data);

        const newUser = { name, email, password };
        db.userCollection = db.userCollection || [];
        db.userCollection.push(newUser);
    
        await fsp.writeFile(filePath, JSON.stringify(db, null, 2), 'utf-8');
    } catch {
        console.error('Not able to add account to dummy');
    }

    // validate on the backend as well (shouldn't trust client-side checking fully)
    // check if passwords meet certain conditions
    const validatePwd = (pwd) => {
        if (pwd.length <= 8) {
        
        }
    }

    // just returning account data for now; shouldn't really return password but just testing
    return { name: name, email: email, password: password };
})