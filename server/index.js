const http = require('http');
const { URL } = require('url');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

loadEnvFile();

const PORT = process.env.API_PORT || 8788;
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || '*';
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_RANGE = process.env.GOOGLE_SHEET_RANGE || 'Sheet1!A:H';
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
const SOURCE_TAG = process.env.SOURCE_TAG || 'doncaster-gaming-event';

if (!SHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
  console.error(
    'Missing Google Sheets configuration. Please set GOOGLE_SHEET_ID, GOOGLE_CLIENT_EMAIL, and GOOGLE_PRIVATE_KEY.'
  );
  process.exit(1);
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '', `http://${req.headers.host}`);

  if (req.method === 'POST' && url.pathname === '/api/register') {
    try {
      const payload = await readJson(req);
      validatePayload(payload);

      const accessToken = await getAccessToken();
      await appendToSheet(accessToken, payload);

      sendJson(res, 200, { ok: true });
    } catch (error) {
      console.error('Submission failed:', error);
      sendJson(res, error.statusCode || 500, {
        ok: false,
        message: error.publicMessage || 'Could not submit registration. Please try again later.',
      });
    }
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(res, 200, { status: 'ok' });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Registration API listening on http://localhost:${PORT}`);
});

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function loadEnvFile() {
  const candidates = ['.env.local', '.env'];

  for (const file of candidates) {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) continue;

    const lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      if (process.env[key]) continue;
      const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = value;
    }
    break;
  }
}

async function readJson(req) {
  const body = await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(createError(413, 'Payload too large'));
      }
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });

  try {
    return JSON.parse(body || '{}');
  } catch {
    throw createError(400, 'Invalid JSON payload');
  }
}

function validatePayload(payload) {
  if (!payload?.name || !payload?.email) {
    throw createError(400, 'Name and email are required.');
  }
}

async function getAccessToken() {
  const jwt = createJwt();
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Token exchange failed:', text);
    throw createError(502, 'Unable to authenticate with Google Sheets right now.');
  }

  const json = await response.json();
  return json.access_token;
}

async function appendToSheet(accessToken, payload) {
  const submittedAt = payload.submittedAt || new Date().toISOString();
  const row = [
    payload.name,
    payload.email,
    payload.phone || '',
    payload.gamingInterests || '',
    payload.experience || '',
    payload.message || '',
    submittedAt,
    payload.source || SOURCE_TAG,
  ];

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(
      SHEET_RANGE
    )}:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [row] }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    console.error('Sheets append failed:', text);
    throw createError(502, 'Unable to save your registration right now. Please try again soon.');
  }
}

function createJwt() {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();
  const signature = base64UrlEncode(signer.sign(PRIVATE_KEY));

  return `${unsignedToken}.${signature}`;
}

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function createError(statusCode, publicMessage) {
  const err = new Error(publicMessage);
  err.statusCode = statusCode;
  err.publicMessage = publicMessage;
  return err;
}
