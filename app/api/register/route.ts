import crypto from "crypto";

export const runtime = "nodejs";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_RANGE = process.env.GOOGLE_SHEET_RANGE || "Sheet1!A:H";
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY || "");
const SOURCE_TAG = process.env.SOURCE_TAG || "doncaster-gaming-event";
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || "*";

class ResponseError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const corsHeaders = () => ({
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
});

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(),
    },
  });

const ensureConfig = () => {
  if (!SHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    throw new ResponseError(
      500,
      "Missing Google Sheets configuration. Please add GOOGLE_SHEET_ID, GOOGLE_CLIENT_EMAIL, and GOOGLE_PRIVATE_KEY to your environment."
    );
  }
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(request: Request) {
  ensureConfig();
  let payload: any;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse(400, {
      ok: false,
      message: "Invalid JSON payload.",
    });
  }

  try {
    validatePayload(payload);

    const accessToken = await getAccessToken();
    await appendToSheet(accessToken, payload);

    return jsonResponse(200, { ok: true });
  } catch (error) {
    const status = error instanceof ResponseError ? error.status : 500;
    const message =
      error instanceof ResponseError
        ? error.message
        : "Could not submit registration. Please try again later.";

    console.error("Submission failed:", error);
    return jsonResponse(status, { ok: false, message });
  }
}

function validatePayload(payload: any) {
  if (!payload?.name || !payload?.email) {
    throw new ResponseError(400, "Name and email are required.");
  }
}

async function getAccessToken() {
  const jwt = createJwt();
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Token exchange failed:", text);
    throw new ResponseError(502, "Unable to authenticate with Google Sheets right now.");
  }

  const json = await response.json();
  return json.access_token as string;
}

async function appendToSheet(accessToken: string, payload: any) {
  const submittedAt = payload.submittedAt || new Date().toISOString();
  const row = [
    payload.name,
    payload.email,
    payload.phone || "",
    payload.gamingInterests || "",
    payload.experience || "",
    payload.message || "",
    submittedAt,
    payload.source || SOURCE_TAG,
  ];

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(
      SHEET_RANGE
    )}:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [row] }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    console.error("Sheets append failed:", text);
    throw new ResponseError(
      502,
      "Unable to save your registration right now. Please try again soon."
    );
  }
}

function createJwt() {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();
  const signature = base64UrlEncode(signer.sign(PRIVATE_KEY));

  return `${unsignedToken}.${signature}`;
}

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function normalizePrivateKey(key: string) {
  return key
    .replace(/\\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}
