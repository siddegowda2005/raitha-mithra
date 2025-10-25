const mongoose = require('mongoose');
const slugify = require('slugify');

const equipmentSchema = new mongoose.Schema({
  slug: {
    type: String,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price_per_day: {
    type: Number,
    required: true,
    min: 0
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  availability_status: {
    type: String,
    enum: ['available', 'rented', 'maintenance'],
    default: 'available'
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  image_url: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for better search performance
equipmentSchema.index({ type: 1, location: 1, availability_status: 1 });

// Generate slug from name before saving
equipmentSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('name')) {
    // Create base slug from name
    let baseSlug = slugify(this.name, {
      lower: true,
      strict: true
    });
    
    // Always use a timestamp for uniqueness to avoid issues with _id not being available
    const timestamp = Date.now().toString().substring(8, 13);
    this.slug = `${baseSlug}-${timestamp}`;
  }
  next();
});

module.exports = mongoose.model('Equipment', equipmentSchema);
