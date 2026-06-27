<p align="center">
  <img src="images.png" alt="AMORA.AI Logo" width="120" />
</p>

<h1 align="center">AMORA.AI</h1>

<p align="center">
  <strong>AI-powered companion for creativity, productivity, and emotional wellness</strong>
</p>

<p align="center">
  <a href="https://amora-ai.onrender.com"><img alt="Live Demo" src="https://img.shields.io/badge/🌐_Live_Demo-amora--ai.onrender.com-8A2BE2?style=for-the-badge"></a>
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge">
</p>

---

## ✨ Features

| Category | Feature | Details |
|----------|---------|---------|
| 🎤 | **Voice-to-Text** | Real-time speech recognition in **8 languages** via the Web Speech API |
| 🎨 | **AI Image Generation** | Create stunning images from text prompts using **Pollinations AI** |
| 🔊 | **Text-to-Speech** | Convert text to natural speech with **voice & pitch customization** |
| 🎮 | **AI-Powered Games** | 4 interactive games — Word Association, Story Builder, Puzzle Solver, Memory Challenge |
| 💜 | **Emotional Support** | Guided affirmations, breathing exercises, and motivational content |
| 🚀 | **Smart Productivity** | AI-assisted tools to boost creativity and workflow |
| 🔐 | **Multi-Auth** | Sign in with **Google**, **GitHub**, or **Email/Password** |
| 📱 | **Fully Responsive** | Beautiful experience on desktop, tablet, and mobile |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js, Express |
| **Frontend** | Vanilla HTML, CSS, JavaScript |
| **Authentication** | Passport.js (Local, Google OAuth 2.0, GitHub OAuth) |
| **AI & APIs** | Pollinations AI, Web Speech API |
| **Security** | bcrypt, express-rate-limit, express-validator |
| **Sessions** | express-session (cookie-based, 24 h TTL) |
| **Deployment** | Render |

---

## 📁 Project Structure

```
amora-ai/
├── server/
│   ├── server.js            # Express entry point
│   ├── config/              # Passport strategies
│   ├── middleware/           # Auth middleware
│   ├── routes/              # Auth & API routes
│   └── utils/               # Helpers
├── src/
│   ├── scripts/             # Lightbox, toast notifications
│   └── styles/              # Design tokens & main CSS
├── games/
│   ├── word-association.html
│   ├── story-builder.html
│   ├── puzzle-solver.html
│   └── memory-challenge.html
├── index.html               # Landing page
├── login.html               # Auth page
├── dashboard.html           # Main app dashboard
├── about.html               # About page
├── quiz.html                # Personality quiz
├── .env.example             # Environment template
├── package.json
└── Procfile                 # Render start command
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **npm**

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/JohanDanielM/amora-ai.git
   cd amora-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Open `.env` and add your credentials:
   ```env
   SESSION_SECRET=your-random-secret-here

   # Google OAuth 2.0 — https://console.cloud.google.com/apis/credentials
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # GitHub OAuth — https://github.com/settings/developers
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   ```
   http://localhost:3000
   ```

> [!TIP]
> OAuth is optional — you can sign up with an email/password without any API keys.

---

## 🔑 OAuth Setup

<details>
<summary><strong>Google OAuth 2.0</strong></summary>

1. Go to the [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add to **Authorized redirect URIs**:
   ```
   http://localhost:3000/auth/google/callback
   ```
4. Copy the Client ID & Secret into your `.env`

</details>

<details>
<summary><strong>GitHub OAuth</strong></summary>

1. Go to [GitHub → Settings → Developer Settings → OAuth Apps](https://github.com/settings/developers)
2. Create a **New OAuth App**
3. Set **Authorization callback URL**:
   ```
   http://localhost:3000/auth/github/callback
   ```
4. Copy the Client ID & Secret into your `.env`

</details>

---

## 🌐 Deployment

AMORA.AI is deployed on **[Render](https://render.com)** (free tier).

| Setting | Value |
|---------|-------|
| Build Command | `npm install` |
| Start Command | `npm start` |
| Node Version | `18+` |

> [!NOTE]
> The free Render tier uses ephemeral storage — local accounts in `data/users.json` are reset on each deploy. OAuth accounts (Google/GitHub) recreate automatically. For persistence, consider migrating to **MongoDB Atlas** (free 512 MB tier).

For the full deployment walkthrough, see [**DEPLOYMENT.md**](DEPLOYMENT.md).

---

## 🎮 Games

| Game | Description |
|------|-------------|
| 🔤 **Word Association** | AI gives a word — you respond with associated words against the clock |
| 📖 **Story Builder** | Co-create stories with AI, alternating sentences |
| 🧩 **Puzzle Solver** | Solve AI-generated logic puzzles and riddles |
| 🧠 **Memory Challenge** | Test and improve your memory with pattern-matching games |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with 💜 by <a href="https://github.com/JohanDanielM">JohanDanielM</a>
</p>
