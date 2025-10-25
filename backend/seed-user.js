const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/raitha_mithra')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Dummy user data
const dummyUsers = [
  {
    name: 'Farmer Test',
    email: 'farmer@test.com',
    phone: '9876543210',
    role: 'farmer',
    location: 'Bangalore',
    password: 'password123'
  },
  {
    name: 'Owner Test',
    email: 'owner@test.com',
    phone: '9876543211',
    role: 'owner',
    location: 'Mysore',
    password: 'password123'
  }
];

// Function to seed users
async function seedUsers() {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create new users
    const createdUsers = await User.create(dummyUsers);
    console.log(`Created ${createdUsers.length} users:`);
    createdUsers.forEach(user => {
      console.log(`- ${user.name} (${user.role}): ${user.phone}`);
    });

    console.log('\nUse these credentials to login:');
    console.log('Farmer: Email: farmer@test.com, Password: password123');
    console.log('Owner: Email: owner@test.com, Password: password123');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedUsers();