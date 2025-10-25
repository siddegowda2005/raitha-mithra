const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking (farmer only)
// @access  Private (Farmer)
router.post('/', [
  auth,
  requireRole(['farmer']),
  body('equipment_id').isMongoId().withMessage('Valid equipment ID is required'),
  body('start_date').isISO8601().withMessage('Valid start date is required'),
  body('end_date').isISO8601().withMessage('Valid end date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { equipment_id, start_date, end_date } = req.body;

    // Check if equipment exists and is available
    const equipment = await Equipment.findById(equipment_id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found or invalid equipment id' });
    }

    if (equipment.availability_status !== 'available') {
      return res.status(400).json({ message: 'Equipment is not available for rent' });
    }

    // Check if dates are valid
    const start = new Date(start_date);
    const end = new Date(end_date);
    const now = new Date();

    if (start <= now) {
      return res.status(400).json({ message: 'Start date must be in the future' });
    }

    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Check if equipment is already booked for these dates
    const existingBooking = await Booking.findOne({
      equipment_id,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { start_date: { $lte: end, $gte: start } },
        { end_date: { $gte: start, $lte: end } }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Equipment is already booked for these dates' });
    }

    // Calculate total amount
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const total_amount = days * equipment.price_per_day;
    
    // Create booking
    const booking = new Booking({
      equipment_id,
      renter_id: req.user._id,
      start_date: start,
      end_date: end,
      owner_id: equipment.owner_id,
      total_amount: total_amount
    });

    await booking.save();

    // Update equipment availability
    equipment.availability_status = 'rented';
    await equipment.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('equipment_id')
      .populate('renter_id', 'name phone')
      .populate('owner_id', 'name phone');

    res.status(201).json({
      message: 'Booking created successfully',
      booking: populatedBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let filter = {};
    
    if (req.user.role === 'farmer') {
      filter.renter_id = req.user._id;
    } else if (req.user.role === 'owner') {
      filter.owner_id = req.user._id;
    }

    const bookings = await Booking.find(filter)
      .populate('equipment_id', 'name type image_url')
      .populate('renter_id', 'name phone')
      .populate('owner_id', 'name phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('equipment_id', 'name type image_url description')
      .populate('renter_id', 'name phone location')
      .populate('owner_id', 'name phone location');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has access to this booking
    if (booking.renter_id._id.toString() !== req.user._id.toString() && 
        booking.owner_id._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (owner only)
// @access  Private (Owner)
router.put('/:id/status', [
  auth,
  requireRole(['owner']),
  body('status').isIn(['approved', 'rejected', 'completed', 'cancelled']).withMessage('Valid status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the equipment in this booking
    if (booking.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    // Update booking status
    booking.status = status;
    await booking.save();

    // Update equipment availability
    if (status === 'approved' || status === 'completed') {
      await Equipment.findByIdAndUpdate(booking.equipment_id, { availability_status: 'rented' });
    } else if (status === 'rejected' || status === 'cancelled') {
      await Equipment.findByIdAndUpdate(booking.equipment_id, { availability_status: 'available' });
    }

    const updatedBooking = await Booking.findById(booking._id)
      .populate('equipment_id')
      .populate('renter_id', 'name phone')
      .populate('owner_id', 'name phone');

    res.json({
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel booking (renter only, if pending)
// @access  Private (Farmer)
router.delete('/:id', [auth, requireRole(['farmer'])], async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the renter
    if (booking.renter_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Only allow cancellation of pending bookings
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be cancelled' });
    }

    // Update equipment availability
    await Equipment.findByIdAndUpdate(booking.equipment_id, { availability_status: 'available' });

    // Delete booking
    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
