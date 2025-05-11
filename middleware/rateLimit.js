//modified path so it is functional and works with db
import { checkRateLimit } from '~/server/services/rateLimiter';

export default defineEventHandler(async (event) => {
  const ip = getRequestHeader(event, 'x-forwarded-for') || event.node.req.socket.remoteAddress;
  const endpoint = event.path;

  if (endpoint === '/api/login' || endpoint === '/api/register') {
    const { allowed, retryAfter } = await checkRateLimit(ip, endpoint);

    if (!allowed) {
      setResponseStatus(event, 429);
      return { message: `Too many attempts. Try again in ${Math.ceil(retryAfter / 1000 / 60)} minutes.` };
    }
  }
});