export default defineEventHandler(async (e) => {
    const { email, password } = await readBody(e);
    return '...';
  })