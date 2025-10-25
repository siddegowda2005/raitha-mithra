const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  equipment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  renter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  total_amount: {
    type: Number,
    required: true
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Validate that end_date is after start_date
bookingSchema.pre('save', function(next) {
  if (this.end_date <= this.start_date) {
    return next(new Error('End date must be after start date'));
  }
  next();
});

// Calculate total amount based on days and price
bookingSchema.pre('save', async function(next) {
  if (this.isModified('start_date') || this.isModified('end_date')) {
    const equipment = await mongoose.model('Equipment').findById(this.equipment_id);
    if (equipment) {
      const days = Math.ceil((this.end_date - this.start_date) / (1000 * 60 * 60 * 24));
      this.total_amount = days * equipment.price_per_day;
    }
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
