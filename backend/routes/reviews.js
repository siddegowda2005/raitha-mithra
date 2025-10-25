const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/reviews
// @desc    Post a review for completed booking (farmer only)
// @access  Private (Farmer)
router.post('/', [
  auth,
  requireRole(['farmer']),
  body('booking_id').isMongoId().withMessage('Valid booking ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comments').trim().isLength({ min: 10, max: 500 }).withMessage('Comments must be between 10 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { booking_id, rating, comments } = req.body;

    // Check if booking exists and belongs to the user
    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.renter_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to review this booking' });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Reviews can only be posted for completed bookings' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ booking_id });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    // Create review
    const review = new Review({
      booking_id,
      renter_id: req.user._id,
      equipment_id: booking.equipment_id,
      rating,
      comments
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('renter_id', 'name')
      .populate('equipment_id', 'name');

    res.status(201).json({
      message: 'Review posted successfully',
      review: populatedReview
    });
  } catch (error) {
    console.error('Post review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reviews/equipment/:equipmentId
// @desc    Get reviews for specific equipment
// @access  Public
router.get('/equipment/:equipmentId', async (req, res) => {
  try {
    const reviews = await Review.find({ equipment_id: req.params.equipmentId })
      .populate('renter_id', 'name')
      .populate('equipment_id', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Get equipment reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reviews/my-reviews
// @desc    Get current user's reviews
// @access  Private
router.get('/my-reviews', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ renter_id: req.user._id })
      .populate('equipment_id', 'name type image_url')
      .populate('booking_id', 'start_date end_date')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reviews/:id
// @desc    Get review by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('renter_id', 'name')
      .populate('equipment_id', 'name type')
      .populate('booking_id', 'start_date end_date');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Get review by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update review (reviewer only)
// @access  Private
router.put('/:id', [
  auth,
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('comments').optional().trim().isLength({ min: 10, max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the reviewer
    if (review.renter_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('renter_id', 'name').populate('equipment_id', 'name');

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review (reviewer only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the reviewer
    if (review.renter_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
