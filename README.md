<div align="center">

<img src="public/logo.png" alt="AMORA.AI Logo" width="120" style="border-radius: 20px;" />

# AMORA.AI

### Adaptive AI Companion for Neurodivergent Minds 💜

*An AI-powered web app that adapts to your mental state — built for users with ADHD, autism, anxiety, and sensory sensitivities.*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-amora--ai.onrender.com-8B5CF6?style=for-the-badge)](https://amora-ai.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

[**🚀 Try Live Demo**](https://amora-ai.onrender.com) • [**📖 Documentation**](#-features) • [**🛠️ Setup Guide**](#-quick-start)

</div>

---

## 💜 Built for Neurodivergent Minds

AMORA.AI isn't just another AI app — it's designed specifically for users with **ADHD, autism, anxiety, and sensory sensitivities**. The interface **adapts to your mental state** through a personality quiz that determines your optimal experience.

### Three Adaptive Modes:

| Mode | Best For | Visual Style |
|------|----------|--------------|
| 🌿 **Calm Mode** | Tired, anxious, overwhelmed | Soft lavender, gentle animations, larger fonts |
| ⚡ **Focused Mode** | Productive, work sessions | Dark theme, sharp contrast, snappy interactions |
| ✨ **Playful Mode** | Curious, creative, exploring | Vibrant gradients, bouncy animations, energetic |

> Users can switch modes anytime via the header dropdown — your dashboard, your way.

---

## ✨ Features

### 🤖 AI-Powered Tools

| Feature | Description | Technology |
|---------|-------------|------------|
| 🎨 **AI Image Generation** | Create stunning images from text prompts with 8 art styles | Pollinations AI (Stable Diffusion) |
| 🔊 **Text-to-Speech** | Convert text to natural speech with voice, pitch & speed control | Web Speech API |
| 🎤 **Voice-to-Text** | Real-time transcription in **8 languages** | Web Speech API |
| 🎮 **AI-Powered Games** | 4 interactive games: Word Association, Story Builder, Puzzle Solver, Memory Challenge | Custom JavaScript |
| 💜 **Emotional Support** | Personalized motivational, calming, and focus messages | Adaptive content engine |
| 📅 **Smart Productivity** | Task scheduling and workflow tools | Custom UI |

### 🎯 Adaptive Personalization

- **5-question quiz** captures user preferences (mental state, interaction style, response preference)
- **Automatic mode application** on first login
- **Tab reordering** based on user's priority features
- **Always-accessible** floating sidebar for Games + Emotional Support
- **Mode switcher** in header for manual control anytime

### 🔐 Multi-Method Authentication

- 🔵 Google OAuth 2.0
- ⚫ GitHub OAuth
- ✉️ Email/Password with bcrypt hashing
- 🔑 Forgot password with reset codes
- 🛡️ Rate limiting + session management

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Vanilla HTML5, CSS3 (Custom Design System), JavaScript (ES6+) |
| **Backend** | Node.js 18+, Express.js |
| **Authentication** | Passport.js (Local, Google OAuth, GitHub OAuth) |
| **AI Integration** | Pollinations AI (Image Generation), Web Speech API |
| **Security** | bcrypt, express-rate-limit, express-validator |
| **Sessions** | express-session (cookie-based, 24h TTL) |
| **Storage** | JSON file-based (development), MongoDB-ready |
| **Deployment** | Render.com (auto-deploy from GitHub) |
| **Monitoring** | UptimeRobot (24/7 uptime) |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **npm** (comes with Node.js)
- A GitHub account (for OAuth setup)
- A Google Cloud account (for OAuth setup)

### Installation

1. **Clone the repository**

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

   Edit `.env` with your credentials:

   ```env
   SESSION_SECRET=your-random-secret-string-here

   # Google OAuth — https://console.cloud.google.com/apis/credentials
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # GitHub OAuth — https://github.com/settings/developers
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret

   # For local dev
   BASE_URL=http://localhost:3000
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**

   ```text
   http://localhost:3000
   ```

> [!NOTE]
> OAuth is optional — you can sign up with email/password without any API keys.

---

## 🔑 OAuth Setup Guides

<details>
<summary><strong>🔵 Google OAuth 2.0 Setup</strong></summary>

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create new project → **OAuth 2.0 Client ID**
3. Choose **Web application** type
4. Add **Authorized JavaScript origins**:
   ```text
   http://localhost:3000
   ```
5. Add **Authorized redirect URIs**:
   ```text
   http://localhost:3000/auth/google/callback
   ```
6. Copy Client ID and Client Secret to `.env`

</details>

<details>
<summary><strong>⚫ GitHub OAuth Setup</strong></summary>

1. Go to [GitHub → Settings → Developer Settings → OAuth Apps](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - Application name: `AMORA.AI (Local)`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/auth/github/callback`
4. Click **Register Application**
5. Generate a **Client Secret**
6. Copy both to `.env`

</details>

---

## 📁 Project Structure

```text
amora-ai/
├── server/
│   ├── server.js          # Express entry point
│   ├── config/
│   │   └── passport.js    # OAuth strategies
│   ├── middleware/
│   │   └── authMiddleware.js # Route protection
│   ├── routes/
│   │   ├── auth.js        # Authentication routes
│   │   └── api.js         # AI feature endpoints
│   └── utils/
│       └── userStore.js   # User data management
├── src/
│   ├── scripts/
│   │   ├── toast.js       # Notification system
│   │   └── lightbox.js    # Image viewer
│   └── styles/
│       ├── design-tokens.css # Design system
│       └── main.css       # Global styles
├── games/
│   ├── word-association.html # Word chain game
│   ├── story-builder.html    # Collaborative storytelling
│   ├── puzzle-solver.html    # AI riddles
│   └── memory-challenge.html # Simon-says style
├── public/
│   └── logo.png           # AMORA.AI branding
├── data/                  # (gitignored) User data
├── index.html             # Landing page
├── about.html             # About page
├── quiz.html              # Personality quiz
├── login.html             # Authentication
├── dashboard.html         # Main app (adaptive)
├── .env.example           # Environment template
├── Procfile               # Render deployment
├── package.json
└── README.md
```

---

## 🌐 Deployment

AMORA.AI is deployed on **Render** (free tier).

### Deploy Your Own

1. Fork this repository
2. Sign up at [render.com](https://render.com)
3. Create new **Web Service** → Connect your fork
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Node Version: `18+`
5. Add environment variables (same as `.env`):
   ```text
   NODE_ENV=production
   SESSION_SECRET=...
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GITHUB_CLIENT_ID=...
   GITHUB_CLIENT_SECRET=...
   BASE_URL=https://your-app.onrender.com
   CLIENT_URL=https://your-app.onrender.com
   ```
6. Update OAuth callbacks with your production URL
7. Deploy!

> [!IMPORTANT]
> Render's free tier sleeps after 15 minutes of inactivity. Use UptimeRobot (free) to ping every 5 minutes and keep it awake.

---

## 🎮 Games

| Game | Description | Cognitive Skill |
|------|-------------|-----------------|
| 🔤 **Word Association** | Build chains of related words against the clock | Pattern recognition, vocabulary |
| 📖 **Story Builder** | Co-create stories alternating sentences with AI | Creativity, narrative thinking |
| 🧩 **Puzzle Solver** | Solve AI-generated riddles and logic puzzles | Critical thinking, problem solving |
| 🧠 **Memory Challenge** | Test memory with pattern-matching sequences | Working memory, attention |

---

## 🧠 Why AMORA.AI?

Most apps assume users are neurotypical. AMORA.AI flips this assumption.

### For ADHD Users 🎯
- **Focused Mode** removes visual clutter
- **Voice-to-text** captures fleeting thoughts
- **Games** provide dopamine boosts during work
- **Floating sidebar** = essential features always 1 click away

### For Anxious Users 🌿
- **Calm Mode** uses soothing colors and slower animations
- **Emotional Support** offers personalized affirmations
- **Reduced motion** option respects sensory sensitivities
- **Larger fonts** reduce cognitive strain

### For Autistic Users 🧩
- **Predictable layouts** with mode-based consistency
- **Customizable interaction** (text/voice/visual)
- **No surprises** — preferences persist across sessions

### For Creative Users ✨
- **Playful Mode** energizes creativity
- **AI Image Generation** with multiple art styles
- **Story Builder** for narrative exploration

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with auto-reload (nodemon) |
| `npm install` | Install all dependencies |

---

## 🛣️ Roadmap

### v1.0 (Current) ✅
- 3 adaptive dashboard modes
- Quiz-based personalization
- Multi-method authentication
- AI image generation
- Voice features
- 4 interactive games
- Emotional support tools

### v2.0 (Planned) 🚧
- Real AI for Emotional Support (OpenAI integration)
- MongoDB for persistent user data
- Real email notifications (SendGrid)
- Custom domain
- Mobile app (React Native)
- Multi-user support / sharing
- Advanced AI tutoring features
- Wearable integration (Apple Watch focus mode)

---

## 🤝 Contributing

Contributions are welcome! Especially from neurodivergent developers — your insight is invaluable.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Good First Issues
- 🐛 Bug fixes
- 📝 Documentation improvements
- 🌍 Translations
- 🎨 New game ideas
- ♿ Accessibility enhancements

---

## 📊 Tech Highlights

### What I Learned Building This
- Full-stack development with Node.js + Express
- OAuth 2.0 implementation with Passport.js
- Session management and secure authentication
- AI API integration (Pollinations, Web Speech)
- Adaptive UX for accessibility
- CSS design systems with custom properties
- Production deployment with CI/CD
- State management without frameworks

### Interesting Challenges Solved
- 🎨 Building 3 distinct theme variants without code duplication
- 🔄 Connecting quiz responses to UI personalization
- 🛡️ Implementing rate limiting for security
- 📱 Mobile-responsive design across all modes
- ⚡ Handling async preference saves without blocking UI

---

## 🙏 Acknowledgments

- **Pollinations AI** — Free image generation
- **Render** — Free hosting
- **Inter Font** by Rasmus Andersson
- **UptimeRobot** — Free monitoring
- The neurodivergent community — for inspiration and feedback

---

## 👨‍💻 Author

**Johan Daniel M**

- GitHub: [@JohanDanielM](https://github.com/JohanDanielM)
- Project Link: [https://github.com/JohanDanielM/amora-ai](https://github.com/JohanDanielM/amora-ai)
- Live Demo: [https://amora-ai.onrender.com](https://amora-ai.onrender.com)

---

<div align="center">
Built with 💜 for minds that work a little differently.

⭐ If you found this project useful, please star it! ⭐
</div>
