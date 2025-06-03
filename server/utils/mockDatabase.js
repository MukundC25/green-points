const fs = require('fs').promises;
const path = require('path');

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
    // File doesn't exist, return empty array with demo user
    const demoUser = {
      _id: 'demo-user-id',
      name: 'Demo User',
      email: 'demo@greenpoints.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: demo123
      greenPoints: 150,
      greenWallet: {
        balance: 150,
        history: [
          {
            timestamp: new Date('2024-01-15'),
            points: 110,
            source: 'Sold Smartphone',
            type: 'credit',
            metadata: {
              itemType: 'Smartphone',
              condition: 'Working',
              quantity: 1,
              userFrequency: 'Regular'
            }
          },
          {
            timestamp: new Date('2024-01-20'),
            points: 65,
            source: 'Sold Battery',
            type: 'credit',
            metadata: {
              itemType: 'Battery',
              condition: 'Working',
              quantity: 2,
              userFrequency: 'Regular'
            }
          },
          {
            timestamp: new Date('2024-01-25'),
            points: -25,
            source: 'Redeemed for Bamboo Water Bottle',
            type: 'debit'
          }
        ],
        totalEarned: 175,
        totalRedeemed: 25
      },
      userFrequency: 'Regular',
      profile: {
        phone: '+1234567890',
        address: '123 Green Street',
        city: 'EcoCity',
        state: 'CA',
        zipCode: '12345'
      },
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    };
    
    await saveUsers([demoUser]);
    return [demoUser];
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

// Mock User model that mimics Mongoose
class MockUser {
  constructor(data) {
    Object.assign(this, data);
    if (!this._id) {
      this._id = generateId();
    }
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date();
  }

  async save() {
    const users = await loadUsers();
    const existingIndex = users.findIndex(u => u._id === this._id);
    
    this.updatedAt = new Date();
    
    if (existingIndex >= 0) {
      users[existingIndex] = { ...this };
    } else {
      users.push({ ...this });
    }
    
    await saveUsers(users);
    return this;
  }

  async comparePassword(candidatePassword) {
    const bcrypt = require('bcryptjs');
    return bcrypt.compare(candidatePassword, this.password);
  }

  addPoints(points, source, metadata = {}) {
    this.greenWallet.balance += points;
    this.greenPoints = this.greenWallet.balance;
    this.greenWallet.totalEarned += points;
    
    this.greenWallet.history.push({
      timestamp: new Date(),
      points,
      source,
      type: 'credit',
      metadata
    });
    
    this.updateUserFrequency();
  }

  redeemPoints(points, source) {
    if (this.greenWallet.balance < points) {
      throw new Error('Insufficient points balance');
    }
    
    this.greenWallet.balance -= points;
    this.greenPoints = this.greenWallet.balance;
    this.greenWallet.totalRedeemed += points;
    
    this.greenWallet.history.push({
      timestamp: new Date(),
      points: -points,
      source,
      type: 'debit'
    });
  }

  updateUserFrequency() {
    const transactionCount = this.greenWallet.history.filter(t => t.type === 'credit').length;
    
    if (transactionCount >= 10) {
      this.userFrequency = 'Regular';
    } else if (transactionCount >= 3) {
      this.userFrequency = 'Occasional';
    } else {
      this.userFrequency = 'First-time';
    }
  }

  static async findOne(query) {
    const users = await loadUsers();
    const user = users.find(u => {
      if (query.email) return u.email === query.email;
      if (query._id) return u._id === query._id;
      return false;
    });
    
    return user ? new MockUser(user) : null;
  }

  static async findById(id) {
    const users = await loadUsers();
    const user = users.find(u => u._id === id);
    return user ? new MockUser(user) : null;
  }

  static async create(data) {
    const user = new MockUser(data);
    await user.save();
    return user;
  }
}

// Mock mongoose connection
const mockMongoose = {
  connect: async (uri, options) => {
    console.log('✅ Connected to Mock Database (File-based storage)');
    return Promise.resolve();
  },
  model: (name, schema) => {
    if (name === 'User') {
      return MockUser;
    }
    return MockUser; // Default to User for now
  }
};

module.exports = {
  MockUser,
  mockMongoose,
  loadUsers,
  saveUsers
};
