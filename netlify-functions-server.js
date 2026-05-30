import http from 'http';
import { handler as scrapeHandler } from './netlify/functions/scrape-businesses.js';
import { handler as trackLeadHandler } from './netlify/functions/track-lead.js';

const PORT = Number(process.env.FUNCTIONS_PORT || 8888);

const parseRequestBody = (req) => new Promise((resolve, reject) => {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => resolve(body));
  req.on('error', reject);
});

const createEvent = async (req, url) => {
  const body = await parseRequestBody(req);
  return {
    path: url.pathname,
    httpMethod: req.method,
    headers: req.headers,
    queryStringParameters: Object.fromEntries(url.searchParams.entries()),
    body: body || null,
    rawQuery: url.search,
  };
};

const sendResponse = (res, result) => {
  const headers = result.headers || {};
  res.writeHead(result.statusCode || 200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    ...headers,
  });
  res.end(result.body || JSON.stringify({}));
};

const handlers = {
  '/.netlify/functions/scrape-businesses': scrapeHandler,
  '/.netlify/functions/track-lead': trackLeadHandler,
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    });
    return res.end();
  }

  const handler = handlers[url.pathname];
  if (!handler) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Function not found' }));
  }

  try {
    const event = await createEvent(req, url);
    const result = await handler(event);
    sendResponse(res, result);
  } catch (err) {
    console.error('Function server error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message || 'Internal function server error' }));
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Local function server failed to start: port ${PORT} is already in use.`,
      'Stop any existing function server or set FUNCTIONS_PORT to a free port before running npm run dev.'
    );
    process.exit(1);
  }

  console.error('Local function server error:', err);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`Local function server running at http://localhost:${PORT}`);
});
