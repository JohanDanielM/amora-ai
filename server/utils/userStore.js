// ⚠️ NOTE: data/users.json is ephemeral on Render free tier
// Local accounts will be wiped on each redeploy
// For production, migrate to MongoDB Atlas (free 512MB)
// OAuth users (Google/GitHub) auto-recreate on next login

const fs = require('fs');
const path = require('path');
const USERS_FILE = path.join(__dirname, '../../data/users.json');

// Ensure database file and directory exist safely
function ensureDirAndFile() {
    try {
        const dir = path.dirname(USERS_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (!fs.existsSync(USERS_FILE)) {
            fs.writeFileSync(USERS_FILE, '[]', 'utf8');
        }
    } catch (err) {
        console.error('Error ensuring users.json exists:', err);
    }
}

// Safely read all users from data/users.json
function readUsers() {
    ensureDirAndFile();
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (error) {
        console.error('Error reading users from storage:', error);
        return [];
    }
}

// Safely write users array to data/users.json
function writeUsers(users) {
    ensureDirAndFile();
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing users to storage:', error);
    }
}

// Find user by email
function getUserByEmail(email) {
    if (!email) return null;
    const users = readUsers();
    return users.find(user => user.email && user.email.toLowerCase() === email.toLowerCase()) || null;
}

// Find user by unique ID
function getUserById(id) {
    if (!id) return null;
    const users = readUsers();
    return users.find(user => user.id === id) || null;
}

// Save a new user
function createUser({ email, hashedPassword, name }) {
    const users = readUsers();
    const newUser = {
        id: 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        email: email.toLowerCase(),
        hashedPassword,
        displayName: name || 'User',
        provider: 'local',
        avatar: null
    };
    users.push(newUser);
    writeUsers(users);
    return newUser;
}

// Upsert/save OAuth users (or local users updates)
function saveUser(user) {
    const users = readUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        // update
        users[index] = { ...users[index], ...user };
    } else {
        // insert
        users.push(user);
    }
    writeUsers(users);
    return user;
}

// Set reset code and expiry for a user
function setResetCode(email, code, expiryDate) {
    const users = readUsers();
    const index = users.findIndex(u => u.email && u.email.toLowerCase() === email.toLowerCase());
    if (index !== -1) {
        users[index].resetCode = code;
        users[index].resetCodeExpiry = expiryDate.getTime(); // store as timestamp
        writeUsers(users);
        return true;
    }
    return false;
}

// Validate if code exists and is not expired
function validateResetCode(email, code) {
    const users = readUsers();
    const user = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
    if (user && user.resetCode === code) {
        const now = Date.now();
        if (user.resetCodeExpiry && user.resetCodeExpiry > now) {
            return true;
        }
    }
    return false;
}

// Update local password for a user
function updatePassword(email, hashedPassword) {
    const users = readUsers();
    const index = users.findIndex(u => u.email && u.email.toLowerCase() === email.toLowerCase());
    if (index !== -1) {
        users[index].hashedPassword = hashedPassword;
        writeUsers(users);
        return true;
    }
    return false;
}

// Clear reset code details
function clearResetCode(email) {
    const users = readUsers();
    const index = users.findIndex(u => u.email && u.email.toLowerCase() === email.toLowerCase());
    if (index !== -1) {
        delete users[index].resetCode;
        delete users[index].resetCodeExpiry;
        writeUsers(users);
        return true;
    }
    return false;
}

module.exports = {
    getUserByEmail,
    getUserById,
    createUser,
    saveUser,
    setResetCode,
    validateResetCode,
    updatePassword,
    clearResetCode
};
