require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');

// Import passport strategies
require('./config/passport');

// Import routes
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const { ensureAuthenticated } = require('./middleware/authMiddleware');

const app = express();
app.set('trust proxy', 1); // Required for secure cookies behind Render's reverse proxy
const PORT = process.env.PORT || 3000;

// ========== Middleware ==========

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || `http://localhost:${PORT}`,
    credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'amora-ai-dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// ========== Routes ==========

// Auth routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// API: get current logged-in user
app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: {
                id: req.user.id,
                displayName: req.user.displayName,
                email: req.user.email,
                avatar: req.user.avatar,
                provider: req.user.provider
            }
        });
    } else {
        res.json({ authenticated: false, user: null });
    }
});

// ========== Protected page ==========

// Protect dashboard — redirect unauthenticated users to login
app.get('/dashboard.html', ensureAuthenticated, (req, res, next) => {
    next(); // let static middleware serve the file
});

// Protect games — redirect unauthenticated users to login
app.get('/games/*', ensureAuthenticated, (req, res, next) => {
    next(); // let static middleware serve the file
});

// ========== Static files ==========

// Serve all existing HTML/CSS/JS from the project root
const projectRoot = path.join(__dirname, '..');
app.use(express.static(projectRoot));

// ========== Start server ==========

app.listen(PORT, () => {
    console.log('');
    console.log('  ╔══════════════════════════════════════╗');
    console.log('  ║        AMORA.AI Server Running       ║');
    console.log(`  ║     http://localhost:${PORT}             ║`);
    console.log('  ╚══════════════════════════════════════╝');
    console.log('');
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GITHUB_CLIENT_ID) {
        console.log('  ⚠  OAuth not configured. Copy .env.example → .env and add your credentials.');
        console.log('');
    }
});
