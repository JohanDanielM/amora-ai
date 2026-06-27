/**
 * Middleware to protect routes that require authentication.
 * Redirects unauthenticated users to the login page.
 */
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login.html');
}

/**
 * Middleware for API routes — returns 401 JSON instead of redirecting.
 */
function ensureAuthenticatedAPI(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Not authenticated' });
}

module.exports = { ensureAuthenticated, ensureAuthenticatedAPI };
