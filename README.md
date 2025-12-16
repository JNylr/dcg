# Gaming Event Landing Page

This project is now a Next.js app for the Doncaster Gaming Event landing page. It renders the hero, about, and registration form sections and exposes an API route for saving submissions to Google Sheets.

## Running the project
1. Install dependencies: `npm install` (registry access required).
2. Start development server: `npm run dev` (Next.js at http://localhost:3000 by default).
3. Build for production: `npm run build` then `npm start`.

## Environment variables
Copy `.env.example` to `.env.local` and fill in your Google Sheets service account details:
- `GOOGLE_SHEET_ID` – Spreadsheet ID.
- `GOOGLE_SHEET_RANGE` – Target range (e.g., `Sheet1!A:H`).
- `GOOGLE_CLIENT_EMAIL` – Service account client email.
- `GOOGLE_PRIVATE_KEY` – Private key (use `\n` for newlines).
- Optional: `CORS_ORIGIN`, `SOURCE_TAG`, `NEXT_PUBLIC_SHEET_ENDPOINT`.

Registrations are posted to `/api/register`, which handles authentication and appends rows to the configured sheet.
