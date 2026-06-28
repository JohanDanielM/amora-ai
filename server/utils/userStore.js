// ⚠️ NOTE: data/users.json is ephemeral on Render free tier
// Local accounts will be wiped on each redeploy
// For production, migrate to MongoDB Atlas (free 512MB)
// OAuth users (Google/GitHub) auto-recreate on next login

const fs = require('fs');
const path = require('path');
const USERS_FILE = path.join(__dirname, '../../data/users.json');

// Ensure database file and directory exist safely (sync)
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

// Safely read all users from data/users.json (sync)
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

// Safely write users array to data/users.json (sync)
function writeUsers(users) {
    ensureDirAndFile();
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing users to storage:', error);
    }
}

// Async-safe loadUsers
async function loadUsers() {
  try {
    const data = await fs.promises.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return []; // File doesn't exist
    throw err;
  }
}

// Async-safe saveUsers with atomic write
async function saveUsers(users) {
  try {
    const dir = path.dirname(USERS_FILE);
    await fs.promises.mkdir(dir, { recursive: true });
    
    const tempFile = USERS_FILE + '.tmp';
    await fs.promises.writeFile(tempFile, JSON.stringify(users, null, 2), 'utf8');
    await fs.promises.rename(tempFile, USERS_FILE);
  } catch (err) {
    console.error('Failed to save users:', err);
    throw err;
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
        users[index] = { ...users[index], ...user };
    } else {
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

// Async-safe updateUserPreferences
async function updateUserPreferences(userId, preferences) {
  try {
    console.log('[userStore] updateUserPreferences called for:', userId);
    
    if (!userId) {
      throw new Error('userId is required');
    }
    
    const users = await loadUsers();
    console.log('[userStore] Loaded users count:', users.length);
    
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      console.warn('[userStore] User not found:', userId);
      throw new Error('User not found');
    }
    
    console.log('[userStore] Updating user preferences');
    user.preferences = preferences;
    
    await saveUsers(users);
    console.log('[userStore] Save complete');
    
    return user;
  } catch (err) {
    console.error('[userStore] updateUserPreferences error:', err);
    throw err;
  }
}

module.exports = {
    loadUsers,
    saveUsers,
    getUserByEmail,
    getUserById,
    createUser,
    saveUser,
    setResetCode,
    validateResetCode,
    updatePassword,
    clearResetCode,
    updateUserPreferences
};
