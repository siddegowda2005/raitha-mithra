const mongoose = require('mongoose');
const Equipment = require('./models/Equipment');
const User = require('./models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/raitha_mithra')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Function to seed equipment
async function seedEquipment() {
  try {
    // Find owner user
    const owner = await User.findOne({ role: 'owner' });
    
    if (!owner) {
      console.error('No owner user found. Please run seed-user.js first.');
      return;
    }

    // Clear existing equipment
    await Equipment.deleteMany({});
    console.log('Cleared existing equipment');

    // Dummy equipment data
    const dummyEquipment = [
      {
        name: 'John Deere Tractor',
        type: 'Tractor',
        description: 'Powerful tractor for all farming needs',
        price_per_day: 2500,
        owner_id: owner._id,
        location: 'Bangalore',
        availability_status: 'available',
        image_url: 'https://example.com/tractor1.jpg'
      },
      {
        name: 'Harvester Machine',
        type: 'Harvester',
        description: 'Efficient harvester for grain crops',
        price_per_day: 3500,
        owner_id: owner._id,
        location: 'Mysore',
        availability_status: 'available',
        image_url: 'https://example.com/harvester1.jpg'
      },
      {
        name: 'Irrigation Pump',
        type: 'Irrigation',
        description: 'High-capacity water pump for irrigation',
        price_per_day: 1200,
        owner_id: owner._id,
        location: 'Bangalore',
        availability_status: 'available',
        image_url: 'https://example.com/pump1.jpg'
      }
    ];

    // Create new equipment
    const createdEquipment = await Equipment.create(dummyEquipment);
    console.log(`Created ${createdEquipment.length} equipment items:`);
    createdEquipment.forEach(item => {
      console.log(`- ${item.name} (${item.type}): ₹${item.price_per_day}/day`);
    });

  } catch (error) {
    console.error('Error seeding equipment:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedEquipment();