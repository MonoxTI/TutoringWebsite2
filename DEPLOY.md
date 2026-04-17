# Deploying to Vercel

## Architecture
- **Frontend**: React + Vite (served as static files)
- **Backend**: Express API (`/api/*` routes) via Vercel Serverless
- **Database**: MongoDB Atlas (external, unchanged)

## Pre-deployment checklist

### 1. Push to GitHub
Make sure your repo is on GitHub. The `.env` file is gitignored — never commit it.

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo
2. Vercel will auto-detect the `vercel.json` config

### 3. Set Environment Variables in Vercel Dashboard
Go to **Project → Settings → Environment Variables** and add:

| Variable | Value |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long random secret (use a password generator) |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `465` |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASS` | Your Gmail App Password |
| `FRONTEND_URL` | `https://your-app.vercel.app` (fill after first deploy) |
| `VITE_API_URL` | `https://your-app.vercel.app` (same as above) |
| `NODE_ENV` | `production` |

> ⚠️ `VITE_API_URL` must be set **before** building, because Vite bakes it into the JS bundle at build time.

### 4. MongoDB Atlas — allow Vercel IPs
In Atlas → Network Access, add `0.0.0.0/0` (allow all) since Vercel uses dynamic IPs.
For better security, use Atlas Private Endpoints or IP allowlisting with Vercel's fixed IP add-on.

### 5. Deploy
Click **Deploy**. Vercel runs `npm run vercel-build` (i.e., `vite build`) for the frontend,
and wraps `Server/server.js` as a serverless function for the backend.

## Local development (unchanged)
```bash
cp .env.example .env   # fill in your values
npm install
npm run dev            # runs both client (5173) and server (5000)
```

## Notes
- The `dist/` folder is **not** committed — Vercel builds it fresh every deploy.
- Rotate `JWT_SECRET` and `EMAIL_PASS` — the old values from `.env` were in the zip.
