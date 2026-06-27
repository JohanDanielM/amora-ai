# AMORA.AI — Deployment Guide

## Local Development

1. Copy `.env.example` to `.env`
2. Fill in your credentials
3. `npm install`
4. `npm run dev`
5. Open http://localhost:3000

---

## Deploy to Render (Free)

### 1. Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Create Render Account

- Sign up at [render.com](https://render.com) (free)
- Connect your GitHub account

### 3. Create Web Service

- Click **"New +"** → **"Web Service"**
- Connect your amora-ai repo
- Settings:
  | Field | Value |
  |---|---|
  | Name | `amora-ai` |
  | Region | nearest to you |
  | Branch | `main` |
  | Build Command | `npm install` |
  | Start Command | `npm start` |
  | Instance Type | Free |

### 4. Add Environment Variables

Click the **"Environment"** tab and add:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | *(generate a random 50+ char string)* |
| `GOOGLE_CLIENT_ID` | *(from Google Console)* |
| `GOOGLE_CLIENT_SECRET` | *(from Google Console)* |
| `GITHUB_CLIENT_ID` | *(from GitHub)* |
| `GITHUB_CLIENT_SECRET` | *(from GitHub)* |
| `BASE_URL` | `https://YOUR-APP.onrender.com` *(update after first deploy)* |
| `CLIENT_URL` | `https://YOUR-APP.onrender.com` |

### 5. Update OAuth Callbacks

**Google Cloud Console:**
- Go to APIs & Credentials
- Edit your OAuth Client
- Add to **Authorized redirect URIs**:
  `https://YOUR-APP.onrender.com/auth/google/callback`
- Add to **Authorized JavaScript origins**:
  `https://YOUR-APP.onrender.com`

**GitHub OAuth App:**
- Settings → Developer Settings → OAuth Apps
- Update **Authorization callback URL**:
  `https://YOUR-APP.onrender.com/auth/github/callback`

### 6. Trigger Redeploy on Render

After updating env vars, click **"Manual Deploy"** → **"Deploy latest commit"**

### 7. Test Live

Visit your URL and test all features:
- ✅ Landing page loads
- ✅ Login (local, Google, GitHub)
- ✅ Dashboard tools (TTS, Image Gen, Voice-to-Text)
- ✅ Emotional Support buttons
- ✅ All 4 games
- ✅ Logout

---

## ⚠️ Important Notes

### Ephemeral File Storage
Render free tier has **ephemeral disk** — `data/users.json` is wiped on every redeploy. This means:
- Local email/password accounts are lost on redeploy
- OAuth users (Google/GitHub) auto-recreate seamlessly on next login
- For persistent storage, migrate to **MongoDB Atlas** (free 512MB tier)

### Cold Starts
Free Render instances spin down after 15 min of inactivity. First request after idle takes ~30s.
