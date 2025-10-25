const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  renter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  equipment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comments: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Ensure one review per booking
reviewSchema.index({ booking_id: 1 }, { unique: true });

// Validate that review can only be posted for completed bookings
reviewSchema.pre('save', async function(next) {
  const booking = await mongoose.model('Booking').findById(this.booking_id);
  if (!booking || booking.status !== 'completed') {
    return next(new Error('Reviews can only be posted for completed bookings'));
  }
  next();
});

module.exports = mongoose.model('Review', reviewSchema);
