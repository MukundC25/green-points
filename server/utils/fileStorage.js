const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

// Load users from file
async function loadUsers() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist, return empty array
    return [];
  }
}

// Save users to file
async function saveUsers(users) {
  await ensureDataDir();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// User storage functions
const userStorage = {
  async findByEmail(email) {
    const users = await loadUsers();
    return users.find(user => user.email === email.toLowerCase());
  },

  async findById(id) {
    const users = await loadUsers();
    return users.find(user => user.id === id);
  },

  async create(userData) {
    const users = await loadUsers();
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === userData.email.toLowerCase());
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create new user
    const newUser = {
      id: generateId(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      greenPoints: 0,
      greenWallet: {
        balance: 0,
        history: [],
        totalEarned: 0,
        totalRedeemed: 0
      },
      userFrequency: 'First-time',
      profile: {
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        zipCode: userData.zipCode || ''
      },
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(newUser);
    await saveUsers(users);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  async update(id, updateData) {
    const users = await loadUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date()
    };

    await saveUsers(users);
    
    // Return user without password
    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  },

  async comparePassword(user, candidatePassword) {
    return bcrypt.compare(candidatePassword, user.password);
  },

  // Helper methods for Green Points operations
  async addPoints(userId, points, source, metadata = {}) {
    const users = await loadUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = users[userIndex];
    
    // Add points to wallet
    user.greenWallet.balance += points;
    user.greenPoints = user.greenWallet.balance;
    user.greenWallet.totalEarned += points;
    
    user.greenWallet.history.push({
      timestamp: new Date(),
      points,
      source,
      type: 'credit',
      metadata
    });
    
    // Update user frequency
    const transactionCount = user.greenWallet.history.filter(t => t.type === 'credit').length;
    if (transactionCount >= 10) {
      user.userFrequency = 'Regular';
    } else if (transactionCount >= 3) {
      user.userFrequency = 'Occasional';
    }

    user.updatedAt = new Date();
    users[userIndex] = user;
    await saveUsers(users);
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async redeemPoints(userId, points, source) {
    const users = await loadUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = users[userIndex];
    
    if (user.greenWallet.balance < points) {
      throw new Error('Insufficient points balance');
    }
    
    // Redeem points
    user.greenWallet.balance -= points;
    user.greenPoints = user.greenWallet.balance;
    user.greenWallet.totalRedeemed += points;
    
    user.greenWallet.history.push({
      timestamp: new Date(),
      points: -points,
      source,
      type: 'debit'
    });

    user.updatedAt = new Date();
    users[userIndex] = user;
    await saveUsers(users);
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};

module.exports = userStorage;
