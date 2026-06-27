const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const userStore = require('../utils/userStore');

// Dynamic base URL for OAuth callbacks (supports deployment to any host)
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// ========== Serialize / Deserialize ==========

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    try {
        const user = userStore.getUserById(id);
        done(null, user || null);
    } catch (err) {
        done(err, null);
    }
});

// Helper: find or create user from OAuth profile
function findOrCreateUser(profile, provider) {
    const id = `${provider}-${profile.id}`;
    let user = userStore.getUserById(id);
    if (user) return user;

    user = {
        id,
        providerId: profile.id,
        provider,
        displayName: profile.displayName || profile.username || 'User',
        email: (profile.emails && profile.emails[0] && profile.emails[0].value) || null,
        avatar: (profile.photos && profile.photos[0] && profile.photos[0].value) || null
    };
    userStore.saveUser(user);
    return user;
}

// ========== Local Strategy ==========
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const user = userStore.getUserByEmail(email);
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            if (!user.hashedPassword) {
                // User exists but has no password (e.g. OAuth only account)
                return done(null, false, { message: 'Please log in with Google or GitHub' });
            }
            const isMatch = await bcrypt.compare(password, user.hashedPassword);
            if (!isMatch) {
                return done(null, false, { message: 'Invalid password' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// ========== Google Strategy ==========
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${BASE_URL}/auth/google/callback`
        },
        (accessToken, refreshToken, profile, done) => {
            try {
                const user = findOrCreateUser(profile, 'google');
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));
    console.log('  ✓ Google OAuth strategy loaded');
} else {
    console.log('  ✗ Google OAuth not configured (missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET)');
}

// ========== GitHub Strategy ==========
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${BASE_URL}/auth/github/callback`,
            scope: ['user:email']
        },
        (accessToken, refreshToken, profile, done) => {
            try {
                const user = findOrCreateUser(profile, 'github');
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));
    console.log('  ✓ GitHub OAuth strategy loaded');
} else {
    console.log('  ✗ GitHub OAuth not configured (missing GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET)');
}

module.exports = passport;
