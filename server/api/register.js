export default defineEventHandler(async (e) => {
    const { name, email, password } = await readBody(e);

    // just returning account data for now; shouldn't really return password but just testing
    return { name: name, email: email, password: password };
})