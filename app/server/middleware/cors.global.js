// middleware that will run on every API request ot check that our website is the one requesting resources
export default defineEventHandler((event) => {
    const origin = getRequestHeader(event, 'origin') || '';
    const allowedOrigin = 'https://group3.sustainability.it.ntnu.no';
  
    if (origin === allowedOrigin) {
        setResponseHeader(event, 'Access-Control-Allow-Origin', origin);
        setResponseHeader(event, 'Access-Control-Allow-Credentials', 'true');
        setResponseHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        setResponseHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization');
    } else if (origin) {
        // reject with forbidden if not allowed
        event.node.res.statusCode = 403;
        event.node.res.end(JSON.stringify({ error: 'CORS: Origin not allowed' }));
        return;
    }
  
    // Handle preflight
    if (event.node.req.method === 'OPTIONS') {
        event.node.res.statusCode = 204;
        event.node.res.end();
        return;
    }
});
  