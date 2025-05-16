// middleware that will run on every API request ot check that our website is the one requesting resources
export default defineEventHandler((e) => {
    const origin = getRequestHeader(e, 'origin') || '';
  
    // only share resources with our main domain
    const allowedOrigin = 'https://group3.sustainability.it.ntnu.no';
  
    if (origin === allowedOrigin) {
      setResponseHeader(e, 'Access-Control-Allow-Origin', origin);
      setResponseHeader(e, 'Access-Control-Allow-Credentials', 'true');
      setResponseHeader(e, 'Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      setResponseHeader(e, 'Access-Control-Allow-Headers', 'Content-Type,Authorization');
    }
  
    if (e.node.req.method === 'OPTIONS') {
        e.node.res.statusCode = 204;
        return '';
    }
});
  