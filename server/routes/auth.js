const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const userStore = require('../utils/userStore');
const router = express.Router();

// ========== Rate Limiter ==========
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { error: 'Too many authentication attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false
});

// ========== Google OAuth ==========

// Start Google login
router.get('/google', (req, res, next) => {
    if (!passport._strategy('google')) {
        return res.redirect('/login.html?error=google_not_configured');
    }
    next();
}, passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google callback
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login.html?error=auth_failed'
    }),
    (req, res) => {
        res.redirect('/dashboard.html');
    }
);

// ========== GitHub OAuth ==========

// Start GitHub login
router.get('/github', (req, res, next) => {
    if (!passport._strategy('github')) {
        return res.redirect('/login.html?error=github_not_configured');
    }
    next();
}, passport.authenticate('github', {
    scope: ['user:email']
}));

// GitHub callback
router.get('/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/login.html?error=auth_failed'
    }),
    (req, res) => {
        res.redirect('/dashboard.html');
    }
);

// ========== Local Auth Routes ==========

// POST /auth/register
router.post('/register', 
    authLimiter,
    [
        body('name').trim().notEmpty().withMessage('Name is required.'),
        body('email').isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { email, password, name } = req.body;

        try {
            // Check if email already exists
            const existingUser = userStore.getUserByEmail(email);
            if (existingUser) {
                return res.status(409).json({ error: 'Email already registered. Try logging in.' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Save user
            const newUser = userStore.createUser({ email, hashedPassword, name });

            // Auto-login after registration
            req.login(newUser, (err) => {
                if (err) return next(err);
                return res.json({ success: true, redirect: '/dashboard.html' });
            });
        } catch (err) {
            console.error('Registration error:', err);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
);

// POST /auth/login
router.post('/login',
    authLimiter,
    [
        body('email').isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
        body('password').notEmpty().withMessage('Password is required.')
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({ error: info ? info.message : 'Invalid email or password.' });
            }
            req.login(user, (loginErr) => {
                if (loginErr) return next(loginErr);
                return res.json({ success: true, redirect: '/dashboard.html' });
            });
        })(req, res, next);
    }
);

// ========== Logout ==========

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        req.session.destroy(() => {
            res.redirect('/login.html');
        });
    });
});

// ========== Auth status ==========

router.get('/status', (req, res) => {
    res.json({
        authenticated: req.isAuthenticated(),
        user: req.isAuthenticated() ? {
            displayName: req.user.displayName,
            avatar: req.user.avatar,
            provider: req.user.provider
        } : null
    });
});

// POST /auth/forgot-password
router.post('/forgot-password',
    [
        body('email').isEmail().withMessage('Please enter a valid email address.').normalizeEmail()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { email } = req.body;

        try {
            const user = userStore.getUserByEmail(email);
            if (!user) {
                // Silently succeed to prevent account enumeration
                return res.json({
                    success: true,
                    message: 'If an account with that email exists, a password reset code has been generated.'
                });
            }

            // Generate 6-digit code
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const expiryDate = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry
            userStore.setResetCode(email, code, expiryDate);

            if (process.env.NODE_ENV !== 'production') {
                return res.json({
                    success: true,
                    devCode: code,
                    message: 'Use this code (in production, this would be emailed)'
                });
            }

            return res.json({
                success: true,
                message: 'If an account with that email exists, a password reset code has been generated.'
            });

        } catch (err) {
            console.error('Forgot password error:', err);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
);

// POST /auth/reset-password
router.post('/reset-password',
    [
        body('email').isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
        body('code').isLength({ min: 6, max: 6 }).withMessage('Reset code must be exactly 6 digits.'),
        body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { email, code, newPassword } = req.body;

        try {
            const isValid = userStore.validateResetCode(email, code);
            if (!isValid) {
                return res.status(400).json({ error: 'Invalid or expired code' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            userStore.updatePassword(email, hashedPassword);
            userStore.clearResetCode(email);

            return res.json({
                success: true,
                redirect: '/login.html'
            });

        } catch (err) {
            console.error('Reset password error:', err);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
);

module.exports = router;
