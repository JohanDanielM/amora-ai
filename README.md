# AMORA.AI 🚀

**Where AI Comes to Life!**

A multi-page web application featuring AI-powered tools, quizzes, and a dashboard — with Google and GitHub OAuth authentication.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment template
cp .env.example .env

# 3. Fill in your OAuth credentials (see below)
#    Edit .env with your editor

# 4. Start the server
npm run dev

# 5. Open in browser
#    http://localhost:3000
```

---

## Setting Up OAuth Credentials

### Google OAuth 2.0

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth client ID**
5. Select **Web application** as the application type
6. Set the application name (e.g., `AMORA.AI`)
7. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:3000/auth/google/callback
   ```
8. Click **Create**
9. Copy the **Client ID** and **Client Secret** into your `.env` file:
   ```
   GOOGLE_CLIENT_ID=your-client-id-here
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   ```

> **Note:** You may also need to configure the **OAuth consent screen** under APIs & Services → OAuth consent screen. Set it to "External" for testing and add your email as a test user.

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name:** `AMORA.AI`
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/auth/github/callback`
4. Click **Register application**
5. Copy the **Client ID**
6. Click **Generate a new client secret** and copy it
7. Add both to your `.env` file:
   ```
   GITHUB_CLIENT_ID=your-client-id-here
   GITHUB_CLIENT_SECRET=your-client-secret-here
   ```

### Pollinations AI Integration

Text-to-Image generation uses **Pollinations AI** (Flux model). No API key is required for local execution. Images are generated in 5-15 seconds.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Description |
|---|---|
| `PORT` | Server port (default: `3000`) |
| `NODE_ENV` | `development` or `production` |
| `SESSION_SECRET` | A random string for session encryption |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `GOOGLE_CALLBACK_URL` | `http://localhost:3000/auth/google/callback` |
| `GITHUB_CLIENT_ID` | From GitHub Developer Settings |
| `GITHUB_CLIENT_SECRET` | From GitHub Developer Settings |
| `GITHUB_CALLBACK_URL` | `http://localhost:3000/auth/github/callback` |
| `CLIENT_URL` | `http://localhost:3000` |
| `HUGGINGFACE_API_KEY` | Read access token from Hugging Face |

---

## Project Structure

```
amora.ai/
├── server/
│   ├── server.js                 # Express app entry point
│   ├── config/
│   │   └── passport.js           # Passport OAuth strategies
│   ├── middleware/
│   │   └── authMiddleware.js     # Auth protection middleware
│   └── routes/
│       └── auth.js               # OAuth & logout routes
├── src/
│   ├── main.js                   # Landing + about page JS
│   ├── quiz.js                   # Quiz page JS
│   └── styles/
│       └── main.css              # Global stylesheet
├── public/                       # Static assets (images, audio)
├── index.html                    # Landing page
├── about.html                    # About / intro page
├── quiz.html                     # Preference quiz
├── login.html                    # Login page (Google + GitHub OAuth)
├── dashboard.html                # Protected dashboard (requires auth)
├── .env.example                  # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

---

## Auth Flow

```
User visits / (landing page)
  → clicks AMORA.AI title
  → /about.html (auto-redirects after animation)
  → /quiz.html (preference quiz)
  → /login.html (after quiz completion)
  → clicks "Continue with Google" or "Continue with GitHub"
  → OAuth provider login
  → /auth/{provider}/callback
  → Session created → redirect to /dashboard.html
```

**Protected routes:**
- `/dashboard.html` — redirects to `/login.html` if not authenticated

**API endpoints:**
- `GET /api/user` — returns current user info (or `{ authenticated: false }`)
- `GET /auth/logout` — destroys session, redirects to `/login.html`
- `GET /auth/status` — returns auth status as JSON

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start production server |
| `npm run dev` | Start with auto-reload (nodemon) |

---

## License

MIT
