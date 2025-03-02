export default defineEventHandler(async (e) => {
    const { name, email, password, status } = await readBody(e);

    if (status == 'success') {
        console.log('success')
        return { status: status };
    } else if (status == 'error') {
        console.log('error')
        return { status: status };
    }
})